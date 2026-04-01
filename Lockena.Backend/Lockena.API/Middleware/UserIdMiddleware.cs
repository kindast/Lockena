using System.Security.Claims;

namespace Lockena.API.Middleware
{
    public class UserIdMiddleware
    {
        private readonly RequestDelegate _next;

        public UserIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier);
                if (userId != null && userId.Value != null) context.Items["UserId"] = userId.Value;
            }

            await _next(context);
        }
    }
}
