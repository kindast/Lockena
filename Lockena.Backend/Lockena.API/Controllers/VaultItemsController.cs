using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Lockena.API.Middleware;
using Lockena.Application.DTO;
using Lockena.Application.DTO.VaultItem;
using Lockena.Application.Interfaces.Services;
using Lockena.Application.Services;
using Lockena.Domain.Entities;

namespace Lockena.API.Controllers
{
    [Route("vault-items")]
    [ApiController]
    public class VaultItemsController : ControllerBase
    {
        private readonly IVaultService _vaultService;
        public VaultItemsController(IVaultService vaultService)
        {
            _vaultService = vaultService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<GetVaultItemsDto>> Get([FromQuery] GetVaultItemsParamsDto request)
        {
            var userId = HttpContext.GetUserId();
            var result = await _vaultService.GetAsync(userId, request);
            if (!result.IsSuccess) 
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            return Ok(result.Value);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<VaultItemDto>> Get(Guid id)
        {
            var userId = HttpContext.GetUserId();
            var result = await _vaultService.GetByIdAsync(userId, id);
            if (!result.IsSuccess)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            return Ok(result.Value);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<VaultItemDto>> Post([FromBody] CreateVaultItemDto request)
        {
            var userId = HttpContext.GetUserId();
            var result = await _vaultService.CreateAsync(userId, request);
            if (!result.IsSuccess)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            return Ok(result.Value);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<VaultItemDto>> Put(Guid id, [FromBody] CreateVaultItemDto request)
        {
            var userId = HttpContext.GetUserId();
            var result = await _vaultService.UpdateAsync(userId, id, request);
            if (!result.IsSuccess)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            return Ok(result.Value);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<MessageDto>> Delete(Guid id)
        {
            var userId = HttpContext.GetUserId();
            var result = await _vaultService.DeleteAsync(userId, id);
            if (!result.IsSuccess)
                return StatusCode(result.Status, new ErrorDto(result.Errors ?? [], result.Status));
            return Ok(result.Value);
        }
    }
}
