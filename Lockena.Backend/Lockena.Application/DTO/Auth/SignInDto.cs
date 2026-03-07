using System.ComponentModel.DataAnnotations;

namespace Lockena.Application.DTO.Auth
{
    public class SignInDto
    {
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Неверный формат email")]
        [MaxLength(100, ErrorMessage = "Email: максимум 100 символов")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен")]
        [MinLength(8, ErrorMessage = "Минимальная длина пароля 8 символов")]
        [MaxLength(100, ErrorMessage = "Пароль: максимум 100 символов")]
        public string Password { get; set; } = string.Empty;
    }
}
