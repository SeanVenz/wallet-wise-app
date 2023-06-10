using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using wallet_wise_api.Service;

namespace wallet_wise_api_tests.Controllers
{
    public class FoodControllerTest
    {
        private readonly FoodController _controller;
        private readonly Mock<IFoodService> _mockFoodService;
        private readonly Mock<ILogger<FoodController>> _mockLogger;

        public FoodControllerTest()
        {
            _mockFoodService = new Mock<IFoodService>();
            _mockLogger = new Mock<ILogger<FoodController>>();
            _controller = new FoodController(_mockFoodService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllFoods_HasFoods_ReturnsOk()
        {
            //Arrange
            _mockFoodService.Setup(service => service.GetAllFoods())
                .ReturnsAsync(new List<FoodDto> { new FoodDto() });

            //Act
            var result = await _controller.GetAllFoods();

            //Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetAllFoods_HasNoFoods_ReturnsNoContent()
        {
            //Arrange
            _mockFoodService.Setup(service => service.GetAllFoods())
                .ReturnsAsync(new List<FoodDto>());

            //Act
            var result = await _controller.GetAllFoods();

            //Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task GetAlLFoods_Exception_ThrowsException()
        {
            //Arrange
            _mockFoodService.Setup(service => service.GetAllFoods())
                .Throws(new Exception());

            //Act
            var result = await _controller.GetAllFoods();

            //Act
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task CreateFood_CreatesFood_ReturnsCreatedFood()
        {
            //Arrange
            var food = new FoodCreationDto();

            _mockFoodService.Setup(service => service.CreateFood(food))
                .ReturnsAsync(new FoodDto());

            //Act
            var result = await _controller.CreateFood(food);

            //Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task CreateFood_CannotCreate_ReturnsBadRequest()
        {
            //Arrange
            var food = new FoodCreationDto();

            _mockFoodService.Setup(service => service.CreateFood(food))
                .ReturnsAsync((FoodDto?)null);

            //Act
            var result = await _controller.CreateFood(food);

            //Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, ((ObjectResult)result).StatusCode);
        }

        [Fact]
        public async Task CreateFood_CannotCreate_ThrowsException()
        {
            //Arrange
            var food = new FoodCreationDto();

            _mockFoodService.Setup(service => service.CreateFood(food))
                .Throws(new Exception());

            //Act
            var result = await _controller.CreateFood(food);

            //Assert
            Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, ((ObjectResult)result).StatusCode);
        }
    }
}
