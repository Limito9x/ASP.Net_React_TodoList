using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class SingleTaskConfiguration: IEntityTypeConfiguration<SingleTask>
    {
        public void Configure(EntityTypeBuilder<SingleTask> builder)
        {
            builder.ToTable("Tasks");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(200);
            builder.Property(t => t.Description)
                .HasMaxLength(1000);
            builder.Property(t => t.CreatedAt)
                .IsRequired();
            builder.Property(t => t.DueDate);
            builder.Property(t => t.Status)
                .HasConversion<string>();
            builder.Property(t=>t.LinkedFormIds)
                .HasColumnType("jsonb");
            builder.Property(t => t.LinkedGoals)
                .HasColumnType("jsonb");
        }
    }
}
