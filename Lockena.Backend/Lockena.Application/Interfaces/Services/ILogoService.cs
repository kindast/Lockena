using Lockena.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lockena.Application.Interfaces.Services
{
    public interface ILogoService
    {
        Task<Result<Stream>> GetLogoAsync(string service);
    }
}
