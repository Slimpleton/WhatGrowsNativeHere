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
        public async IAsyncEnumerable<PlantData> GetPlantDataAsync([EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            await foreach(var item in FileService.PlantData.WithCancellation(cancellationToken))
                yield return item;
        }

        [HttpGet("plantdata/{id}")]
        public async Task<PlantData?> GetPlantDataAsync(string id, CancellationToken cancellationToken = default)
        {
            return await FileService.PlantData.FirstOrDefaultAsync(x => x.AcceptedSymbol == id, cancellationToken: cancellationToken);
        }

        [HttpGet("plantdata/search")]
        public async IAsyncEnumerable<PlantData[]> SearchForPlantDataAsync( [FromQuery]string combinedFIP, [FromQuery] string? searchString,  [FromQuery, ModelBinder(BinderType = typeof(GrowthHabitModelBinder))] GrowthHabit? growthHabit, [FromQuery] int batchSize = 100, [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var filtered = FileService.PlantData.Where(x => x.CombinedCountyFIPs.Contains(combinedFIP));
            if (growthHabit != null && growthHabit != GrowthHabit.Any)
            {
                filtered = filtered.Where(x => x.GrowthHabit.Contains((GrowthHabit)growthHabit));
            }

            if(!String.IsNullOrWhiteSpace(searchString))
                filtered = filtered.Where(x => x.ScientificName.Contains(searchString, StringComparison.OrdinalIgnoreCase) || (x.CommonName != null && x.CommonName.Contains(searchString, StringComparison.OrdinalIgnoreCase)));

            var batch = new PlantData[batchSize];
            int count = 0;
            
            await foreach (var item in filtered.WithCancellation(cancellationToken))
            {
                batch[count++] = item;
                if(count == batchSize)
                {
                    yield return batch;   // send batch to client
                    batch = new PlantData[batchSize];
                    count = 0;
                }

                if(count > 0)
                {
                    Array.Resize(ref batch, count); // send last partial batch
                    yield return batch;
                }
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
