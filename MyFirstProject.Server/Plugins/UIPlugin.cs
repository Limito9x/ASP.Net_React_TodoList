using Microsoft.SemanticKernel;
using MyFirstProject.Server.Dtos;
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
            await _uIWidgetCollector.PushWidgetAsync("PlanPreview", planData);
            return JsonSerializer.Serialize(new
            {
                status = "rendered",
                planSummary = $"Plan '{planData.Title}' with {planData.Phases.Count} phases created."
            });
        }
    }
}
