using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Lockena.Application.DTO.User
{
    public class TelegramUser
    {
        [property: JsonPropertyName("id")]
        public long Id { get; set; }

        [property: JsonPropertyName("first_name")]
        public string? FirstName { get; set; }

        [property: JsonPropertyName("last_name")] 
        public string? LastName { get; set; }

        [property: JsonPropertyName("username")] 
        public string? Username { get; set; }
    }
}
