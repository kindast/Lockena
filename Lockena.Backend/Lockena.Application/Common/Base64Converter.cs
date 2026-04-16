using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.Common
{
    public static class Base64Converter
    {
        public static byte[] Decode(string base64Url)
        {
            // Заменяем URL‑безопасные символы на обычные
            string base64 = base64Url.Replace('-', '+').Replace('_', '/');

            // Восстанавливаем padding до кратности 4
            int padding = 4 - (base64.Length % 4);
            if (padding is > 0 and < 4)
                base64 = base64.PadRight(base64.Length + padding, '=');

            return Convert.FromBase64String(base64);
        }
    }
}
