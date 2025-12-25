using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class TaskLogConfiguration: IEntityTypeConfiguration<TaskLog>
    {
        public void Configure(EntityTypeBuilder<TaskLog> builder)
        {
            builder.ToTable("TaskLogs");
            builder.HasKey(tl => tl.Id);
            builder.Property(tl => tl.Data)
                .HasColumnType("jsonb");
            builder.HasIndex(tl => tl.Data)
                .HasMethod("gin");
        }
    }
}
