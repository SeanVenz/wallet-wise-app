using AutoMapper;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        }
    }
}
