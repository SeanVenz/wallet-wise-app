using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using wallet_wise_api.Dto;
using wallet_wise_api.Service;

namespace wallet_wise_api.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _service;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IChatService service, ILogger<ChatController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet("{id}", Name = "GetChat")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ChatDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetChat(string id)
        {
            try
            {
                var chat = await _service.GetChat(id);

                if (chat == null)
                {
                    return NotFound();
                }

                return Ok(chat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpPost(Name = "SendChat")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ChatDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendChat([FromBody] ChatDto chatDto)
        {
            try
            {
                if (chatDto == null)
                {
                    return BadRequest("Invalid input");
                }

                var chat = await _service.SendChat(chatDto);

                return CreatedAtAction("SendChat", chat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpPost("setchatroom", Name = "SetChatRoom")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ChatDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SetChatRoom([FromBody] SetChatRoomRequestDto request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest("Invalid input");
                }

                var chat = await _service.SetChatRoom(request.UserA, request.UserB);

                return CreatedAtAction("SetChatRoom", chat);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        [HttpGet("chatroom/{id}", Name = "GetChatRoom")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ChatDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetChatRoom(string id)
        {
            try
            {
                var chatRoom = await _service.GetChatRoom(id);

                if (chatRoom == null)
                {
                    return NotFound();
                }

                return Ok(chatRoom);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }
    }
}
