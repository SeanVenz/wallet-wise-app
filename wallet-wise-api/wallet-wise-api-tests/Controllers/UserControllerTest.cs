using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using wallet_wise_api.Controllers;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;
using Xunit;

namespace wallet_wise_api_tests.Controllers
{
    public class UserControllerTest
    {
        private readonly UserController _controller;
        private readonly Mock<IUserService> _mockUserService;
        private readonly Mock<ILogger<UserController>> _mockLogger;

        public UserControllerTest()
        {
            _mockUserService = new Mock<IUserService>();
            _mockLogger = new Mock<ILogger<UserController>>();
            _controller = new UserController(_mockUserService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task SignUp_ValidInput_ReturnsOk()
        {
            // Arrange
            var userDto = new UserDto();

            _mockUserService.Setup(service => service.SignUp(userDto))
                .ReturnsAsync("userId");

            // Act
            var result = await _controller.SignUp(userDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task SignUp_InvalidInput_ReturnsBadRequest()
        {
            // Arrange
            UserDto userDto = null;

            // Act
            var result = await _controller.SignUp(userDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task SignUp_Exception_ReturnsInternalServerError()
        {
            // Arrange
            var userDto = new UserDto();

            _mockUserService.Setup(service => service.SignUp(userDto))
                .Throws(new Exception());

            // Act
            var result = await _controller.SignUp(userDto);

            // Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task Login_ValidInput_ReturnsOk()
        {
            // Arrange
            var loginRequest = new UserDto
            {
                Email = "user@example.com",
                Password = "password"
            };

            _mockUserService.Setup(service => service.Login(loginRequest.Email, loginRequest.Password))
                .ReturnsAsync("token");

            // Act
            var result = await _controller.Login(loginRequest);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Login_InvalidInput_ReturnsBadRequest()
        {
            // Arrange
            UserDto loginRequest = null;

            // Act
            var result = await _controller.Login(loginRequest);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task Login_Exception_ReturnsInternalServerError()
        {
            // Arrange
            var loginRequest = new UserDto
            {
                Email = "user@example.com",
                Password = "password"
            };

            _mockUserService.Setup(service => service.Login(loginRequest.Email, loginRequest.Password))
                .Throws(new Exception());

            // Act
            var result = await _controller.Login(loginRequest);

            // Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task SendVerificationEmail_ValidInput_ReturnsOk()
        {
            // Arrange
            var emailRequest = new UserDto
            {
                Email = "user@example.com"
            };

            _mockUserService.Setup(service => service.SendVerificationEmail(emailRequest.Email))
                .ReturnsAsync("verificationCode");

            // Act
            var result = await _controller.SendVerificationEmail(emailRequest);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task SendVerificationEmail_InvalidInput_ReturnsBadRequest()
        {
            // Arrange
            UserDto emailRequest = null;

            // Act
            var result = await _controller.SendVerificationEmail(emailRequest);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task SendVerificationEmail_Exception_ReturnsInternalServerError()
        {
            // Arrange
            var emailRequest = new UserDto
            {
                Email = "user@example.com"
            };

            _mockUserService.Setup(service => service.SendVerificationEmail(emailRequest.Email))
                .Throws(new Exception());

            // Act
            var result = await _controller.SendVerificationEmail(emailRequest);

            // Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public void SendResetPasswordEmail_ValidInput_ReturnsNoContent()
        {
            // Arrange
            var emailRequest = new UserDto
            {
                Email = "user@example.com"
            };

            // Act
            var result = _controller.SendResetPasswordEmail(emailRequest);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void SendResetPasswordEmail_Exception_ReturnsInternalServerError()
        {
            // Arrange
            var emailRequest = new UserDto
            {
                Email = "user@example.com"
            };

            _mockUserService.Setup(service => service.SendResetPasswordEmail(emailRequest.Email))
                .Throws(new Exception());

            // Act
            var result = _controller.SendResetPasswordEmail(emailRequest);

            // Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public void Logout_ValidInput_ReturnsNoContent()
        {
            // Act
            var result = _controller.Logout();

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void Logout_Exception_ReturnsInternalServerError()
        {
            // Arrange
            _mockUserService.Setup(service => service.Logout())
                .Throws(new Exception());

            // Act
            var result = _controller.Logout();

            // Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }
    }
}
