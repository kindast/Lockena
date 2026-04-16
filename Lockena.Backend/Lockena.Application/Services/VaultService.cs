using Lockena.Application.Common;
using Lockena.Application.DTO;
using Lockena.Application.DTO.VaultItem;
using Lockena.Application.Interfaces.Repository;
using Lockena.Application.Interfaces.Services;
using Lockena.Domain.Entities;

namespace Lockena.Application.Services
{
    public class VaultService : IVaultService
    {
        private readonly IUnitOfWork _unitOfWork;
        public VaultService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public async Task<Result<GetVaultItemsDto>> GetAsync(Guid userId, GetVaultItemsParamsDto request)
        {
            var items = await _unitOfWork.VaultItems.GetAsync(userId);

            //Пагинация
            int pageSize = Math.Clamp(request.PageSize, 1, 1000);
            var itemsDto = 
                items
                .Select(i => new VaultItemDto(i))
                .OrderByDescending(i => i.UpdatedAtUtc)
                .Skip((request.Page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var response = new GetVaultItemsDto()
            {
                Items = itemsDto,
                Page = request.Page,
                PageSize = pageSize,
                Total = items.Count
            };

            return Result<GetVaultItemsDto>.Success(response);
        }

        public async Task<Result<VaultItemDto>> GetByIdAsync(Guid userId, Guid id)
        {
            var item = await _unitOfWork.VaultItems.GetByIdAsync(userId, id);
            if (item == null)
                return Result<VaultItemDto>.Failure(404, "Item not fount");

            return Result<VaultItemDto>.Success(new VaultItemDto(item));
        }

        public async Task<Result<VaultItemDto>> CreateAsync(Guid userId, CreateVaultItemDto request)
        {
            var count = await _unitOfWork.VaultItems.GetCountAsync(userId);
            if (count == 1000)
                return Result<VaultItemDto>.Failure(403, "Достигнут лимит в 1000 записей");

            var item = new VaultItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                EncryptedItemKey = request.EncryptedItemKey,
                EncryptedPayload = request.EncryptedPayload,
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow,
            };

            await _unitOfWork.VaultItems.AddAsync(item);
            await _unitOfWork.SaveChangesAsync();

            return Result<VaultItemDto>.Success(new VaultItemDto(item));
        }

        public async Task<Result<MessageDto>> DeleteAsync(Guid userId, Guid id)
        {
            var item = await _unitOfWork.VaultItems.GetByIdAsync(id, userId);
            if (item == null) return Result<MessageDto>.Failure(404, "Item not found");
            await _unitOfWork.VaultItems.DeleteAsync(item);
            await _unitOfWork.SaveChangesAsync();

            return Result<MessageDto>.Success(new MessageDto("Item deleted", 200));
        }

        public async Task<Result<VaultItemDto>> UpdateAsync(Guid userId, Guid itemId, CreateVaultItemDto request)
        {
            var item = await _unitOfWork.VaultItems.GetByIdAsync(itemId, userId);
            if (item == null) return Result<VaultItemDto>.Failure(404, "Item not found");

            item.UpdatedAtUtc = DateTime.UtcNow;
            item.EncryptedItemKey = request.EncryptedItemKey;
            item.EncryptedPayload = request.EncryptedPayload;

            await _unitOfWork.SaveChangesAsync();

            return Result<VaultItemDto>.Success(new VaultItemDto(item));
        }
    }
}
