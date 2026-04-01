using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Lockena.Application.Common;
using Lockena.Application.DTO.Auth;
using Lockena.Application.DTO.User;
using Lockena.Application.Interfaces.Services;
using Lockena.Domain.Entities;
using System.Text.Json;
using System.Web;
using Lockena.Application.Interfaces.Repository;

namespace Lockena.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;
        private readonly IRefreshService _refreshService;
        private readonly IConfiguration _configuration;
        private readonly ITelegramService _telegramService;
        private readonly JwtSettings _jwtSettings;
        private readonly IMailService _mailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICryptoService _cryptoService;

        public AuthService(IUserService userService,
            IJwtService jwtService,
            IRefreshService refreshService,
            IConfiguration configuration,
            ITelegramService telegramService, 
            IOptions<JwtSettings> jwtSettings,
            IUnitOfWork unitOfWork,
            ICryptoService cryptoService,
            IMailService mailService)
        {
            _userService = userService;
            _jwtService = jwtService;
            _refreshService = refreshService;
            _configuration = configuration;
            _telegramService = telegramService;
            _jwtSettings = jwtSettings.Value;
            _mailService = mailService;
            _unitOfWork = unitOfWork;
            _cryptoService = cryptoService;
        }

        public async Task<Result<AuthDto>> SignUpAsync(SignUpDto request, string fingerprint)
        {
            //Создаём пользователя
            var user = await _userService.CreateUserAsync(request);
            if (!user.IsSuccess || user.Value == null)
                return Result<AuthDto>.Failure(user.Status, user.Errors);

            //Генерируем access token
            var accessToken = _jwtService.GenerateJwtToken(user.Value.Id);

            //Генерируем refresh token
            var refreshToken = await _refreshService.GenerateAsync(user.Value, 
                fingerprint, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays));
            
            //Отправляем письмо с токеном
            await _mailService.SendEmailAsync(user.Value.Id, user.Value.Email);

            //Формируем ответ
            var response = new AuthDto 
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Value.Email,
                EncryptedMasterKey = user.Value.EncryptedMasterKey,
                Salt = user.Value.Salt,
                MasterKeyIv = user.Value.MasterKeyIv,
            };

            return Result<AuthDto>.Success(response);
        }

        public async Task<Result<AuthDto>> SignInAsync(SignInDto request, string fingerprint)
        {
            //Получаем пользователя
            var user = await _userService.GetUserAsync(request.Email, request.Password);
            if (!user.IsSuccess || user.Value == null)
                return Result<AuthDto>.Failure(user.Status, user.Errors);

            if (!user.Value.EmailConfirmed)
            {
                await _mailService.SendEmailAsync(user.Value.Id, user.Value.Email);
                return Result<AuthDto>.Failure(400, "Проверьте почту: мы отправили вам письмо для подтверждения.");
            }     

            //Генерируем access token
            var accessToken = _jwtService.GenerateJwtToken(user.Value.Id);

            //Генерируем refresh token
            var refreshToken = await _refreshService.GenerateAsync(user.Value,
                fingerprint, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays));

            //Формируем ответ
            var response = new AuthDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Value.Email,
                EncryptedMasterKey = user.Value.EncryptedMasterKey,
                Salt = user.Value.Salt,
                MasterKeyIv = user.Value.MasterKeyIv,
            };

            return Result<AuthDto>.Success(response);
        }

        public async Task<Result<AuthDto>> RefreshAsync(string refreshToken, string fingerprint)
        {
            //Получаем пользователя
            var user = await _refreshService.CompareAsync(refreshToken, fingerprint);
            if (!user.IsSuccess || user.Value == null)
                return Result<AuthDto>.Failure(user.Status, user.Errors);
            
            //Генерируем access token
            var accessToken = _jwtService.GenerateJwtToken(user.Value.Id);

            //Генерируем refresh token
            refreshToken = await _refreshService.GenerateAsync(user.Value,
                fingerprint, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays),
                refreshToken);

            //Формируем ответ
            var response = new AuthDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Value.Email,
                EncryptedMasterKey = user.Value.EncryptedMasterKey,
                Salt = user.Value.Salt,
                MasterKeyIv = user.Value.MasterKeyIv,
            };

            return Result<AuthDto>.Success(response);
        }

        public async Task<Result<string>> LogoutAsync(Guid userId, string fingerprint)
        {
            await _refreshService.RevokeAsync(userId, fingerprint);
            return Result<string>.Success("Выход из системы выполнен успешно");
        }

        public async Task<Result<AuthDto>> TelegramSignUpAsync(TelegramSignUpDto request, string fingerprint)
        {
            //Получаем токен бота из конфигурации
            var botToken = _configuration["TelegramBotToken"];
            if (botToken == null || !_telegramService.Validate(request.InitData, botToken))
                return Result<AuthDto>.Failure(400, "Неверные данные авторизации");

            // Парсим данные и извлекаем информацию о пользователе
            var query = HttpUtility.ParseQueryString(request.InitData);
            var userJson = query["user"];
            if (userJson == null)
                return Result<AuthDto>.Failure(400, "Неверные данные авторизации");
            var tgUser = JsonSerializer.Deserialize<TelegramUser>(userJson);

            // Проверяем, существует ли пользователь с таким Telegram ID
            if (tgUser == null)
                return Result<AuthDto>.Failure(400, "Неверные данные авторизации");
            var existingUser = await _userService.GetUserByTelegramIdAsync(tgUser.Id);
            User user;
            if (existingUser.IsSuccess && existingUser.Value != null)
                user = existingUser.Value;
            else
            {
                // Пользователь не существует, создаём нового
                var userResult = await _userService.CreateTelegramUserAsync(tgUser, request);
                if(!userResult.IsSuccess || userResult.Value == null)
                    return Result<AuthDto>.Failure(userResult.Status, userResult.Errors);
                
                user = userResult.Value;
            }

            //Генерируем access token
            var accessToken = _jwtService.GenerateJwtToken(user.Id);

            //Генерируем refresh token
            var refreshToken = await _refreshService.GenerateAsync(user,
                fingerprint, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays));

            //Формируем ответ
            var response = new AuthDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Email,
                EncryptedMasterKey = user.EncryptedMasterKey,
                Salt = user.Salt,
                MasterKeyIv = user.MasterKeyIv,
            };

            return Result<AuthDto>.Success(response);
        }

        public async Task<Result<AuthDto>> TelegramSignInAsync(TelegramSignInDto request, string fingerprint)
        {
            //Получаем токен бота из конфигурации
            var botToken = _configuration["TelegramBotToken"];
            if (botToken == null || !_telegramService.Validate(request.InitData, botToken))
                return Result<AuthDto>.Failure(400, "Неверные данные авторизации");

            // Парсим данные и извлекаем информацию о пользователе
            var query = HttpUtility.ParseQueryString(request.InitData);
            var userJson = query["user"];
            if (userJson == null)
                return Result<AuthDto>.Failure(400, "Неверные данные авторизации");
            var tgUser = JsonSerializer.Deserialize<TelegramUser>(userJson);

            // Проверяем, существует ли пользователь с таким Telegram ID
            if (tgUser == null)
                return Result<AuthDto>.Failure(400, "Неверные данные авторизации");
            var existingUser = await _userService.GetUserByTelegramIdAsync(tgUser.Id);
            User user;
            if (existingUser.IsSuccess && existingUser.Value != null)
                user = existingUser.Value;
            else
                return Result<AuthDto>.Failure(404, "Пользователь с таким Telegram ID не найден");

            //Генерируем access token
            var accessToken = _jwtService.GenerateJwtToken(user.Id);

            //Генерируем refresh token
            var refreshToken = await _refreshService.GenerateAsync(user,
                fingerprint, DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenLifetimeDays));

            //Формируем ответ
            var response = new AuthDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Email,
                EncryptedMasterKey = user.EncryptedMasterKey,
                Salt = user.Salt,
                MasterKeyIv = user.MasterKeyIv,
            };

            return Result<AuthDto>.Success(response);
        }

        public async Task<Result<string>> TelegramLinkEmail(Guid userId, LinkEmailDto request)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return Result<string>.Failure(400, "Не удалось найти пользователя");
            if (await _unitOfWork.Users.IsEmailExistsAsync(request.Email))
                return Result<string>.Failure(400, "Данный адрес электронной почты уже занят");
            var sended = await _mailService.SendEmailAsync(user.Id, request.Email);
            if (!sended) return Result<string>.Failure(400, $"Не удалось отправить письмо на почту: {user.Email}");
            return Result<string>.Success("Ссылка для подтверждения почты успешно отправлена");
        }
        
        public async Task<Result<string>> ConfirmEmail(ConfirmEmailDto request)
        {
            var verified = await _mailService.VerifyEmailAsync(request.Token);
            if (!verified) return Result<string>.Failure(400, "К сожалению, не удалось подтвердить ваш адрес электронной почты");
            return Result<string>.Success("Ваш адрес электронной почты успешно подтвержден");
        }

        public async Task<Result<string>> SendEmailConfirmation(SendEmailConfirmation request)
        {
            User? user = await _unitOfWork.Users.GetByEmailAsync(request.Credentials);
            if (user == null)
            {
                var token = await _unitOfWork.EmailTokens.GetByHashAsync(
                    _cryptoService.Hash(request.Credentials));
                if (token == null) return Result<string>.Failure(400, "Не удалось найти пользователя");
                user = await _unitOfWork.Users.GetByIdAsync(token.UserId);
            }

            if (user == null) return Result<string>.Failure(400, "Не удалось найти пользователя");
            var sended = await _mailService.SendEmailAsync(user.Id, user.Email);
            if (!sended) return Result<string>.Failure(400, $"Не удалось отправить письмо на почту: {user.Email}");
            return Result<string>.Success("Ссылка для подтверждения почты успешно отправлена");
        }
    }
}
