using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using wallet_wise_api.Dto;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;

namespace wallet_wise_api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Signs up a new user.
        /// </summary>
        /// <param name="userDto">The user DTO containing registration information.</param>
        /// <returns>A string representing the user's unique identifier.</returns>
        [HttpPost("signup", Name = "SignUp")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(string), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SignUp([FromBody] UserDto userDto)
        {
            try
            {
                if (userDto == null)
                {
                    return BadRequest("Invalid input");
                }

                var userId = await _userService.SignUp(userDto);

                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("Failed to sign up");
                }

                return Ok(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        /// <summary>
        /// Logs in a user with the provided email and password.
        /// </summary>
        /// <param name="loginRequest">The user DTO containing login credentials.</param>
        /// <returns>A string representing an authentication token on successful login.</returns>
        [HttpPost("login", Name = "Login")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] UserDto loginRequest)
        {
            try
            {
                if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
                {
                    return BadRequest("Invalid input");
                }

                var token = await _userService.Login(loginRequest.Email, loginRequest.Password);

                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized("Invalid credentials");
                }

                return Ok(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        /// <summary>
        /// Sends a verification email to the provided email address.
        /// </summary>
        /// <param name="emailRequest">The user DTO containing the email address for verification.</param>
        /// <returns>A string representing the result of the email sending operation.</returns>
        [HttpPost("send-verification-email", Name = "SendVerificationEmail")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SendVerificationEmail([FromBody] UserDto emailRequest)
        {
            try
            {
                if (emailRequest == null || string.IsNullOrEmpty(emailRequest.Email))
                {
                    return BadRequest("Invalid input");
                }

                var result = await _userService.SendVerificationEmail(emailRequest.Email);

                if (string.IsNullOrEmpty(result))
                {
                    return BadRequest("Failed to send verification email");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        /// <summary>
        /// Sends a reset password email to the provided email address.
        /// </summary>
        /// <param name="emailRequest">The user DTO containing the email address for password reset.</param>
        [HttpPost("send-reset-password-email", Name = "SendResetPasswordEmail")]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult SendResetPasswordEmail([FromBody] UserDto emailRequest)
        {
            try
            {
                if (emailRequest == null || string.IsNullOrEmpty(emailRequest.Email))
                {
                    return BadRequest("Invalid input");
                }

                _userService.SendResetPasswordEmail(emailRequest.Email);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, "Something went wrong");
            }
        }

        /// <summary>
        /// Logs out the currently authenticated user.
        /// </summary>
        [HttpPost("logout", Name = "Logout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult Logout()
        {
            try
            {
                _userService.Logout();
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
