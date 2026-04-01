using Lockena.Application.Common;
using Lockena.Domain.Entities;

namespace Lockena.Application.Interfaces.Services
{
    public interface IRefreshService
    {

        Task<string> GenerateAsync(User user, string fingerprint,
            DateTime expires, string oldToken = "");

        Task<Result<User>> CompareAsync(string refreshToken, string fingerprint);

        Task<Result<string>> RevokeAsync(Guid userId, string fingerprint);
    }
}
