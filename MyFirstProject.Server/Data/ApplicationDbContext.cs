using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Interfaces;
using System.Reflection.Emit;

namespace MyFirstProject.Server.Data

{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public ApplicationDbContext()
        {
        }

        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<Plan> Plans { get; set; } = null!;
        public DbSet<SingleTask> SingleTasks { get; set; } = null!;
        public DbSet<Asset> Assets { get; set; } = null!;
        public DbSet<AssetLink> AssetLinks { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<TagLink> TagLinks { get; set; } = null!;
        public DbSet<Form> Forms { get; set; } = null!;
        public DbSet<Phase> Phases { get; set; } = null!;
        public DbSet<Routine> Routines { get; set; } = null!;
        public DbSet<TaskLog> TaskLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Ignore<MetadataRow>();
            builder.Ignore<MetadataField>();
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }

        public override int SaveChanges()
        {
            UpdateAuditableEntities();
            UpdateSoftDeletableEntities();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateAuditableEntities();
            UpdateSoftDeletableEntities();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateAuditableEntities()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is IAuditable && (e.State == EntityState.Added || e.State == EntityState.Modified));
            var utcNow = DateTime.UtcNow;
            foreach (var entry in entries)
            {
                var entity = (IAuditable)entry.Entity;
                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = utcNow;
                }
                entity.UpdatedAt = utcNow;
            }
        }

        private void UpdateSoftDeletableEntities()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is ISoftDeletable && e.State == EntityState.Deleted);
            foreach (var entry in entries)
            {
                var entity = (ISoftDeletable)entry.Entity;
                entry.State = EntityState.Modified;
            }
        }
    }
}
