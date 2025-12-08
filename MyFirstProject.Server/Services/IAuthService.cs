using MyFirstProject.Server.Dtos;

namespace MyFirstProject.Server.Services
{
    public interface IAuthService
    {
        // Đăng ký người dùng mới
        Task<UserResponseDto> RegisterAsync(UserRegisterDto model);

        // Đăng nhập người dùng
        Task<LoginResponseDto> LoginAsync(UserLoginDto model);

        // Lấy thông tin người dùng từ token JWT (nếu cần) --> check token
        Task <UserResponseDto> GetUserProfileAsync(string userId);
    }
}
