using Lockena.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.DTO
{
    public class ErrorDto
    {
        public string[] Errors { get; set; }
        public int Status { get; set; }

        public ErrorDto(string[] errors, int status)
        {
            Errors = errors; Status = status; 
        }
    }
}
