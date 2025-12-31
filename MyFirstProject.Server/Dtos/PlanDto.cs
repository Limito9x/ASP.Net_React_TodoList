namespace MyFirstProject.Server.Dtos
{
    public record RequestPlanDto
    (
        string Title,
        string? Description,
        DateTime? StartDate,
        DateTime? EndDate,
        List<RequestPhaseDto>? Phases
    );

    public record ResponsePlanDto
    (
        int Id,
        string Title,
        string? Description,
        decimal? Progress,
        DateTime? StartDate,
        DateTime? EndDate,
        DateTime CreatedAt,
        DateTime? UpdatedAt,
        List <SimpleResponsePhaseDto>? Phases
    );

    public record SimpleResponsePlanDto
    (
        int Id,
        string Title,
        decimal? Progress,
        DateTime? StartDate,
        DateTime? EndDate
    );

    public record SuggestPlanDto
    (
        string Prompt
    );
}
