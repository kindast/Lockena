namespace Lockena.Application.DTO.Auth
{
    public class AuthDto
    {
        public required string Email { get; set; }
        public required string AccessToken { get; init; }
        public required string RefreshToken { get; init; }

        public required string EncryptedMasterKey { get; init; }
        public required string MasterKeyIv { get; init; }
        public required string Salt { get; init; }
    }
}
