using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class RoutineConfiguration: IEntityTypeConfiguration<Routine>
    {
        public void Configure(EntityTypeBuilder<Routine> builder)
        {
            builder.ToTable("Routines");
            builder.HasKey(r => r.Id);
            builder.Property(r => r.Title)
                .IsRequired()
                .HasMaxLength(200);
            builder.HasIndex(r => new { r.Title, r.UserId })
                .IsUnique()
                .HasFilter("\"DeletedAt\" IS NULL");
            builder.HasIndex(r => r.NextOccurence);
            builder.Property(r => r.Rule)
                .HasColumnType("jsonb");
            builder.HasIndex(r => r.Rule)
                .HasMethod("gin");
            builder.Property(r => r.LinkedGoalIds)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<int>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<int>()
                );
        }
    }
}
