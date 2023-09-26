using System;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;
using Xunit;

namespace wallet_wise_api_tests.Service
{
    public class UserServiceTest
    {
        private readonly UserService _service;
        private Mock<IUserRepository> _mockUserRepository;
        private Mock<IMapper> _mockMapper;

        public UserServiceTest()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockMapper = new Mock<IMapper>();

            _service = new UserService(_mockUserRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task SignUp_Success_ReturnsUserId()
        {
            // Arrange
            var userDto = new UserDto
            {
                // Set your userDto properties here
            };

            var userModel = new User();
            var userId = Guid.NewGuid().ToString();

            _mockMapper.Setup(mapper => mapper.Map<User>(userDto))
                .Returns(userModel);
            _mockUserRepository.Setup(repository => repository.SignUp(userModel))
                .ReturnsAsync(userId);

            // Act
            var result = await _service.SignUp(userDto);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<string>(result);
            Assert.Equal(userId, result);
        }

        [Fact]
        public async Task SignUp_Fails_ThrowsException()
        {
            // Arrange
            var userDto = new UserDto
            {
                // Set your userDto properties here
            };

            var userModel = new User();

            _mockMapper.Setup(mapper => mapper.Map<User>(userDto))
                .Returns(userModel);
            _mockUserRepository.Setup(repository => repository.SignUp(userModel))
                .Throws(new Exception("Failed to sign up"));

            // Act
            async Task Act() => await _service.SignUp(userDto);

            // Assert
            var exception = await Assert.ThrowsAsync<Exception>(Act);
            Assert.Equal("Failed to sign up", exception.Message);
        }

        [Fact]
        public async Task Login_Success_ReturnsToken()
        {
            // Arrange
            var email = "user@example.com";
            var password = "password";
            var token = "token";

            _mockUserRepository.Setup(repository => repository.Login(email, password))
                .ReturnsAsync(token);

            // Act
            var result = await _service.Login(email, password);

            // Assert
            Assert.NotNull(result);
            Assert.IsType<string>(result);
            Assert.Equal(token, result);
        }

        [Fact]
        public async Task Login_InvalidInput_ThrowsException()
        {
            // Arrange
            string email = null;
            string password = null;

            // Act
            async Task Act() => await _service.Login(email, password);

            // Assert
            var exception = await Assert.ThrowsAsync<ArgumentNullException>(Act);
            Assert.Equal(exception.Message, exception.Message);
        }

        [Fact]
        public async Task SendVerificationEmail_Success_ReturnsResult()
        {
            // Arrange
            var email = "user@example.com";
            var result = "Success";

            _mockUserRepository.Setup(repository => repository.SendVerificationEmail(email))
                .ReturnsAsync(result);

            // Act
            var emailRequest = new UserDto { Email = email };
            var response = await _service.SendVerificationEmail(emailRequest.Email);

            // Assert
            Assert.NotNull(response);
            Assert.IsType<string>(response);
            Assert.Equal(result, response);
        }

        [Fact]
        public async Task SendVerificationEmail_InvalidInput_ThrowsException()
        {
            // Arrange
            string email = null;

            // Act
            async Task Act() => await _service.SendVerificationEmail(email);

            // Assert
            var exception = await Assert.ThrowsAsync<ArgumentNullException>(Act);
            Assert.Equal("email", exception.ParamName);
        }
    }
}
