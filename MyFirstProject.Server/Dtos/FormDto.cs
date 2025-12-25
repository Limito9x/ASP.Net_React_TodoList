using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Dtos
{
    public record RequestFormDto
    (
        string Name,
        string? Description,
        List<MetadataRow> Rows
    );

    public record RequestQueryFormDto
    (
        List<int>? FormIds
    );

    public record ResponseFormDto
    (
        int Id,
        string Name,
        string? Description,
        List<MetadataRow> Rows
    );
}
