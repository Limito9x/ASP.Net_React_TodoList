using Google.GenAI;

namespace MyFirstProject.Server.Services.AI
{
    public class GeminiService : IAIService
    {
        private readonly string _apiKey;
        // SỬA 1: Dùng đúng tên model hiện hành
        private readonly string _modelId = "gemini-2.5-flash-lite";
        private readonly Client _client;

        public GeminiService(IConfiguration configuration)
        {
            _apiKey = configuration["Gemini:ApiKey"];
            _client = new Client(apiKey: _apiKey);
        }

        private string CleaningOutput(string input)
        {
            if (string.IsNullOrEmpty(input)) return "{}";

            var responseText = input.Trim();

            // Kỹ thuật "Clean Markdown": Xóa bỏ ```json và ```
            if (responseText.StartsWith("```json"))
            {
                responseText = responseText.Substring(7);
            }
            else if (responseText.StartsWith("```")) // Đôi khi nó chỉ trả về ```
            {
                responseText = responseText.Substring(3);
            }

            if (responseText.EndsWith("```"))
            {
                responseText = responseText.Substring(0, responseText.Length - 3);
            }

            return responseText.Trim();
        }

        public async Task<string> GeneratePlanJSONAsync(string userInput)
        {
            // SỬA 2: Thêm Retry Logic để chống lỗi "Overloaded"
            int maxRetries = 3;
            int baseDelay = 2000; // 2 giây

            var today = DateTime.UtcNow;

            // Prompt engineering: Ép kiểu JSON chặt chẽ hơn
            var prompt = $@"
                Role: Expert planner specialize in specific areas based on user requirements.
                Context: Today's date is {today}.
                Task: Create a detailed plan for '{userInput}'.
                Constraint: Return ONLY raw JSON. No markdown.
                INSTRUCTION FOR DATES:
                - Instead of specific dates, use 'dayOffset' (integer).
                - 'dayOffset': 0 means start today, 1 means tomorrow, etc.
                - If a task has no deadline, set 'dayOffset' to null.
                - Calculate 'planDurationDays' for the whole plan.
                JSON Structure:
                {{
                    ""title"": ""string"",
                    ""description"": ""string"",
                    ""tasks"": [
                        {{ ""name"": ""string"", ""description"": ""string"", ""dayOffset"": ""integer?"" }}
                    ]
                }}
            ";

            for (int i = 0; i < maxRetries; i++)
            {
                try
                {
                    var response = await _client.Models.GenerateContentAsync(
                        model: _modelId,
                        contents: prompt
                    );

                    // Kiểm tra null để tránh crash
                    if (response?.Candidates == null || response.Candidates.Count == 0)
                    {
                        throw new Exception("Gemini returns a null response.");
                    }

                    var textResponse = response.Candidates[0].Content.Parts[0].Text;

                    // Làm sạch và trả về
                    var cleanJson = CleaningOutput(textResponse);
                    Console.WriteLine("AI Response: " + cleanJson);
                    return cleanJson;
                }
                catch (Exception ex)
                {
                    // Check lỗi quá tải
                    if (ex.Message.Contains("429") || ex.Message.Contains("503") || ex.Message.ToLower().Contains("overloaded"))
                    {
                        if (i == maxRetries - 1) throw new Exception("Server AI is overloaded.");

                        Console.WriteLine($"Gemini is busy, retry {i + 1}...");
                        await Task.Delay(baseDelay * (i + 1)); // Đợi 2s, 4s...
                    }
                    else
                    {
                        Console.WriteLine($"Error AI: {ex.Message}");
                        throw; // Lỗi khác (sai key, model 404) thì ném ra luôn
                    }
                }
            }

            return "{}";
        }
    }
}