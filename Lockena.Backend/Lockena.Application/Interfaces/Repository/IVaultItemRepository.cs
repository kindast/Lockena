using Lockena.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.Interfaces.Repository
{
    public interface IVaultItemRepository
    {
        Task AddAsync(VaultItem vaultItem);
        Task DeleteAsync(VaultItem vaultItem);
        Task<VaultItem?> GetByIdAsync(Guid id, Guid userId);
        Task<ICollection<VaultItem>> GetAsync(Guid userId);
        Task<int> GetCountAsync(Guid userId);
    }
}
