using Microsoft.EntityFrameworkCore;
using Lockena.Application.Interfaces.Repository;
using Lockena.Domain.Entities;
using Lockena.Infrastructure.Data;

namespace Lockena.Infrastructure.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DbSet<User> _users;

        public UserRepository(ApplicationDbContext context)
        {
            _users = context.Users;
        }

        public async Task AddAsync(User user)
        {
            await _users.AddAsync(user);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _users.ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public Task DeleteAsync(User user)
        {
            _users.Remove(user);
            return Task.CompletedTask;
        }

        public Task UpdateAsync(User user)
        {
            _users.Update(user);
            return Task.CompletedTask;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> GetByTelegramIdAsync(long telegramId)
        {
            return await _users.FirstOrDefaultAsync(u => u.TelegramId == telegramId);
        }
    }
}
