namespace Lockena.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string TokenHash { get; set; } = null!;

        public string FingerPrint { get; set; } = null!;

        public DateTime ExpiresAtUtc { get; set; }

        public DateTime CreatedAtUtc { get; set; }

        public bool IsRevoked { get; set; }

        public string? ReplacedBy { get; set; }

        public User User { get; set; } = null!;
    }
}
