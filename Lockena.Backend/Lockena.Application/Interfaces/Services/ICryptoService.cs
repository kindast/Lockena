namespace Lockena.Application.Interfaces.Services
{
    public interface ICryptoService
    {
        string Hash(string text);

        string Hash(string text, byte[] salt);
    }
}
