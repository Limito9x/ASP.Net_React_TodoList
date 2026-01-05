using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.SemanticKernel;
using MyFirstProject.Server.Data;
using MyFirstProject.Server.Data.Interceptors;
using MyFirstProject.Server.Models;
using MyFirstProject.Server.Plugins;  // ✅ Thêm using
using MyFirstProject.Server.Services.AI;
using MyFirstProject.Server.Services.AssetLink;
using MyFirstProject.Server.Services.AssetService;
using MyFirstProject.Server.Services.Auth;
using MyFirstProject.Server.Services.Cloud;
using MyFirstProject.Server.Services.Form;
using MyFirstProject.Server.Services.Phase;
using MyFirstProject.Server.Services.Plan;
using MyFirstProject.Server.Services.Routine;
using MyFirstProject.Server.Services.SingleTask;
using MyFirstProject.Server.Services.TaskLog;
using MyFirstProject.Server.Services.UserService;
using MyFirstProject.Server.Services.Schedule;
using Npgsql;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using MyFirstProject.Server.Services.Chat;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(opts => opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Lấy chuỗi kết nối từ file cấu hình (config)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddHttpContextAccessor();

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
var modelId = "gemini-2.5-flash";

builder.Services.AddScoped<Kernel>(sp =>
{
    var builder = Kernel.CreateBuilder();

    // Thêm Gemini
    builder.AddGoogleAIGeminiChatCompletion(
        modelId: "gemini-2.5-flash",
        apiKey: geminiApiKey);

    // QUAN TRỌNG: Lấy UIPlugin từ DI và nạp vào Kernel
    var uiPlugin = sp.GetRequiredService<UIPlugin>();
    builder.Plugins.AddFromObject(uiPlugin, "UIPlugin"); // Đặt tên rõ ràng

    return builder.Build();
});

// Cấu hình Mapster
var config = TypeAdapterConfig.GlobalSettings;
config.Scan(Assembly.GetExecutingAssembly());

builder.Services.AddSingleton(config);

// Đăng ký dịch vụ tùy chỉnh
builder.Services.AddScoped<IAuthService, AuthService>()
                .AddScoped<ICurrentUserService, CurrentUserService>()
                .AddScoped<IPlanService, PlanService>()
                .AddScoped<ISingleTaskService, SingleTaskService>()
                .AddScoped<ICloudService, CloudinaryService>()
                .AddScoped<IAssetService, AssetService>()
                .AddScoped<IAIService, SemanticAIService>()
                .AddScoped<IAssetLinkService, AssetLinkService>()
                .AddScoped<IRoutineService, RoutineService>()
                .AddScoped<ITaskLogService, TaskLogService>()
                .AddScoped<IFormService, FormService>()
                .AddScoped<IPhaseService, PhaseService>()
                .AddScoped<IScheduleService, ScheduleService>()
                .AddScoped<IChatService, ChatService>()
                .AddScoped<UIWidgetCollector>()
                .AddScoped<UIPlugin>()
                .AddScoped<IMapper, ServiceMapper>();

// Đăng ký Interceptor để xóa file trên Cloudinary khi xóa bản ghi Asset
builder.Services.AddScoped<CloudinaryDeleteInterceptor>();

// Enable dynamic JSON serialization cho Npgsql
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

// Cấu hình DbContext với PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var interceptor = serviceProvider.GetRequiredService<CloudinaryDeleteInterceptor>();
    options.UseNpgsql(dataSource)
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
