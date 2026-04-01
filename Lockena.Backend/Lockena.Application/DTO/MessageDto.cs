using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.DTO
{
    public class MessageDto
    {
        public string Message { get; set; } = string.Empty;
        public int Status { get; set; }

        public MessageDto(string message, int status)
        {
            Message = message;
            Status = status;
        }
    }
}
