using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeolocationController : ControllerBase
    {
        [HttpGet("state/{latitude}/{longitude}")]
        public async Task GetState([FromRoute]double latitude, [FromRoute]double longitude)
        {
            throw new NotImplementedException();
        }

        [HttpGet("county/{latitude}/{longitude}")]
        public async Task GetCounty([FromRoute] double latitude, [FromRoute] double longitude)
        {
            throw new NotImplementedException();
        }
    }
}
