using Lockena.Application.Common;
using Lockena.Application.DTO.Auth;
using Lockena.Application.DTO.User;
using Lockena.Domain.Entities;

namespace Lockena.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<Result<User>> CreateUserAsync(SignUpDto request);
        Task<Result<User>> CreateTelegramUserAsync(TelegramUser user, TelegramSignUpDto request);
        Task<Result<User>> GetUserAsync(string email, string password);
        Task<Result<ProfileDto>> GetUserAsync(Guid userId);
        Task<Result<string>> ChangePasswordAsync(Guid userId, ChangePasswordDto request);
        Task<Result<string>> DeleteUserAsync(Guid userId, string password);
        Task<Result<User>> GetUserByTelegramIdAsync(long telegramId);
    }
}
