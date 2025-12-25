using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Data.Configurations
{
    public class AssetLinkConfiguration: IEntityTypeConfiguration<AssetLink>
    {
        public void Configure(EntityTypeBuilder<AssetLink> builder)
        {
            builder.ToTable("AssetLinks");
            builder.HasKey(al => al.Id);
            builder.Property(al => al.Category)
                .HasConversion<string>();
            builder.Property(al => al.LinkedType)
                .HasConversion<string>();
            builder.HasOne(al => al.Asset)
                .WithOne(a => a.AssetLink)
                .HasForeignKey<AssetLink>(al => al.AssetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
