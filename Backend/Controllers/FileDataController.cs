using Backend.ModelBinders;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Text.Json;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileDataController : ControllerBase
    {
        [HttpGet("plantdata")]
        public async IAsyncEnumerable<PlantData> GetPlantDataAsync([EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            await foreach (var item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("plantdata/{id}")]
        public async Task<PlantData?> GetPlantDataAsync(string id, CancellationToken cancellationToken = default)
        {
            return await FileService.PlantData.FirstOrDefaultAsync(x => x.AcceptedSymbol == id, cancellationToken: cancellationToken);
        }

        // TODO put sorting back on the backend for streaming purposes
        [HttpGet("plantdata/search")]
        public async Task SearchForPlantDataAsync([FromQuery] string combinedFIP, [FromQuery] string? searchString,[FromQuery]SortOption sortOption, [FromQuery] bool ascending,  [FromQuery, ModelBinder(BinderType = typeof(GrowthHabitModelBinder))] GrowthHabit? growthHabit, CancellationToken cancellationToken = default)
        {
            const string newLine = "\n";
            var filtered = FileService.PlantData.Where(x => x.CombinedCountyFIPs.Contains(combinedFIP));
            if (growthHabit != null && growthHabit != GrowthHabit.Any)
            {
                filtered = filtered.Where(x => x.GrowthHabit.Contains((GrowthHabit)growthHabit));
            }

            if (!String.IsNullOrWhiteSpace(searchString))
                filtered = filtered.Where(x => x.ScientificName.Contains(searchString, StringComparison.OrdinalIgnoreCase) || (x.CommonName != null && x.CommonName.Contains(searchString, StringComparison.OrdinalIgnoreCase)));

            Response.ContentType = "application/x-ndjson";

            Func<PlantData,string?> selector = sortOption switch
            {
                SortOption.CommonName => x => x.CommonName,
                SortOption.ScientificName => x => x.ScientificName,
                SortOption.Symbol => x => x.Symbol,
                _ => x => x.ScientificName
            };

            filtered = ascending ? filtered.OrderBy(selector) : filtered.OrderByDescending(selector);

            await foreach (var item in filtered.WithCancellation(cancellationToken))
            {
                await JsonSerializer.SerializeAsync(Response.Body, item, options: new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase} ,cancellationToken: cancellationToken);
                await Response.WriteAsync(newLine, cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }

        }

        [HttpGet("plantdata/id")]
        public async IAsyncEnumerable<string> GetPlantDataIdsAsync([EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            await foreach (var item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item.AcceptedSymbol;
        }

        [HttpGet("states")]
        public async IAsyncEnumerable<StateCSVItem> GetStatesAsync([EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            await foreach (var item in FileService.States.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("counties")]
        public async IAsyncEnumerable<CountyCSVItem> GetCountiesAsync([EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            await foreach (var item in FileService.Counties.WithCancellation(cancellationToken))
                yield return item;
        }


    }
}
