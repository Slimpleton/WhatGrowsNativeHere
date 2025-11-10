using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlantsDataController : ControllerBase
    {
       
        [HttpGet]
        public async Task Get()
        {

        }
    }
}
