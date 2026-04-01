using Lockena.Application.Common;
using Lockena.Application.Interfaces.Repository;
using Lockena.Application.Interfaces.Services;
using Lockena.Domain.Entities;
using System.Security.Cryptography;

namespace Lockena.Application.Services
{
    public class RefreshService : IRefreshService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICryptoService _cryptoService;

        public RefreshService(IUnitOfWork unitOfWork, ICryptoService cryptoService)
        {
            _unitOfWork = unitOfWork;
            _cryptoService = cryptoService;
        }

        public async Task<string> GenerateAsync(User user, string fingerprint,
            DateTime expires, string oldToken = "")
        {
            //Делаем старый токен revoked
            if (!string.IsNullOrEmpty(oldToken))
            {
                oldToken = _cryptoService.Hash(oldToken);
                var old = await _unitOfWork.RefreshTokens.GetByHashAsync(oldToken);
                if(old != null) old.IsRevoked = true;
            }

            //Генерируем новый токен
            var bytes = new byte[64];
            RandomNumberGenerator.Fill(bytes);
            var refreshToken = Convert.ToHexString(bytes);

            //Создаём модель
            var token = new RefreshToken()
            {
                TokenHash = _cryptoService.Hash(refreshToken),
                UserId = user.Id,
                ExpiresAtUtc = expires,
                CreatedAtUtc = DateTime.UtcNow,
                IsRevoked = false,
                FingerPrint = _cryptoService.Hash(fingerprint),
                ReplacedBy = string.IsNullOrEmpty(oldToken) ? null : oldToken,
            };

            //Сохраняем в бд
            await _unitOfWork.RefreshTokens.AddAsync(token);
            await _unitOfWork.SaveChangesAsync();

            return refreshToken;
        }
        public async Task<Result<User>> CompareAsync(string refreshToken, string fingerprint)
        {
            //Получаем текущий refresh token
            var token = await _unitOfWork.RefreshTokens.GetByHashAsync(_cryptoService.Hash(refreshToken));
            if (token == null)
                return Result<User>.Failure(401);

            //Получаем пользователя
            var user = await _unitOfWork.Users.GetByIdAsync(token.UserId);
            if (user == null)
                return Result<User>.Failure(401);

            //Проверяем fingerprint 
            if (fingerprint != "extension" && token.FingerPrint != _cryptoService.Hash(fingerprint))
                return Result<User>.Failure(401);

            //Проверяем срок действия
            if (token.ExpiresAtUtc < DateTime.UtcNow)
                return Result<User>.Failure(401);

            //Если токен revoked и был заменён помечаем все токены revoked
            if (token.IsRevoked && token.ReplacedBy != null)
            {
                var tokens = await _unitOfWork.RefreshTokens.GetByUserAsync(token.UserId);
                if (tokens != null)
                {
                    foreach (var t in tokens) t.IsRevoked = true;
                    await _unitOfWork.SaveChangesAsync();
                }
                return Result<User>.Failure(401);
            }

            if (token.IsRevoked)
                return Result<User>.Failure(401);
            
            return Result<User>.Success(user);
        }

        public async Task<Result<string>> RevokeAsync(Guid userId, string fingerprint)
        {
            //Получаем все токены пользователя
            var tokens = await _unitOfWork.RefreshTokens.GetByUserAsync(userId);
            if (tokens == null)
                return Result<string>.Failure(400, "Для данного пользователя не найдены refresh token");

            //Помечаем токены с тем же fingerprint revoked и сохраняем бд
            var fingerprintHash = _cryptoService.Hash(fingerprint);
            foreach (var token in tokens)
                if (token.FingerPrint == fingerprintHash)
                    token.IsRevoked = true;
            await _unitOfWork.SaveChangesAsync();

            return Result<string>.Success("Refresh token пользователя были удалены");
        }
    }
}
