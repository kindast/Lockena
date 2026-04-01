using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.DTO.VaultItem
{
    public class GetVaultItemsParamsDto
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string Search { get; set; } = string.Empty;
    }
}
