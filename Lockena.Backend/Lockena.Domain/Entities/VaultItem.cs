using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Domain.Entities
{
    public class VaultItem
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required string EncryptedItemKey { get; set; }
        public required string EncryptedPayload { get; set; }
        public required DateTime CreatedAtUtc { get; set; }
        public required DateTime UpdatedAtUtc { get; set; }
    }
}
