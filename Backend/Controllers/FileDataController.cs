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
        public async IAsyncEnumerable<PlantData> GetPlantDataAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (var item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("plantdata/{id}")]
        public async Task<PlantData?> GetPlantDataAsync(string id, CancellationToken cancellationToken)
        {
            return await FileService.PlantData.FirstOrDefaultAsync(x => x.AcceptedSymbol == id, cancellationToken: cancellationToken);
        }

        [HttpGet("plantdata/search")]
        public async Task SearchForPlantDataAsync([FromQuery] string combinedFIP, [FromQuery] string? searchString,[FromQuery]SortOption sortOption, [FromQuery] bool ascending,  [FromQuery, ModelBinder(BinderType = typeof(GrowthHabitModelBinder))] GrowthHabit? growthHabit, CancellationToken cancellationToken)
        {
            // Get county plants as a HashSet for O(1) lookups
            HashSet<PlantData>? countyPlants = FileService.GetCountyPlants(combinedFIP);
            if (countyPlants == null)
            {
                return; // County not found, return empty
            }

            IAsyncEnumerable<PlantData> filtered = FileService.GetSortedPlants(sortOption, ascending);
            filtered = filtered.Where(countyPlants.Contains);
            if (growthHabit != null && growthHabit != GrowthHabit.Any)
            {
                filtered = filtered.Where(x => x.GrowthHabit.Contains((GrowthHabit)growthHabit));
            }

            if (!String.IsNullOrWhiteSpace(searchString))
                filtered = filtered.Where(x => x.ScientificName.Contains(searchString, StringComparison.OrdinalIgnoreCase) || (x.CommonName != null && x.CommonName.Contains(searchString, StringComparison.OrdinalIgnoreCase)));

            Response.ContentType = "application/x-ndjson";
            const string newLine = "\n";

            await foreach (var item in filtered.WithCancellation(cancellationToken))
            {
                await JsonSerializer.SerializeAsync(Response.Body, item, options: new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase} ,cancellationToken: cancellationToken);
                await Response.WriteAsync(newLine, cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }

        }

        [HttpGet("plantdata/id")]
        public async IAsyncEnumerable<string> GetPlantDataIdsAsync([EnumeratorCancellation] CancellationToken cancellationToken )
        {
            await foreach (PlantData item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item.AcceptedSymbol;
        }

        [HttpGet("states")]
        public async IAsyncEnumerable<StateCSVItem> GetStatesAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (StateCSVItem item in FileService.States.WithCancellation(cancellationToken))
                yield return item;
        }

        // TODO use geoip-lite with angular ssr to convert to using ip address to get fip and then ssr can be done for indexing / super fast loads 

        [HttpGet("counties")]
        public async IAsyncEnumerable<CountyCSVItem> GetCountiesAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (CountyCSVItem item in FileService.Counties.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("counties/{stateFip}/{countyFip}")]
        public async Task<ActionResult<CountyCSVItem?>> GetCounty(short stateFip, string countyFip, CancellationToken cancellationToken)
        {
            return Ok(await FileService.Counties.FirstOrDefaultAsync(x => x.CountyFip == countyFip && x.StateFip == stateFip, cancellationToken));
        }


    }
}
