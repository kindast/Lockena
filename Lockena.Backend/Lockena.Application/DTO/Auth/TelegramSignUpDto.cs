using Lockena.Application.Common;
using System.ComponentModel.DataAnnotations;

namespace Lockena.Application.DTO.Auth
{
    public class TelegramSignUpDto
    {
        [Required]
        public required string InitData { get; set; }
        
        [Required(ErrorMessage = "Пароль обязателен")]
        [MinLength(8, ErrorMessage = "Пароль минимум 8 символов")]
        [MaxLength(100, ErrorMessage = "Пароль: максимум 100 символов")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$",
            ErrorMessage = "Пароль должен содержать: заглавную букву, строчную букву, цифру, специальный символ")]
        public required string Password { get; set; }

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
