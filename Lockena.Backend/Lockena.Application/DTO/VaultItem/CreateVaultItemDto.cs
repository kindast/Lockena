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
        [Base64Url]
        public required string EncryptedItemKey { get; init; }

        [Required]
        [Base64Url]
        [Base64UrlLength(12)]
        public required string ItemKeyIv { get; init; }

        [Required]
        [Base64Url]
        [MaxLength(12000)] 
        public required string EncryptedPayload { get; init; }

        [Required]
        [Base64Url]
        [Base64UrlLength(12)]
        public required string PayloadIv { get; init; }

        [Required]
        [Base64Url]
        [Base64UrlLength(32)] 
        public required string BlindIndex { get; init; }
    }
}
