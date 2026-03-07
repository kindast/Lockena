using Lockena.Application.Common;
using Lockena.Application.DTO.Auth;
using Lockena.Application.DTO.User;
using Lockena.Application.Interfaces.Repository;
using Lockena.Application.Interfaces.Services;
using Lockena.Domain.Entities;

namespace Lockena.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICryptoService _cryptoService;

        public UserService(IUnitOfWork unitOfWork, ICryptoService cryptoService)
        {
            _unitOfWork = unitOfWork;
            _cryptoService = cryptoService;
        }

        public async Task<Result<User>> CreateUserAsync(SignUpDto request)
        {
            //Проверка уникальности email
            var isEmailExists = await _unitOfWork.Users.IsEmailExistsAsync(request.Email);
            if (isEmailExists)
                return Result<User>.Failure(400, "Данный email адрес уже занят");

            //Хэшируем пароль
            var passwordHash = _cryptoService.Hash(request.Password, Base64Converter.FromBase64Url(request.Salt));

            //Создаём модель
            var user = new User()
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = passwordHash,
                Salt = request.Salt,
                EncryptedMasterKey = request.EncryptedMasterKey,
                MasterKeyIv = request.MasterKeyIv,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow,
            };

            //Добавляем в бд и сохраняем
            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return Result<User>.Success(user);
        }

        public async Task<Result<User>> CreateTelegramUserAsync(TelegramUser user, TelegramSignUpDto request)
        {
            //Инициализируем недостающие данные
            var email = $"{(user.Username ?? user.Id.ToString())}@telegram";
            var passwordHash = _cryptoService.Hash(Guid.NewGuid().ToString(), Base64Converter.FromBase64Url(request.Salt));

            //Создаём модель
            var newUser = new User()
            {
                Id = Guid.NewGuid(),
                Email = email,
                PasswordHash = passwordHash,
                Salt = request.Salt,
                EncryptedMasterKey = request.EncryptedMasterKey,
                MasterKeyIv = request.MasterKeyIv,
                TelegramId = user.Id,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow,
            };

            //Добавляем в бд и сохраняем
            await _unitOfWork.Users.AddAsync(newUser);
            await _unitOfWork.SaveChangesAsync();

            return Result<User>.Success(newUser);
        }

        public async Task<Result<User>> GetUserAsync(string email, string password)
        {
            //Получаем пользователя по почте
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                return Result<User>.Failure(400, "Неверные учётные данные");

            //Проверяем хэши паролей
            var passwordHash = _cryptoService.Hash(password,
                            Base64Converter.FromBase64Url(user.Salt));
            if (user.PasswordHash != passwordHash)
                return Result<User>.Failure(400, "Неверные учётные данные");

            return Result<User>.Success(user);
        }

        public async Task<Result<ProfileDto>> GetUserAsync(Guid userId)
        {
            //Получаем пользователя
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<ProfileDto>.Failure(404, "Запрошенный пользователь не найден");

            return Result<ProfileDto>.Success(new ProfileDto(user));
        }

        public async Task<Result<string>> ChangePasswordAsync(Guid userId, ChangePasswordDto request)
        {
            //Получаем пользователя
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<string>.Failure(404, "Запрошенный пользователь не найден");

            //Проверка старого пароля
            if (user.PasswordHash != _cryptoService.Hash(request.CurrentPassword,
                Base64Converter.FromBase64Url(user.Salt)))
                return Result<string>.Failure(400, "Неверный пароль");

            //Хэшируем новый пароль и присваеваем его пользователю
            user.EncryptedMasterKey = request.EncryptedMasterKey;
            user.MasterKeyIv = request.MasterKeyIv;
            user.Salt = request.Salt;
            var password = _cryptoService.Hash(request.NewPassword, Base64Converter.FromBase64Url(request.Salt));
            user.PasswordHash = password;

            //Обновляем пользователя и сохраняем в бд
            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return Result<string>.Success("Пароль был успешно изменён");
        }

        public async Task<Result<string>> DeleteUserAsync(Guid userId, string password)
        {
            //Получаем пользователя
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return Result<string>.Failure(404, "Запрошенный пользователь не найден");

            //Проверка пароля
            if (!user.Email.Contains("@telegram") && user.PasswordHash != _cryptoService.Hash(password,
                Base64Converter.FromBase64Url(user.Salt)))
                return Result<string>.Failure(400, "Неверный пароль");

            //Удаляем пользователя и сохраняем бд
            await _unitOfWork.Users.DeleteAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return Result<string>.Success("Аккаунт был успешно удалён");
        }

        public async Task<Result<User>> GetUserByTelegramIdAsync(long telegramId)
        {
            //Получаем пользователя
            var user = await _unitOfWork.Users.GetByTelegramIdAsync(telegramId);
            if (user == null)
                return Result<User>.Failure(404, "Запрошенный пользователь не найден");

            return Result<User>.Success(user);
        }
    }
}
