using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Interfaces;
using ProductService.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// =========================
// DATABASE
// =========================
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ProductDbConnection")));

// =========================
// REPOSITORIES
// =========================
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();

// =========================
// BUSINESS SERVICES
// =========================
builder.Services.AddScoped<ProductService.Services.ProductService>();
builder.Services.AddScoped<ProductService.Services.CategoryService>();
builder.Services.AddScoped<ProductService.Services.InventoryService>();

// =========================
// CORS
// =========================
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
            .AllowAnyMethod();
    });
});

// =========================
// JWT AUTHENTICATION
// =========================
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

// =========================
// AUTHORIZATION
// =========================
builder.Services.AddAuthorization();

// =========================
// MEMORY CACHE
// =========================
builder.Services.AddMemoryCache();

// =========================
// CONTROLLERS
// =========================
builder.Services.AddControllers();

// =========================
// SWAGGER
// =========================
builder.Services.AddEndpointsApiExplorer();

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

// =========================
// BUILD APPLICATION
// =========================
var app = builder.Build();

// =========================
// SWAGGER
// =========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// =========================
// HTTPS
// =========================
app.UseHttpsRedirection();

// =========================
// CORS
// IMPORTANT: BEFORE AUTH
// =========================
app.UseCors("FrontendPolicy");

// =========================
// AUTHENTICATION
// =========================
app.UseAuthentication();

// =========================
// AUTHORIZATION
// =========================
app.UseAuthorization();

// =========================
// API CONTROLLERS
// =========================
app.MapControllers();

app.Run();