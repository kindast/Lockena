using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Lockena.API.Middleware;
using Lockena.Application.Common;
using Lockena.Application.DTO;
using Lockena.Application.DTO.Auth;
using Lockena.Application.Interfaces.Services;

namespace Lockena.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly JwtSettings _jwtSettings;

        public AuthController(IAuthService authService, IOptions<JwtSettings> jwtSettings)
        {
            _authService = authService;
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost("signUp")]
        public async Task<ActionResult<AuthDto>> SignUp([FromBody] SignUpDto request)
        {
            var result = await _authService.SignUpAsync(request, GetFingerprintString());
            if (!result.IsSuccess || result.Value == null) 
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));

            AppendCookie(result.Value);
            return CreatedAtAction(nameof(SignUp), result.Value);
        }

        [HttpPost("signIn")]
        public async Task<ActionResult<AuthDto>> SignIn([FromBody] SignInDto request)
        {
            var result = await _authService.SignInAsync(request, GetFingerprintString());
            if (!result.IsSuccess || result.Value == null) 
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));

            AppendCookie(result.Value);
            return Ok(result.Value);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthDto>> Refresh()
        {
            Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized();
            var result = await _authService.RefreshAsync(refreshToken, GetFingerprintString());
            if (!result.IsSuccess || result.Value == null)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));

            AppendCookie(result.Value);
            return Ok(result.Value);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult<MessageDto>> Logout()
        {
            var userId = HttpContext.GetUserId();
            var result = await _authService.LogoutAsync(userId, GetFingerprintString());
            if (!result.IsSuccess)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            Response.Cookies.Delete("refreshToken");
            return Ok(new MessageDto(result.Value ?? "Success", 200));
        }

        [HttpPost("telegram-signup")]
        public async Task<ActionResult<AuthDto>> TelegramSignUp([FromBody] TelegramSignUpDto request)
        {
            var result = await _authService.TelegramSignUpAsync(request, GetFingerprintString());
            if (!result.IsSuccess || result.Value == null)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            AppendCookie(result.Value);
            return Ok(result.Value);
        }

        [HttpPost("telegram-signin")]
        public async Task<ActionResult<AuthDto>> TelegramSignIn([FromBody] TelegramSignInDto request)
        {
            var result = await _authService.TelegramSignInAsync(request, GetFingerprintString());
            if (!result.IsSuccess || result.Value == null)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            AppendCookie(result.Value);
            return Ok(result.Value);
        }

        private void AppendCookie(AuthDto auth)
        {
            var options = new CookieOptions()
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                MaxAge = TimeSpan.FromDays(_jwtSettings.RefreshTokenLifetimeDays)
            };
            Response.Cookies.Append("refreshToken", auth.RefreshToken, options);
        }

        private string GetFingerprintString()
        {
            IHeaderDictionary headers = Request.Headers;
            return $"{headers.UserAgent};{headers.AcceptLanguage};{headers.AcceptEncoding};";
        }
    }
}
