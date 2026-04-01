namespace Lockena.Application.DTO.User
{
    public class ProfileDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ProfileDto(Domain.Entities.User user)
        {
            Id = user.Id;
            Email = user.Email;
            CreatedAt = user.CreatedAtUtc;
            UpdatedAt = user.UpdatedAtUtc;
        }
    }
}
