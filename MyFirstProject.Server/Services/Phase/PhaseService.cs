using MapsterMapper;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Dtos;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Services.UserService;

namespace MyFirstProject.Server.Services.Phase
{
    public interface IPhaseService
    {
        Task<ResponsePhaseDto?> GetPhaseByIdAsync(int phaseId);
        Task<ResponsePhaseDto> CreatePhaseAsync(RequestPhaseDto phaseDto);
        Task<ResponsePhaseDto?> UpdatePhaseAsync(int phaseId, RequestPhaseDto phaseDto);
        Task<bool> DeletePhaseAsync(int phaseId);
    }
    public class PhaseService: IPhaseService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IAssetLinkService _assetLinkService;
        private readonly IMapper _mapper;

        public PhaseService(ApplicationDbContext context, ICurrentUserService currentUserService, IAssetLinkService assetLinkService, IMapper mapper)
        {
            _context = context;
            _currentUserService = currentUserService;
            _assetLinkService = assetLinkService;
            _mapper = mapper;
        }

        public async Task<ResponsePhaseDto?> GetPhaseByIdAsync(int phaseId)
        {
            var phase = await _context.Phases.FindAsync(phaseId);
            if(phase == null) return null;
            return _mapper.Map<ResponsePhaseDto>(phase);
        }

        public async Task<ResponsePhaseDto> CreatePhaseAsync(RequestPhaseDto phaseDto)
        {
            var userId = _currentUserService.UserId;
            var phase = _mapper.Map<Models.Phase>(phaseDto);
            phase.UserId = userId;
            _context.Phases.Add(phase);
            await  _context.SaveChangesAsync();
            return _mapper.Map<ResponsePhaseDto>(phase);
        }

        public async Task<ResponsePhaseDto?> UpdatePhaseAsync(int phaseId, RequestPhaseDto phaseDto)
        {
            var existingPhase = await _context.Phases.FindAsync(phaseId);
            if(existingPhase == null) return null;
            _mapper.Map(phaseDto, existingPhase);
            await _context.SaveChangesAsync();
            return _mapper.Map<ResponsePhaseDto>(existingPhase);
        }

        public async Task<bool> DeletePhaseAsync(int phaseId)
        {
            var existingPhase = await _context.Phases.FindAsync(phaseId);
            if(existingPhase == null) return false;
            _context.Remove(existingPhase);
            await _assetLinkService.RemoveAssetLinkByAsync(phaseId, Models.Enums.AssetLinkType.PHASE);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
