using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Dtos
{
    public record RequestTaskLogDto
    (
        string? Note,
        TaskLogStatus Status,
        List<MetadataForm>? Data,
        List<Contribution>? Contributions,
        int? RoutineId,
        int? SingleTaskId,
        int? PhaseId
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
