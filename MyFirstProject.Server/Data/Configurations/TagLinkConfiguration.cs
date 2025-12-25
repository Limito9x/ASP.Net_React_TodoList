using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class TagLinkConfiguration: IEntityTypeConfiguration<TagLink>
    {
        public void Configure(EntityTypeBuilder<TagLink> builder)
        {
            builder.ToTable("TagLinks");
            builder.HasKey(tl => tl.Id);
            builder.Property(tl  => tl.LinkedEntityType)
                .HasConversion<string>();
        }
    }
}
