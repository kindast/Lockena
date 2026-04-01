using Lockena.Application.Interfaces.Services;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Lockena.Application.Services
{
    public class TelegramService : ITelegramService
    {
        public byte[] EncodeHmac(string message, byte[] key)
        {
            using var hmac = new HMACSHA256(key);
            return hmac.ComputeHash(Encoding.UTF8.GetBytes(message));
        }

        public (string dataCheckString, string? hash) ParseAuthString(string initData)
        {
            var query = HttpUtility.ParseQueryString(initData);
            var hash = query["hash"];
            query.Remove("hash");
            var parameters = query.AllKeys
                .OrderBy(k => k)
                .Select(k => $"{k}={query[k]}")
                .ToList();
            var dataCheckString = string.Join("\n", parameters);
            return (dataCheckString, hash);
        }

        public bool Validate(string initData, string botToken)
        {
            try
            {
                var (dataCheckString, receivedHash) = ParseAuthString(initData);
                var secretKey = EncodeHmac(botToken, Encoding.UTF8.GetBytes("WebAppData"));
                var validationKeyBytes = EncodeHmac(dataCheckString, secretKey);
                var calculatedHash = BitConverter.ToString(validationKeyBytes).Replace("-", "").ToLower();
                return calculatedHash == receivedHash;
            }
            catch { return false; }
        }
    }
}
