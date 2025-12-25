namespace MyFirstProject.Server.Dtos
{
    public record RequestPlanDto
    (
        string Title,
        string? Description,
        DateTime? StartDate,
        DateTime? EndAt,
        List<RequestPhaseDto>? Phases
    );

    public record ResponsePlanDto
    (
        int Id,
        string Title,
        string? Description,
        decimal? Progress,
        DateTime? StartDate,
        DateTime? EndAt,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        List <SimpleResponsePhaseDto>? Phases
    );

    public record SuggestPlanDto
    (
        string Prompt
    );
}
