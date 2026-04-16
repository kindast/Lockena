using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.DTO.VaultItem
{
    public class GetVaultItemsParamsDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 1000;
    }
}
