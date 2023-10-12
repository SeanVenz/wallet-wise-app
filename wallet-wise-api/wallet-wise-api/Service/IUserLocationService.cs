namespace wallet_wise_api.Service
{
    public interface IUserLocationService
    {
        public string GenerateMapWithPin(UserLocation location);

        public UserLocation GetUserLocation(int latitude, int longitude);
    }
}
