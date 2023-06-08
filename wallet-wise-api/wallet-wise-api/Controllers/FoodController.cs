using Microsoft.AspNetCore.Mvc;
using wallet_wise_api.Dto;
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

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] FoodFormModelDto foodFormModel)
    {
        try
        {
            var documentId = await _service.CreateFood(foodFormModel.Food!, foodFormModel.File!);

            if(documentId == null)
            {
                return BadRequest("Recheck input");
            }
            return Ok(documentId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(500, "Something went wrong");
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
