using Microsoft.EntityFrameworkCore;
using Lockena.Domain.Entities;
using System.Reflection.Metadata;

namespace Lockena.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<VaultItem> VaultItems { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VaultItem>()
                .HasIndex(i => i.BlindIndex);
            modelBuilder.Entity<VaultItem>()
                .HasIndex(i => i.UserId);
        }

    }
}
