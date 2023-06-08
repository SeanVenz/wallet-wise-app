using AutoMapper;
using wallet_wise_api.Dto;
using wallet_wise_api.Repository;

namespace wallet_wise_api.Service
{
    public class FoodService : IFoodService
    {
        private readonly IFoodRepository _repository;
        private readonly IMapper _mapper;

        public FoodService(IFoodRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<FoodDto?> CreateFood(FoodCreationDto foodDto, IFormFile file)
        {
            if(foodDto == null || file == null) 
            {
                return null;
            }
            var foodModel = _mapper.Map<Food>(foodDto);
            var documentId = await _repository.CreateFood(foodModel, file);
            var createdFood = await _repository.GetFood(documentId);

            return _mapper.Map<FoodDto>(createdFood);
        }

        public async Task<IEnumerable<FoodDto>> GetAllFoods()
        {
            var foodModel = await _repository.GetAllFoods();
            return _mapper.Map<IEnumerable<FoodDto>>(foodModel);
        }
    }
}
