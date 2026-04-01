using Lockena.Application.Common;
using Lockena.Application.DTO.Auth;

namespace Lockena.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<Result<AuthDto>> SignUpAsync(SignUpDto request, string fingerprint);
        Task<Result<AuthDto>> SignInAsync(SignInDto request, string fingerprint);
        Task<Result<AuthDto>> RefreshAsync(string refreshToken, string fingerprint);
        Task<Result<AuthDto>> TelegramSignUpAsync(TelegramSignUpDto request, string fingerprint);
        Task<Result<AuthDto>> TelegramSignInAsync(TelegramSignInDto request, string fingerprint);
        Task<Result<string>> LogoutAsync(Guid userId, string fingerprint);
        Task<Result<string>> ConfirmEmail(ConfirmEmailDto request);
        Task<Result<string>> SendEmailConfirmation(SendEmailConfirmation request);
        Task<Result<string>> TelegramLinkEmail(Guid userId, LinkEmailDto request);
    }
}
