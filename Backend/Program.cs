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

            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Dev",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:4200") // Angular dev server
                              .AllowAnyHeader()
                              .AllowAnyMethod();
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

            app.UseResponseCompression();
            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();

            // HACK ignore data, load into memory for the first time

            foreach (var item in FileService.PlantData) { }
            foreach (var item in FileService.States) { }
            foreach (var item in FileService.Counties) { }
 

            app.MapControllers();

            app.Run();

        }
    }
}
