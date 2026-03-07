using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Lockena.Application.Common;
using Lockena.Application.DTO.Auth;
using Lockena.Application.DTO.User;
using Lockena.Application.Interfaces.Services;
using Lockena.Domain.Entities;
using System.Text.Json;
using System.Web;

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

        public AuthService(IUserService userService,
            IJwtService jwtService,
            IRefreshService refreshService,
            IConfiguration configuration,
            ITelegramService telegramService, 
            IOptions<JwtSettings> jwtSettings)
        {
            _userService = userService;
            _jwtService = jwtService;
            _refreshService = refreshService;
            _configuration = configuration;
            _telegramService = telegramService;
            _jwtSettings = jwtSettings.Value;
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
    }
}
