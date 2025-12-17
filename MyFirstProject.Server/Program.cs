using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.SemanticKernel;
using MyFirstProject.Server.Data.Interceptors;
using MyFirstProject.Server.Services.Auth;
using MyFirstProject.Server.Services.Cloud;
using MyFirstProject.Server.Services.Plan;
using MyFirstProject.Server.Services.TaskItem;
using MyFirstProject.Server.Services.AI;
using MyFirstProject.Server.Services.AssetService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(opts => opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Lấy chuỗi kết nối từ file cấu hình (config)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Cấu hình Identity
builder.Services.AddIdentity<User, IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Cấu hình JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        // Tiến hành đọc từ App Setting (biến môi trường)
        // Chỉ ra Issuer (Người phát hành - Server) hợp lệ 
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        // Chỉ ra Audience (Người nhận - Client) hợp lệ 
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecurityKey"] ?? "CustomSecretKey"))
    };
});

var geminiApiKey = builder.Configuration["Gemini:ApiKey"];
var modelId = "gemini-2.5-flash-lite";

builder.Services.AddKernel()
    .AddGoogleAIGeminiChatCompletion(modelId, apiKey: geminiApiKey);

// Đăng ký dịch vụ tùy chỉnh
builder.Services.AddScoped<IAuthService, AuthService>()
                .AddScoped<IPlanService, PlanService>()
                .AddScoped<ITaskItemSerivce, TaskItemService>()
                .AddScoped<ICloudService, CloudinaryService>()
                .AddScoped<IAssetService, AssetService>()
                .AddScoped<IAIService, SemanticAIService>();

// Đăng ký Interceptor để xóa file trên Cloudinary khi xóa bản ghi Asset
builder.Services.AddScoped<CloudinaryDeleteInterceptor>();

// Cấu hình DbContext với PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var interceptor = serviceProvider.GetRequiredService<CloudinaryDeleteInterceptor>();
    options.UseNpgsql(connectionString)
              .AddInterceptors(interceptor);
}
);

// Sau khi cấu hình xong mới bắt đầu build ứng dụng
var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Thứ tự middleware
app.UseAuthentication(); // 1. Kiểm tra danh tính (Token có hợp lệ không ?)
app.UseAuthorization(); // 2. Kiểm tra quyền hạn (Người dùng này được làm gì ?)

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
