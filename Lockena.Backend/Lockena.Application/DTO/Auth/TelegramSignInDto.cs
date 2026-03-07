using Lockena.Application.Common;
using System.ComponentModel.DataAnnotations;

namespace Lockena.Application.DTO.Auth
{
    public class TelegramSignInDto
    {
        [Required]
        public string InitData { get; set; } = null!;
    }
}
