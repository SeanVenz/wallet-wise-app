using Microsoft.AspNetCore.Mvc;
using wallet_wise_api.Service;

[Route("api/[controller]")]
[ApiController]
public class FoodController : ControllerBase
{
    private readonly IFoodService _service;
    private readonly ILogger<FoodController> _logger;

    public FoodController(IFoodService service, ILogger<FoodController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Creates Food
    /// </summary>
    /// <param name="foodFormModel">Food Details</param>
    /// <returns>Newly created Food</returns>
    /// <remarks>
    /// Sample request:
    /// 
    ///      POST api/Food
    ///     {
    ///         "FoodType": "Snacks",
    ///         "Name": "Ngohiong"
    ///         "isAvailable" : "true"
    ///         "Price": "25"
    ///         "File": "cooperation.png"
    ///     }
    ///
    /// </remarks>
    /// <response code="201">Successfully created a Food</response>
    /// <response code="400">Food details are invalid</response>
    /// <response code="500">Internal server error</response>
    [HttpPost(Name = "CreateFood")]
    [Consumes("multipart/form-data")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(FoodCreationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create([FromForm] FoodCreationDto foodFormModel)
    {
        try
        {
            if (foodFormModel == null)
            {
                return BadRequest("Invalid input");
            }

            var documentId = await _service.CreateFood(foodFormModel);

            if (documentId == null)
            {
                return BadRequest("Recheck input");
            }

            return Ok(documentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(500, ex.Message);
        }
    }


    [HttpGet]
    public async Task<IActionResult> GetAllFoods()
    {
        try
        {
            var foods = await _service.GetAllFoods();

            if (foods == null || !foods.Any())
            {
                return NoContent();
            }
            return Ok(foods);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(500, "Something went wrong");
        }
    }
}
