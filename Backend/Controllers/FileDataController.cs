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
        public async Task<ActionResult<IEnumerable<PlantData>>> GetPlantDataAsync()
        {
            return Ok(FileService.PlantData);
        }

        [HttpGet("states")]
        public async Task<ActionResult<IEnumerable<StateCSVItem>>> GetStatesAsync()
        {
            return Ok(FileService.States);
        }

        [HttpGet("counties")]
        public async Task<ActionResult<IEnumerable<CountyCSVItem>>> GetCountiesAsync()
        {
            return Ok(FileService.Counties);
        }
    }
}
