using Lockena.Domain.Entities;

namespace Lockena.Application.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByTelegramIdAsync(long telegramId);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(User user);
        Task<bool> IsEmailExistsAsync(string email);
    }
}
