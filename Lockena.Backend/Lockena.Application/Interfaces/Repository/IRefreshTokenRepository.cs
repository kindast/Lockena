using Lockena.Domain.Entities;

namespace Lockena.Application.Interfaces.Repository
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByHashAsync(string tokenHash);
        Task<ICollection<RefreshToken>?> GetByUserAsync(Guid userId);
        Task<bool> IsReusedAsync(string tokenHash);
        Task AddAsync(RefreshToken refreshToken);
        Task DeleteAsync(RefreshToken refreshToken);
        Task DeleteAsync(ICollection<RefreshToken> refreshTokens);
    }
}
