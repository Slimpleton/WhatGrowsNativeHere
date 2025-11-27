using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileDataController : ControllerBase
    {

        [HttpGet("plantdata")]
        public async IAsyncEnumerable<PlantData> GetPlantDataAsync()
        {
            await foreach(var item in FileService.PlantData)
            {
                yield return item;
            }
        }

        [HttpGet("plantdata/{id}")]
        public async Task<PlantData?> GetPlantDataAsync(string id)
        {
            return await FileService.PlantData.FirstOrDefaultAsync(x => x.AcceptedSymbol == id);
        }

        [HttpGet("plantdata/id")]
        public async IAsyncEnumerable<string> GetPlantDataIdsAsync()
        {
            await foreach (var item in FileService.PlantData)
            {
                yield return item.AcceptedSymbol;
            }
        }

        [HttpGet("states")]
        public async IAsyncEnumerable<StateCSVItem> GetStatesAsync()
        {
            await foreach (var item in FileService.States)
            {
                yield return item;
            }
        }

        [HttpGet("counties")]
        public async IAsyncEnumerable<CountyCSVItem> GetCountiesAsync()
        {
            await foreach (var item in FileService.Counties)
            {
                yield return item;
            }
        }
    }
}
