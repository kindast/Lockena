using Microsoft.EntityFrameworkCore;
using Lockena.Application.Interfaces.Repository;
using Lockena.Domain.Entities;

namespace Lockena.Infrastructure.Data.Repositories
{
    public class VaultItemRepository : IVaultItemRepository
    {
        private readonly DbSet<VaultItem> _vaultItems;
        public VaultItemRepository(ApplicationDbContext context) => _vaultItems = context.VaultItems;

        public async Task AddAsync(VaultItem vaultItem)
        {
            await _vaultItems.AddAsync(vaultItem);
        }

        public Task DeleteAsync(VaultItem vaultItem)
        {
            _vaultItems.Remove(vaultItem);
            return Task.CompletedTask;
        }

        public async Task<ICollection<VaultItem>> GetAsync(Guid userId)
        {
            return await _vaultItems.Where(v => v.UserId == userId).ToListAsync();
        }

        public async Task<VaultItem?> GetByIdAsync(Guid id, Guid userId)
        {
            return await _vaultItems.FirstOrDefaultAsync(v => v.Id == id && v.UserId == userId);
        }

        public async Task<int> GetCountAsync(Guid userId)
        {
            return await _vaultItems.Where(v => v.UserId == userId).CountAsync();
        }
    }
}
