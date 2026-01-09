using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Helpers
{
    public static class UIDataHelper
    {
        public static ConvertedPlanData ToPlanDto(PlanUIData planUIData)
        {
            var startDate = DateTime.UtcNow;

            var phases = new List<ConvertedPhaseData>();
            var currentPhaseStartDate = startDate;

            foreach (var phaseUI in planUIData.Phases)
            {
                var phaseEndDate = currentPhaseStartDate.AddDays(phaseUI.DurationDays);

                phases.Add(
                    new ConvertedPhaseData
                    {
                        Title = phaseUI.Title,
                        Description = phaseUI.Description,
                        StartDate = currentPhaseStartDate,
                        EndDate = phaseEndDate
                    }
                );

                currentPhaseStartDate = phaseEndDate.AddDays(1);
            }

            var planEndDate = phases.Last().EndDate;

            return new ConvertedPlanData
            {
                Title = planUIData.Title,
                Description = planUIData.Description,
                StartDate = startDate,
                EndDate = planEndDate,
                Phases = phases
            };
        }
    }
}
