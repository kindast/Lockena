using Lockena.Domain.Entities;

namespace Lockena.Application.Interfaces.Services;

public interface IMailService
{
    Task<bool> SendEmailAsync(Guid userId, string email);
    Task<bool> VerifyEmailAsync(string token);
}