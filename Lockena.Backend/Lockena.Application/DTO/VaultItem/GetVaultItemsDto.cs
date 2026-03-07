using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.DTO.VaultItem
{
    public class GetVaultItemsDto
    {
        public ICollection<VaultItemDto> Items { get; set; } = new List<VaultItemDto>();
        public int Total { get; set; }
        public int PageSize { get; set; }
        public int Page { get; set; }
    }
}
