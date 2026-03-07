using Lockena.Application.Common;
using Lockena.Application.DTO;
using Lockena.Application.DTO.VaultItem;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.Interfaces.Services
{
    public interface IVaultService
    {
        Task<Result<GetVaultItemsDto>> GetAsync(Guid userId, GetVaultItemsParamsDto request);
        Task<Result<VaultItemDto>> GetByIdAsync(Guid userId, Guid id);
        Task<Result<VaultItemDto>> CreateAsync(Guid userId, CreateVaultItemDto request);
        Task<Result<VaultItemDto>> UpdateAsync(Guid userId, Guid itemId, CreateVaultItemDto request);
        Task<Result<MessageDto>> DeleteAsync(Guid userId, Guid id);
    }
}
