using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddCors();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IChapterService, ChapterService>();
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            return services;
        }
    }
}
