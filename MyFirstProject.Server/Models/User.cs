using Microsoft.AspNetCore.Identity;

namespace MyFirstProject.Server.Models
{
    public class User: IdentityUser<int>
    {
        public required string FullName { get; set; }
        public List<RefreshToken>? RefreshTokens { get; set; }
        public List<Plan>? Plans { get; set; }
    }
}
