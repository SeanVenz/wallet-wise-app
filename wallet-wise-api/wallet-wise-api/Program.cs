using Microsoft.OpenApi.Models;
using System.Reflection;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Add header documentation in swagger 
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Wallet Wise API",
        Description = "Food Services for CIT-U Students",
        Contact = new OpenApiContact
        {
            Name = "WalletWise",
            Url = new Uri("https://github.com/SeanVenz/wallet-wise-app")
        },
    }); ;
    // Feed generated xml api docs to swagger
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

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

app.UseRouting();

// Add CORS middleware
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
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    services.AddSingleton<FirestoreContext>();
    services.AddScoped<IFoodService, FoodService>();
    services.AddScoped<IFoodRepository, FoodRepository>();
}
