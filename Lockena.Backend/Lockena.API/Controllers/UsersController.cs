using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Lockena.API.Middleware;
using Lockena.Application.DTO;
using Lockena.Application.DTO.User;
using Lockena.Application.Interfaces.Services;

namespace Lockena.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            var userId = HttpContext.GetUserId();
            var result = await _userService.GetUserAsync(userId);
            if (!result.IsSuccess) return BadRequest(new ErrorDto(result.Errors ?? [], 400));
            return Ok(result.Value);
        }

        [HttpPut("change-password")]
        [Authorize]
        public async Task<ActionResult<MessageDto>> ChangePassword([FromBody] ChangePasswordDto request)
        {
            var userId = HttpContext.GetUserId();
            var result = await _userService.ChangePasswordAsync(userId, request);
            if (!result.IsSuccess) return BadRequest(new ErrorDto(result.Errors ?? [], 400));
            return Ok(new MessageDto(result.Value ?? "", 200));
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult<MessageDto>> DeleteAccount([FromBody] DeleteAccountDto request)
        {
            var userId = HttpContext.GetUserId();
            var result = await _userService.DeleteUserAsync(userId, request.Password);
            if (!result.IsSuccess) return BadRequest(new ErrorDto(result.Errors ?? [], 400));
            return Ok(new MessageDto(result.Value ?? "", 200));
        }
    }
}
