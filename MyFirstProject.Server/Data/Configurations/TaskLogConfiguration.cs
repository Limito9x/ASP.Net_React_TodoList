using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class TaskLogConfiguration : IEntityTypeConfiguration<TaskLog>
    {
        public void Configure(EntityTypeBuilder<TaskLog> builder)
        {
            builder.ToTable("TaskLogs");
            builder.HasKey(tl => tl.Id);
            builder.Property(tl => tl.Status)
                .HasConversion<string>();
            builder.Property(tl => tl.Data)
                .HasColumnType("jsonb");
            builder.HasIndex(tl => tl.Data)
                .HasMethod("gin");
            builder.Property(tl => tl.Contributions)
                .HasColumnType("jsonb");
            builder.HasOne(tl => tl.Routine)
                .WithMany(r => r.TaskLogs)
                .HasForeignKey(tl => tl.RoutineId);
            builder.HasOne(tl => tl.SingleTask)
                .WithMany(st => st.TaskLogs)
                .HasForeignKey(tl => tl.SingleTaskId);
        }
    }
}
