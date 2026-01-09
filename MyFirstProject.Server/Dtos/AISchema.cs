using System.ComponentModel;

namespace MyFirstProject.Server.Dtos
{
    public class AiResponseChunk
    {
        public string Type { get; set; } // "Text" hoặc "UI"
        public string? Content { get; set; } // Lời nói của AI
        public object? Data { get; set; }    // Dữ liệu UI (nếu có)
    }
    public class PlanUIData
    {
        [Description("Brief title of the plan")]
        public string Title { get; set; }
        [Description("Detailed description of the plan")]
        public string? Description { get; set; }
        //[Description("Planned start date of the plan")]
        //public DateTime? StartDate { get; set; } = DateTime.UtcNow;
        [Description("List of phases in the plan")]
        public List<PhaseUIData> Phases { get; set; }
    }

    public class PhaseUIData
    {
        [Description("Title of the phase")]
        public string Title { get; set; }
        [Description("Description of the phase")]
        public string? Description { get; set; }
        [Description("Duration days of the plan")]
        public int DurationDays { get; set; }
        //[Description("List of tasks in the phase")]
        //public List<TaskUIData> Tasks { get; set; }
    }

    public class TaskUIData
    {
        [Description("Name of the task")]
        public string Name { get; set; }
        [Description("Description of the task")]
        public string? Description { get; set; }
        [Description("Days offset from start date of phase")]
        public int DaysOffset { get; set; }
    }

    public class ConvertedPlanData
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<ConvertedPhaseData> Phases { get; set; }
    }

    public class ConvertedPhaseData
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
