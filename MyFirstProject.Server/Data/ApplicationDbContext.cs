using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity; 

namespace MyFirstProject.Server.Data

{
    public class ApplicationDbContext: IdentityDbContext<User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options) { 
        }

        public ApplicationDbContext() {
        }

        public DbSet<RefreshToken>? RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.TokenHash)
                    .IsRequired()
                    .HasMaxLength(256);
                entity.HasOne(r=> r.User)
                    .WithMany(u => u.RefreshTokens)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
