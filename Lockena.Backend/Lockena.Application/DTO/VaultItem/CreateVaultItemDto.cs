using Lockena.Application.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Lockena.Application.DTO.VaultItem
{
    public class CreateVaultItemDto
    {
        [Required]
        public required string EncryptedItemKey { get; init; }
        [Required]
        [MaxLength(12000)] 
        public required string EncryptedPayload { get; init; }
    }
}
