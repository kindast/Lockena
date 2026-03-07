namespace Lockena.Domain.Entities
{
    public class User
    {
        public required Guid Id { get; set; }

        public required string Email { get; set; }

        public required string PasswordHash { get; set; }

        public required string Salt { get; set; }

        public required string EncryptedMasterKey { get; set; }

        public required string MasterKeyIv { get; set; }

        public long? TelegramId { get; set; }

        public required DateTime CreatedAtUtc { get; set; }

        public required DateTime UpdatedAtUtc { get; set; }

        public virtual ICollection<VaultItem> VaultItems { get; set; } = new List<VaultItem>();

        public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
