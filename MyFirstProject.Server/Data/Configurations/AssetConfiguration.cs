using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class AssetConfiguration: IEntityTypeConfiguration<Asset>
    {
        public void Configure(EntityTypeBuilder<Asset> builder)
        {
            builder.ToTable("Assets");
            builder.HasKey(a => a.Id);
            builder.Property(a => a.FileName)
                .IsRequired()
                .HasMaxLength(255);
            builder.Property(a => a.FilePath)
                .IsRequired()
                .HasMaxLength(500);
            builder.Property(a => a.Type)
                .IsRequired()
                .HasConversion<string>();
            builder.Property(a => a.Extension)
                .IsRequired()
                .HasMaxLength(10);
            builder.Property(a => a.FileSize)
                .IsRequired();
            builder.Property(a => a.CreatedAt)
                .IsRequired();
            builder.HasOne(a => a.Plan)
                .WithMany(p => p.Assets)
                .HasForeignKey(a => a.PlanId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(a => a.Task)
                .WithMany(t => t.Assets)
                .HasForeignKey(a => a.TaskId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
