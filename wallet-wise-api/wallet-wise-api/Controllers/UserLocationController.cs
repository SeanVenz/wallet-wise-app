using Google.Cloud.Location;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using wallet_wise_api.Dto;
using wallet_wise_api.Service;

namespace wallet_wise_api.Controllers
{
    [Route("api/user-location")]
    [ApiController]
    public class UserLocationController : ControllerBase
    {
        private readonly IUserLocationService _service;
        private readonly ILogger<UserLocationController> _logger;

        public UserLocationController(IUserLocationService service, ILogger<UserLocationController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Generates a map with a pin for the user's location.
        /// </summary>
        /// <param name="userId">The unique identifier of the user.</param>
        /// <returns>An HTML representation of the map with a pin.</returns>
        [HttpGet("generate-map/{userId}", Name = "GenerateMapWithPin")]
        [Produces("text/html")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GenerateMapWithPin(UserLocation location)
        {
            try
            {
                var mapHtml = _service.GenerateMapWithPin(location);

                if (mapHtml == null)
                {
                    return NotFound();
                }

                return Content(mapHtml, "text/html");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        /// <summary>
        /// Retrieves the user's location by latitude and longitude.
        /// </summary>
        /// <param name="latitude">The latitude of the user's location.</param>
        /// <param name="longitude">The longitude of the user's location.</param>
        /// <returns>A DTO representing the user's location.</returns>
        [HttpGet("get-user-location", Name = "GetUserLocation")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(UserLocation), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserLocation(int latitude, int longitude)
        {
            try
            {
                var userLocation = _service.GetUserLocation(latitude, longitude);

                if (userLocation == null)
                {
                    return NotFound();
                }

                return Ok(userLocation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }
    }
}
