using AutoMapper;
using Moq;
using wallet_wise_api.Repository;
using wallet_wise_api.Service;

namespace wallet_wise_api_tests.Service
{
    public class FoodServiceTest
    {
        private readonly FoodService _service;
        private Mock<IFoodRepository> _mockFoodRepository;
        private Mock<IMapper> _mockMapper;

        public FoodServiceTest()
        {
            _mockFoodRepository = new Mock<IFoodRepository>();
            _mockMapper = new Mock<IMapper>();

            _service = new FoodService(_mockFoodRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task CreateFood_CreatesFood_ReturnsFood()
        {
            //Arrange
            var foodCreation = new FoodCreationDto();
            var foodModel = new Food();
            var foodDto = new FoodDto();
            var documentId = Guid.NewGuid().ToString();

            _mockMapper.Setup(mapper => mapper.Map<Food>(foodCreation))
                .Returns(foodModel);
            _mockFoodRepository.Setup(repository => repository.CreateFood(foodModel))
                .ReturnsAsync(documentId);
            _mockFoodRepository.Setup(repository => repository.GetFood(documentId))
                .ReturnsAsync(foodModel);
            _mockMapper.Setup(mapper => mapper.Map<FoodDto>(foodModel))
                .Returns(foodDto);

            //Act
            var result = await _service.CreateFood(foodCreation);

            //Assert
            Assert.NotNull(result);
            Assert.IsType<FoodDto>(result);
            Assert.Equal(foodDto, result);
        }

        [Fact]
        public async Task CreateFood_FailsToCreateFood_ThrowsException()
        {
            // Arrange
            var foodCreation = new FoodCreationDto();
            var foodModel = new Food();

            _mockMapper.Setup(mapper => mapper.Map<Food>(foodCreation))
                .Returns(foodModel);
            _mockFoodRepository.Setup(repository => repository.CreateFood(foodModel))
                .Throws(new Exception("Something went wrong"));

            // Act
            async Task Act() => await _service.CreateFood(foodCreation);

            // Assert
            var exception = await Assert.ThrowsAsync<Exception>(Act);
            Assert.Equal("Something went wrong", exception.Message);
        }

        [Fact]
        public async Task GetAllFood_HasFood_ReturnsFood()
        {
            //Arrange
            var foodModel = new List<Food>
            {
                new Food { FoodType = "Type1", Name = "Food1", Price = 10, isAvailable = true, ImageUrl = "image1.png" },
                new Food { FoodType = "Type2", Name = "Food2", Price = 20, isAvailable = false, ImageUrl = "image2.png" }
            };

            var foodDto = new List<FoodDto>
            {
                new FoodDto { FoodType = "Type1", Name = "Food1", Price = 10, isAvailable = true, ImageUrl = "image1.png" },
                new FoodDto { FoodType = "Type2", Name = "Food2", Price = 20, isAvailable = false, ImageUrl = "image2.png" }
            };

            _mockFoodRepository.Setup(repository => repository.GetAllFoods())
                .ReturnsAsync(foodModel);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<FoodDto>>(foodModel))
                .Returns(foodDto);

            //Act
            var result = await _service.GetAllFoods();

            //Assert
            Assert.NotNull(result);
            Assert.IsType<List<FoodDto>>(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetAllFood_HasNoFood_ReturnsEmpty()
        {
            //Arrange 
            var foodModel = new List<Food>();
            var foodDto = new List<FoodDto>();

            _mockFoodRepository.Setup(repository => repository.GetAllFoods())
                .ReturnsAsync(foodModel);
            _mockMapper.Setup(mapper => mapper.Map<IEnumerable<FoodDto>>(foodModel))
                .Returns(foodDto);

            //Act
            var result = await _service.GetAllFoods();

            //Assert
            Assert.NotNull(result);
            Assert.IsType<List<FoodDto>>(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetAllFood_HasError_ReturnsException()
        {
            //Arrange
            _mockFoodRepository.Setup(repository => repository.GetAllFoods())
                .ThrowsAsync(new Exception("Something went wrong"));

            //Act
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.GetAllFoods());

            //Assert
            Assert.Equal("Something went wrong", exception.Message);
        }
    }
}
