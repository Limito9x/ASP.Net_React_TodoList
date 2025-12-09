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
        public DbSet<Category>? Categories { get; set; }
        public DbSet<TaskItem>? TaskItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
