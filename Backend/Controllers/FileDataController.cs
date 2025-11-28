using Backend.ModelBinders;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileDataController : ControllerBase
    {

        [HttpGet("plantdata")]
        public async IAsyncEnumerable<PlantData> GetPlantDataAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach(var item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("plantdata/{id}")]
        public async Task<PlantData?> GetPlantDataAsync(string id, CancellationToken cancellationToken)
        {
            return await FileService.PlantData.FirstOrDefaultAsync(x => x.AcceptedSymbol == id, cancellationToken: cancellationToken);
        }

        [HttpGet("plantdata/search")]
        public async IAsyncEnumerable<PlantData> SearchForPlantDataAsync( [FromQuery]string combinedFIP, [FromQuery] string? searchString, [FromQuery, ModelBinder(BinderType = typeof(GrowthHabitModelBinder))] GrowthHabit? growthHabit, [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var filtered = FileService.PlantData.Where(x => x.CombinedCountyFIPs.Contains(combinedFIP));
            if (growthHabit != null && growthHabit != GrowthHabit.Any)
            {
                filtered = filtered.Where(x => x.GrowthHabit.Contains((GrowthHabit)growthHabit));
            }

            if(!String.IsNullOrWhiteSpace(searchString))
                filtered = filtered.Where(x => x.ScientificName.Contains(searchString, StringComparison.OrdinalIgnoreCase) || (x.CommonName != null && x.CommonName.Contains(searchString, StringComparison.OrdinalIgnoreCase)));

            await foreach (var item in filtered.WithCancellation(cancellationToken))
            {
                yield return item;
            }
        }

        [HttpGet("plantdata/id")]
        public async IAsyncEnumerable<string> GetPlantDataIdsAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (var item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item.AcceptedSymbol;
        }

        [HttpGet("states")]
        public async IAsyncEnumerable<StateCSVItem> GetStatesAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (var item in FileService.States.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("counties")]
        public async IAsyncEnumerable<CountyCSVItem> GetCountiesAsync([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            await foreach (var item in FileService.Counties.WithCancellation(cancellationToken))
                yield return item;
        }
    }
}
