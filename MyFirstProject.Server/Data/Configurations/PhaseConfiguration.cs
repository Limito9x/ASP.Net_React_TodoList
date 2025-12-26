using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class PhaseConfiguration: IEntityTypeConfiguration<Phase>
    {
        public void Configure(EntityTypeBuilder<Phase> builder)
        {
            builder.ToTable("Phases");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(200);
            builder.Property(p => p.Description)
                .HasMaxLength(1000);
            builder.HasIndex(p => new { p.PlanId, p.Title, p.UserId })
                .IsUnique()
                .HasFilter("\"DeletedAt\" IS NULL");
            builder.Property(p => p.Goals)
                .HasColumnType("jsonb")
                .IsRequired(false);
            builder.HasIndex(p => p.Goals)
                .HasMethod("gin");
        }
    }
}
