using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(options => 
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddIdentityCore<AppUser>(options =>
{
    // Password options
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
})
    .AddRoles<AppRole>()
    .AddRoleManager<RoleManager<AppRole>>()
    .AddEntityFrameworkStores<DataContext>();

// ADD BELOW ONCE LOGIN AND REGISTER LOGIC CREATED

// builder.Services.AddAuthentication();

// builder.Services.AddAuthorization(options =>
// {
//     options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
//     options.AddPolicy("MemberExperience", policy => policy.RequireRole("AppMember"));
//     options.AddPolicy("PublisherExperience", policy => policy.RequireRole("Publisher"));
//     options.AddPolicy("AdvertiserExperience", policy => policy.RequireRole("Advertiser"));
// });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

// app.UseAuthorization();

app.MapControllers();

app.Run();
