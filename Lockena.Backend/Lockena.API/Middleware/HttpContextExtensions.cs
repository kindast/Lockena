namespace Lockena.API.Middleware
{
    public static class HttpContextExtensions
    {
        public static Guid GetUserId(this HttpContext context)
        {
            Guid userId;
            string? str = context.Items["UserId"]?.ToString();
            if (str == null)
                return Guid.Empty;

            Guid.TryParse(str, out userId);
            return userId;
        }
    }
}
