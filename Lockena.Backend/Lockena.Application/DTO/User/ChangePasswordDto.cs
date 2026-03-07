using Lockena.Application.Common;
using System.ComponentModel.DataAnnotations;

namespace Lockena.Application.DTO.User
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Текущий пароль обязателен")]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Новый пароль обязателен")]
        [MinLength(8, ErrorMessage = "Пароль минимум 8 символов")]
        [MaxLength(100, ErrorMessage = "Пароль: максимум 100 символов")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,100}$",
        ErrorMessage = "Пароль должен содержать: заглавную букву, строчную букву, цифру, специальный символ")]
        public string NewPassword { get; set; } = string.Empty;

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
