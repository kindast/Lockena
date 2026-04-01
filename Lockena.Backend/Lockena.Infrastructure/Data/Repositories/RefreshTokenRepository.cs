using Microsoft.EntityFrameworkCore;
using Lockena.Application.Interfaces.Repository;
using Lockena.Domain.Entities;
using Lockena.Infrastructure.Data;

namespace Lockena.Infrastructure.Data.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly DbSet<RefreshToken> _refreshTokens;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _refreshTokens = context.RefreshTokens;
        }

        public async Task<RefreshToken?> GetByHashAsync(string tokenHash)
        {
            return await _refreshTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);
        }
        public async Task<ICollection<RefreshToken>?> GetByUserAsync(Guid userId)
        {
            return await _refreshTokens.Where(t => t.UserId == userId).ToListAsync();
        }

        public async Task AddAsync(RefreshToken refreshToken)
        {
            await _refreshTokens.AddAsync(refreshToken);
        }

        public Task DeleteAsync(RefreshToken refreshToken)
        {
            _refreshTokens.Remove(refreshToken);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(ICollection<RefreshToken> refreshTokens)
        {
            _refreshTokens.RemoveRange(refreshTokens);
            return Task.CompletedTask;
        }

        public async Task<bool> IsReusedAsync(string tokenHash)
        {
            return await _refreshTokens.AnyAsync(t => t.ReplacedBy == tokenHash);
        }
    }
}
