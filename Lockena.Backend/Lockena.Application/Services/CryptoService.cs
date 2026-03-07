using Lockena.Application.Interfaces.Services;
using System.Security.Cryptography;
using System.Text;

namespace Lockena.Application.Services
{
    public class CryptoService : ICryptoService
    {
        //Константы для хэширования
        private const int KeySize = 32;
        private const int Iterations = 100_000;

        public string Hash(string token)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(
                Encoding.UTF8.GetBytes(token)
            );
            return Convert.ToBase64String(bytes);
        }

        public string Hash(string password, byte[] salt)
        {
            var pbkdf2 = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations,
                HashAlgorithmName.SHA256, KeySize);
            return Convert.ToBase64String(pbkdf2);
        }
    }
}
