using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.IO;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Retrieve the IWebHostEnvironment service from the builder's Services collection
var env = builder.Services.BuildServiceProvider().GetRequiredService<IWebHostEnvironment>();

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
string keyFilePath = Path.Combine(env.ContentRootPath, "wallet-wise.json");
System.Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", keyFilePath);

ConfigureServices(builder.Services);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add CORS middleware to allow requests from any origin
app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseAuthorization();

app.MapControllers();

app.Run();

void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();

    services.AddSingleton<FirestoreContext>();
    services.AddScoped<IFoodService, FoodService>();
    services.AddScoped<IFoodRepository, FoodRepository>();
}
