using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class TaskItemConfiguration: IEntityTypeConfiguration<TaskItem>
    {
        public void Configure(EntityTypeBuilder<TaskItem> builder)
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
            builder.Property(t => t.CompletedAt);
            builder.Property(t => t.Status)
                .HasConversion<string>();
            builder.HasOne(t => t.Category)
                .WithMany(c => c.TaskItems)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
