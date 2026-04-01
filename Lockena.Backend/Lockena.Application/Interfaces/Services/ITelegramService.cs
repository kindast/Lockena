using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.Interfaces.Services
{
    public interface ITelegramService
    {
        bool Validate(string initData, string botToken);
        (string dataCheckString, string? hash) ParseAuthString(string initData);
        byte[] EncodeHmac(string message, byte[] key);
    }
}
