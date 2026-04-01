namespace Lockena.Domain.Entities;

public class EmailToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? NewEmail { get; set; }
    public string TokenHash { get; set; } 
    public bool IsRevoked { get; set; }    
    public DateTime ExpiresAtUtc { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}