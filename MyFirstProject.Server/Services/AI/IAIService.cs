namespace MyFirstProject.Server.Services.AI
{
    public interface IAIService
    {
        Task<string> GeneratePlanJSONAsync(string prompt);
    }
}
