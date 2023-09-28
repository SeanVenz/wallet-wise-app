using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wallet_wise_api_tests.Mappings
{
    using AutoMapper;

    namespace wallet_wise_api_tests.Mappings
    {
        public class FoodMappingsTest
        {
            private readonly IMapper _mapper;
            private readonly MapperConfiguration _configuration;

            public FoodMappingsTest()
            {
                _configuration = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile<FoodMappings>();
                });
                _mapper = _configuration.CreateMapper();
            }

            [Fact]
            public void FoodCreationDtoMapsToFood_MapsCorrectly_ReturnsMappedFood()
            {
                //Arrange
                var foodCreationDto = new FoodCreationDto();

                //Act
                var result = _mapper.Map<Food>(foodCreationDto);

                //Assert
                Assert.Equal(foodCreationDto.FoodType, result.FoodType);
                Assert.Equal(foodCreationDto.Name, result.Name);
                Assert.Equal(foodCreationDto.isAvailable, result.isAvailable);
                Assert.Equal(foodCreationDto.Price, result.Price);
                Assert.Equal(foodCreationDto.File, result.File);
            }

            [Fact]
            public void FoodCreationDtoMapsToFood_NullInput_ReturnsNull()
            {
                //Arrange
                FoodCreationDto foodCreation = null;

                //Act
                var result = _mapper.Map<Food>(foodCreation);

                //Assert
                Assert.Null(result);
            }

            [Fact]
            public void FoodMapsToFoodDto_MapsCorrectly_ReturnsMappedFood()
            {
                //Arrange
                var food = new Food();

                //Act
                var result = _mapper.Map<FoodDto>(food);

                //Assert
                Assert.Equal(food.FoodType, result.FoodType);
                Assert.Equal(food.Name, result.Name);
                Assert.Equal(food.isAvailable, result.isAvailable);
                Assert.Equal(food.Price, result.Price);
                Assert.Equal(food.ImageUrl, result.ImageUrl);
            }

            [Fact]
            public void FoodMapsToFoodDto_NullInput_ReturnsNull()
            {
                //Arrange
                Food food = null;

                //Act
                var result = _mapper.Map<FoodDto>(food);

                //Assert
                Assert.Null(result);
            }
        }
    }
}
