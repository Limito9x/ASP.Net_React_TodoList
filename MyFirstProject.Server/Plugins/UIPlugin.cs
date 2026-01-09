using Microsoft.SemanticKernel;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Helpers;
using MyFirstProject.Server.Services.Chat;
using System.ComponentModel;
using System.Text.Json;
using System.Threading.Tasks;

namespace MyFirstProject.Server.Plugins
{
    public class UIPlugin
    {
        private readonly UIWidgetCollector _uIWidgetCollector;
        public UIPlugin(UIWidgetCollector uIWidgetCollector)
        {
            _uIWidgetCollector = uIWidgetCollector;
            Console.WriteLine("UIPlugin initialized with UIWidgetCollector.");
        }

        [KernelFunction]
        [Description("Display Preview UI Detailed Plan for user")]
        public async Task<string> RenderPlan(
            [Description("The detailed plan data to render")] PlanUIData planData
        )
        {
            Console.WriteLine($"Rendering Plan Preview UI Widget...,{planData.Title}");

            var mappedPlan = UIDataHelper.ToPlanDto(planData);

            await _uIWidgetCollector.PushWidgetAsync("PlanPreview", mappedPlan);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            return JsonSerializer.Serialize(new
            {
                status = "rendered",
                planSummary = $"Plan '{mappedPlan.Title}' with {mappedPlan.Phases.Count} phases created."
            }, options);
        }
    }
}
