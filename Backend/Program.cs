using Backend.Services;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // TODO add transient / singleton services here?

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            builder.Services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
                options.Providers.Add<BrotliCompressionProvider>();
            });

            builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });

            builder.Services.AddControllers();

            var app = builder.Build();
            // Use CORS - THIS MUST BE BEFORE other middleware like UseAuthorization
            app.UseCors("AllowAll");

            app.UseResponseCompression();
            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseAuthorization();

            // HACK ignore data, load into memory for the first time

            foreach (var item in FileService.PlantData) { }

            app.MapControllers();

            // Add health check endpoint
            app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

            app.Run();

        }
    }
}
