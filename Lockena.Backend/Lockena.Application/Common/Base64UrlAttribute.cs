using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.RegularExpressions;

namespace Lockena.Application.Common
{
    public class Base64UrlAttribute : ValidationAttribute
    {
        private static readonly Regex _regex =
        new(@"^[A-Za-z0-9\-_]*$", RegexOptions.Compiled);

        protected override ValidationResult? IsValid(
            object? value,
            ValidationContext validationContext)
        {
            if (value is not string s || string.IsNullOrWhiteSpace(s))
                return ValidationResult.Success; 

            if (!_regex.IsMatch(s))
                return new ValidationResult("Invalid Base64Url format.");

            return ValidationResult.Success;
        }
    }
}
