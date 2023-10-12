using wallet_wise_api.Repository;

namespace wallet_wise_api.Service
{
    public class UserLocationService : IUserLocationService
    {
        private readonly IUserLocationRepository _repository;

        public UserLocationService(IUserLocationRepository repository)
        {
            _repository = repository;
        }

        public string GenerateMapWithPin(UserLocation location)
        {
            return _repository.GenerateMapWithPin(location);
        }

        public UserLocation GetUserLocation(int latitude, int longitude)
        {
            return _repository.GetUserLocation(latitude, longitude);
        }
    }
}
