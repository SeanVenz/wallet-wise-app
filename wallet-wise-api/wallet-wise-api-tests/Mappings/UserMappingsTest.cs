using AutoMapper;
using wallet_wise_api.Mappings;

namespace wallet_wise_api_tests.Mappings
{
    public class UserMappingsTest
    {
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configuration;

        public UserMappingsTest()
        {
            _configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<UserMappings>();
            });

            _mapper = _configuration.CreateMapper();
        }

        [Fact]
        public void UserMapsToUserDto_MapsCorrectly_ReturnsMappedUserDto()
        {
            // Arrange
            var user = new User
            {
                Id = "1",
                FullName = "testuser",
                Email = "testuser@example.com"
            };

            // Act
            var result = _mapper.Map<UserDto>(user);

            // Assert
            Assert.Equal(user.Id, result.Id);
            Assert.Equal(user.FullName, result.FullName);
            Assert.Equal(user.Email, result.Email);
            // Add assertions for other properties
        }

        [Fact]
        public void UserMapsToUserDto_NullInput_ReturnsNull()
        {
            // Arrange
            User user = null;

            // Act
            var result = _mapper.Map<UserDto>(user);

            // Assert
            Assert.Null(result);
        }
    }
}
