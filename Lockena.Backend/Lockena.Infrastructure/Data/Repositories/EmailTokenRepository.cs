using Lockena.Application.Interfaces.Repository;
using Lockena.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Lockena.Infrastructure.Data.Repositories;

public class EmailTokenRepository : IEmailTokenRepository
{
    private readonly DbSet<EmailToken> _emailTokens;

    public EmailTokenRepository(ApplicationDbContext context)
    {
        _emailTokens = context.EmailTokens;
    }
    
    public async Task<EmailToken?> GetByHashAsync(string tokenHash)
    {
        return await _emailTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);
    }

    public async Task AddAsync(EmailToken emailToken)
    {
        await _emailTokens.AddAsync(emailToken);
    }
}