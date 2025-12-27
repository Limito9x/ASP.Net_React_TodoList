using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class FormConfiguration:IEntityTypeConfiguration<Form>
    {
        public void Configure(EntityTypeBuilder<Form> builder)
        {
            builder.ToTable("Forms");
            builder.HasKey(f => f.Id);
            builder.HasIndex(f => new {f.Name, f.UserId})
                .IsUnique()
                .HasFilter("\"DeletedAt\" IS NULL");
            builder.Property(f => f.Rows)
                .HasColumnType("jsonb");
            builder.HasIndex(f  => f.Rows)
                .HasMethod("gin");
        }
    }
}
