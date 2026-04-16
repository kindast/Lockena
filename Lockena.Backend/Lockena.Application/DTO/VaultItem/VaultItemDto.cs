namespace Lockena.Application.DTO.VaultItem
{
    public class VaultItemDto
    {
        public Guid Id { get; set; }
        public string EncryptedItemKey { get; set; }
        public string EncryptedPayload { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime UpdatedAtUtc { get; set; }

        public VaultItemDto(Domain.Entities.VaultItem item)
        {
            Id = item.Id;
            EncryptedItemKey = item.EncryptedItemKey;
            EncryptedPayload = item.EncryptedPayload;
            CreatedAtUtc = item.CreatedAtUtc;
            UpdatedAtUtc = item.UpdatedAtUtc;
        }
    }
}
