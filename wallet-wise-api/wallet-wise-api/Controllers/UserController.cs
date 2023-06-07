using Microsoft.AspNetCore.Mvc;
using wallet_wise_api.Service;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IFoodService _service;

    public UserController(IFoodService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Food data)
    {
        string documentId = await _service.CreateFood(data);
        return Ok(documentId);
    }
}
