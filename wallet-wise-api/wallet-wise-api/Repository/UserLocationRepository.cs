using wallet_wise_api.Utils;

namespace wallet_wise_api.Repository
{
    public class UserLocationRepository : IUserLocationRepository
    {
        private readonly MapboxService mapboxService;

        public UserLocationRepository(string mapboxAccessToken)
        {
            mapboxService = new MapboxService(mapboxAccessToken);
        }

        public string GenerateMapWithPin(UserLocation location)
        {
            return mapboxService.GenerateMapWithPin(location.Latitude, location.Longitude);
        }

        public UserLocation GetUserLocation(int latitude, int longitude)
        {
            return new UserLocation { Latitude = latitude, Longitude = longitude };
        }
    }
}
