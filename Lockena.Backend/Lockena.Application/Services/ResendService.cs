using System.Reflection;
using System.Security.Cryptography;
using Lockena.Application.Interfaces.Repository;
using Lockena.Application.Interfaces.Services;
using Lockena.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Lockena.Application.Services;

public class ResendService : IMailService
{
    private readonly IResend _resend;
    private const string TemplateName = "Lockena.Application.Templates.Email.html";
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICryptoService _cryptoService;

    public ResendService(IConfiguration configuration, IUnitOfWork unitOfWork, ICryptoService cryptoService)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
        _cryptoService = cryptoService;
        var apiKey = configuration["ResendApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            throw new ArgumentException("Resend Api Key is missing");
        _resend = ResendClient.Create(apiKey);
    }
    
    private string GetTemplate(string token)
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(TemplateName);
        if (stream == null)
            throw new FileNotFoundException($"Ресурс {TemplateName} не найден в сборке.");

        using var reader = new StreamReader(stream);
        var html = reader.ReadToEnd();
        return html.Replace("{{VERIFICATION_LINK}}", _configuration["LinkForEmailConfirmation"] + token);
    }

    public async Task<bool> SendEmailAsync(Guid userId, string email)
    {
        var bytes = new byte[64];
        RandomNumberGenerator.Fill(bytes);
        var emailToken = Convert.ToHexString(bytes);
        var mail = new EmailMessage();
        mail.From = "onboarding@resend.dev";
        mail.To.Add(email);
        mail.Subject = "Подтверждение Email - Lockena";
        mail.HtmlBody = GetTemplate(emailToken);
        var send = await _resend.EmailSendAsync(mail);
        if (send.Success)
        {
            var token = new EmailToken()
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                NewEmail = email,
                TokenHash = _cryptoService.Hash(emailToken),
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(10),
                CreatedAtUtc = DateTime.UtcNow,
            };
            await _unitOfWork.EmailTokens.AddAsync(token);
            await _unitOfWork.SaveChangesAsync();
        }
        return send.Success;
    }

    public async Task<bool> VerifyEmailAsync(string token)
    {
        var emailToken = await _unitOfWork.EmailTokens.GetByHashAsync(_cryptoService.Hash(token));
        if (emailToken == null || emailToken.ExpiresAtUtc < DateTime.UtcNow || emailToken.IsRevoked)
            return false;

        var user = await _unitOfWork.Users.GetByIdAsync(emailToken.UserId);
        if (user == null)
            return false;

        if (emailToken.NewEmail != null)
            user.Email = emailToken.NewEmail;
        user.EmailConfirmed = true;
        emailToken.IsRevoked = true;
        await _unitOfWork.SaveChangesAsync();
        
        return true;
    }
}