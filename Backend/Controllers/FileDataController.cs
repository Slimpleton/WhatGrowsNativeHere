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
