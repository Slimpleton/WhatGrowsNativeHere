using Backend.Services;

namespace Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // TODO add transient / singleton services here?
            builder.Services.AddSingleton<FileService>();

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


            builder.Services.AddControllers();

            var app = builder.Build();
            

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
