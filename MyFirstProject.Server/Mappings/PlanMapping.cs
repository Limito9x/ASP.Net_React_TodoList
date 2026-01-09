using Mapster;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Models;

namespace MyFirstProject.Server.Mappings
{
    public class PlanMapping : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<RequestPlanDto, Plan>();

            config.NewConfig<UpdatePlanDto, Plan>()
                .Ignore(dest => dest.Phases);
        }
    }
}
