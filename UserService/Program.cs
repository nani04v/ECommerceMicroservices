using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;
using UserService.Data;
using UserService.Interfaces;
using UserService.Repositories;
using UserService.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// DATABASE
// ============================================================

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("UserDbConnection")));


// ============================================================
// REPOSITORY & BUSINESS SERVICE
// ============================================================

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<UserService.Services.UserService>();


// ============================================================
// CORS
// ============================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8080",
                "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// ============================================================
// JWT AUTHENTICATION
// ============================================================

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!))
            };
    });

builder.Services.AddAuthorization();


// ============================================================
// CONTROLLERS
// ============================================================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();


// ============================================================
// SWAGGER
// ============================================================

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description =
                "Enter: Bearer {your JWT token}"
        });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [
                new OpenApiSecuritySchemeReference(
                    "Bearer",
                    document)
            ] = []
        });
});


// ============================================================
// BUILD APPLICATION
// ============================================================

var app = builder.Build();


// ============================================================
// SWAGGER
// ============================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ============================================================
// HTTP PIPELINE
// ============================================================

app.UseHttpsRedirection();

// CORS must run before authentication/authorization
app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();


// ============================================================
// API CONTROLLERS
// ============================================================

app.MapControllers();




app.Run();