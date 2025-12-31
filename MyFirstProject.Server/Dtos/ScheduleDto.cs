using MyFirstProject.Server.Models;
using MyFirstProject.Server.Models.Enums;

namespace MyFirstProject.Server.Dtos
{
    public record ScheduleTodayDto(
        int Id,
        string Name,
        string? Description,
        string Type,
        SingleTaskType? SubType,
        DateTime StartAt,
        DateTime? EndAt,
        DateTime? DueDate,
        List<LinkedGoal>? LinkedGoals,
        List<int>? LinkedFormIds,
        SimpleResponsePhaseDto? Phase
    );
}
