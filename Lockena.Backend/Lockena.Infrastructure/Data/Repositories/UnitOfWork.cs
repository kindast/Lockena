using Lockena.Application.Interfaces.Repository;
using Lockena.Infrastructure.Data;

namespace Lockena.Infrastructure.Data.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public IUserRepository Users { get; }
        public IRefreshTokenRepository RefreshTokens { get; }
        public IVaultItemRepository VaultItems { get; }

        public UnitOfWork(
            ApplicationDbContext context,
            IUserRepository userRepository,
            IRefreshTokenRepository refreshTokenRepository,
            IVaultItemRepository vaultItems)
        {
            _context = context;
            Users = userRepository;
            RefreshTokens = refreshTokenRepository;
            VaultItems = vaultItems;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}