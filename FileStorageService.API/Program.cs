using FileStorageService.API.Data;
using FileStorageService.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IFileStorageService, CloudinaryStorageService>();

builder.Services.AddOpenApi(); 

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    // Expõe o arquivo de especificação invisível gerado pelo .NET 10
    app.MapOpenApi(); 
    
    // Pluga a interface clássica do Swagger lendo o arquivo gerado acima
    app.UseSwaggerUI(options => 
    {
        options.SwaggerEndpoint("/openapi/v1.json", "FileStorageService.API");
        options.RoutePrefix = "swagger"; // Mantém a URL padrão
    });
}


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();