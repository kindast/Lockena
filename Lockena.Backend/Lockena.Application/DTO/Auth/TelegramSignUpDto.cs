using Lockena.Application.Common;
using System.ComponentModel.DataAnnotations;

namespace Lockena.Application.DTO.Auth
{
    public class TelegramSignUpDto
    {
        [Required]
        public string InitData { get; set; } = null!;

        [Required(ErrorMessage = "Ключ обязателен")]
        [Base64Url]
        public required string EncryptedMasterKey { get; init; }

        [Required(ErrorMessage = "Соль обязательна")]
        [Base64Url]
        [Base64UrlLength(16)]
        public required string Salt { get; init; }

        [Required(ErrorMessage = "IV обязателен")]
        [Base64Url]
        [Base64UrlLength(12)]
        public required string MasterKeyIv { get; init; }
    }
}
