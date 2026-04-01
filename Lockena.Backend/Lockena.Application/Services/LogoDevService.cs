using Microsoft.Extensions.Configuration;
using Lockena.Application.Common;
using Lockena.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.Services
{
    public class LogoDevService : ILogoService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        public LogoDevService(IConfiguration configuration,
            IHttpClientFactory httpClientFactory) 
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<Result<Stream>> GetLogoAsync(string service)
        {
            var apiKey = _configuration["LogoDevApiKey"];
            var client = _httpClientFactory.CreateClient();
            var url = $"https://img.logo.dev/name/{service}?token={apiKey}&format=png";

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return Result<Stream>.Failure(404, "Логотип не найден");

            var logoData = await response.Content.ReadAsStreamAsync();
            return Result<Stream>.Success(logoData);
        }
    }
}
