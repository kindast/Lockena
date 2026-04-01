using Lockena.Domain.Entities;

namespace Lockena.Application.Interfaces.Repository;

public interface IEmailTokenRepository
{
    Task<EmailToken?> GetByHashAsync(string tokenHash);
    Task AddAsync(EmailToken emailToken);
}