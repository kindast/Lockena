namespace Lockena.Application.Interfaces.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        IRefreshTokenRepository RefreshTokens { get; }
        IVaultItemRepository VaultItems { get; }
        IEmailTokenRepository EmailTokens { get; }

        Task<int> SaveChangesAsync();
    }
}
