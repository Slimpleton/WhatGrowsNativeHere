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
            try
            {
                return Ok(FileService.PlantData);
            }
            catch (Exception e)
            {
                string s = string.Empty;
                throw;
            }
        }

        [HttpGet("states")]
        public async Task<ActionResult<IEnumerable<StateCSVItem>>> GetStatesAsync()
        {
            try
            {
                return Ok(FileService.States);
            }
            catch (Exception e)
            {
                string s = string.Empty;
                throw;
            }
        }

        [HttpGet("counties")]
        public async Task<ActionResult<IEnumerable<CountyCSVItem>>> GetCountiesAsync()
        {
            try
            {
                return Ok(FileService.Counties);
            }
            catch (Exception e)
            {
                string s = string.Empty;
                throw;
            }
        }
    }
}
