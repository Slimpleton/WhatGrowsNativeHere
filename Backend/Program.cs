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
            // FUck cors me and my homies hate it attack my shit dawg theres no userdata
            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("Dev",
            //        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            //});


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
            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            //app.UseAuthorization();

            // HACK ignore data, load into memory for the first time

            foreach (var item in FileService.PlantData) { }

            app.MapControllers();

            app.Run();

        }
    }
}
