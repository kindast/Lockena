using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Lockena.Application.Common
{
    public class Base64UrlLengthAttribute : ValidationAttribute
    {
        private readonly int _expectedLength;

        public Base64UrlLengthAttribute(int expectedLength)
        {
            _expectedLength = expectedLength;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is not string s || string.IsNullOrWhiteSpace(s))
                return ValidationResult.Success;

            try
            {
                var bytes = DecodeBase64Url(s);

                if (bytes.Length != _expectedLength)
                    return new ValidationResult(
                        $"Decoded length must be {_expectedLength} bytes.");

                return ValidationResult.Success;
            }
            catch
            {
                return new ValidationResult("Invalid Base64Url value.");
            }
        }

        private static byte[] DecodeBase64Url(string input)
        {
            string padded = input
                .Replace('-', '+')
                .Replace('_', '/');

            switch (padded.Length % 4)
            {
                case 2: padded += "=="; break;
                case 3: padded += "="; break;
            }

            return Convert.FromBase64String(padded);
        }
    }
}
