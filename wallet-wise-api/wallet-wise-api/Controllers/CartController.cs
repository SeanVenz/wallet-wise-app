using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using wallet_wise_api.Service;

namespace wallet_wise_api.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;
        private readonly ILogger<CartController> _logger;

        public CartController(ICartService service, ILogger<CartController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost(Name = "AddToCart")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(CartDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddToCart([FromBody] CartDto cartItemDto)
        {
            try
            {
                if (cartItemDto == null)
                {
                    return BadRequest("Invalid input");
                }

                await _service.AddToCart(cartItemDto);

                return CreatedAtAction("AddToCart", cartItemDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpGet(Name = "GetCartItems")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(List<CartDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCartItems([FromQuery] string userId)
        {
            try
            {
                var cartItems = await _service.GetCartItems(userId);

                if (cartItems == null || cartItems.Count == 0)
                {
                    return NoContent();
                }

                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpDelete(Name = "RemoveFromCart")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveFromCart([FromQuery] string userId, [FromQuery] string foodId)
        {
            try
            {
                await _service.RemoveFromCart(userId, foodId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpDelete("clear", Name = "RemoveCartItems")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RemoveCartItems([FromQuery] string userId)
        {
            try
            {
                await _service.RemoveCartItems(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpPost("checkout", Name = "Checkout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Checkout([FromQuery] string userId)
        {
            try
            {
                await _service.Checkout(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpPost("addhascurrentorder", Name = "AddHasCurrentOrder")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AddHasCurrentOrder([FromQuery] string userId)
        {
            try
            {
                await _service.AddHasCurrentOrder(userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpGet("checkhascurrentorder", Name = "CheckHasCurrentOrder")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CheckHasCurrentOrder([FromQuery] string userId)
        {
            try
            {
                var hasCurrentOrder = await _service.CheckHasCurrentOrder(userId);
                return Ok(hasCurrentOrder);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpPut("updatefoodquantity", Name = "UpdateFoodQuantity")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateFoodQuantity([FromQuery] string userId, [FromQuery] string foodId, [FromQuery] int newQuantity)
        {
            try
            {
                await _service.UpdateFoodQuantity(userId, foodId, newQuantity);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }
    }
}
