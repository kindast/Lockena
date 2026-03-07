namespace Lockena.Application.Interfaces.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(Guid userId);
    }
}
