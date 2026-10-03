using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using PaymentService.Data;
using PaymentService.Interfaces;
using PaymentService.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// DATABASE
builder.Services.AddDbContext<PaymentDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("PaymentDbConnection")));

// REPOSITORY & BUSINESS SERVICE
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

builder.Services.AddScoped<PaymentService.Services.PaymentService>();

// JWT AUTHENTICATION
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

// AUTHORIZATION
builder.Services.AddAuthorization();

// CORS FOR REACT FRONTEND
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8080",
                "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// CONTROLLERS
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

// SWAGGER
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

var app = builder.Build();

// SWAGGER
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS MUST COME BEFORE AUTHENTICATION/AUTHORIZATION
app.UseCors("FrontendPolicy");

// AUTHENTICATION
app.UseAuthentication();

// AUTHORIZATION
app.UseAuthorization();

// API CONTROLLERS
app.MapControllers();

app.Run();