using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using OrderService.Data;
using OrderService.Hubs;
using OrderService.Interfaces;
using OrderService.Repositories;
using OrderService.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// DATABASE
// ======================================================
builder.Services.AddDbContext<OrderDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("OrderDbConnection")));

// ======================================================
// JWT AUTHENTICATION
// ======================================================
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:Key"]!))
        };
    });

// ======================================================
// AUTHORIZATION
// ======================================================
builder.Services.AddAuthorization();

// ======================================================
// REPOSITORY
// ======================================================
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// ======================================================
// BUSINESS SERVICE
// ======================================================
builder.Services.AddScoped<OrderService.Services.OrderService>();

// ======================================================
// HTTP CLIENT
// ======================================================
builder.Services.AddHttpClient();

// ======================================================
// HTTP CONTEXT ACCESSOR
// ======================================================
builder.Services.AddHttpContextAccessor();

// ======================================================
// CORS
// ======================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:8080",
                "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ======================================================
// SIGNALR
// ======================================================
builder.Services.AddSignalR();

// ======================================================
// CONTROLLERS
// ======================================================
builder.Services.AddControllers();

// ======================================================
// API EXPLORER
// ======================================================
builder.Services.AddEndpointsApiExplorer();

// ======================================================
// SWAGGER
// ======================================================
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
            Description = "Enter: Bearer {your JWT token}"
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

// ======================================================
// BUILD APPLICATION
// ======================================================
var app = builder.Build();

// ======================================================
// SWAGGER
// ======================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ======================================================
// HTTPS REDIRECTION
// ======================================================
app.UseHttpsRedirection();

// ======================================================
// CORS
// IMPORTANT: CORS MUST COME BEFORE AUTHENTICATION
// AND AUTHORIZATION
// ======================================================
app.UseCors("FrontendPolicy");

// ======================================================
// AUTHENTICATION
// ======================================================
app.UseAuthentication();

// ======================================================
// AUTHORIZATION
// ======================================================
app.UseAuthorization();

// ======================================================
// API CONTROLLERS
// ======================================================
app.MapControllers();

// ======================================================
// SIGNALR HUB
// ======================================================
app.MapHub<OrderHub>("/hubs/orders");

// ======================================================
// RUN APPLICATION
// ======================================================
app.Run();