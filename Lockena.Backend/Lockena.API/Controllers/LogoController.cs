using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Lockena.Application.Interfaces.Services;

namespace Lockena.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LogoController : ControllerBase
    {
        private readonly ILogoService _logoService;
        private readonly IMemoryCache _cache;
        public LogoController(ILogoService logoService, IMemoryCache cache)
        {
            _logoService = logoService;
            _cache = cache;
        }

        [Authorize]
        [HttpGet("{service}")]
        [ResponseCache(Duration = 3600 * 24, Location = ResponseCacheLocation.Client, NoStore = false)]
        public async Task<ActionResult> GetLogo(string service)
        {
            var cacheKey = $"logo_{service}";
            if(_cache.TryGetValue(cacheKey, out byte[] cachedImage))
                return File(cachedImage, "image/png");

            var logo = await _logoService.GetLogoAsync(service);
            if (!logo.IsSuccess || logo.Value == null)
                return NotFound();

            var cacheOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(30),
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24),
                Size = logo.Value.Length
            };
            _cache.Set(cacheKey, logo.Value, cacheOptions);

            return File(logo.Value, "image/png");
        }
    }
}
