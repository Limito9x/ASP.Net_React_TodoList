using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Dtos
{
    public record RequestTaskLogDto
    (
        string? Note,
        List<MetadataForm>? Data,
        DateTime CompletedAt,
        int RoutineId
    );

    public record TaskLogDto
    (
        int Id,
        string? Note,
        List<MetadataForm> Data,
        DateTime CompletedAt,
        int RoutineId
    );
}
