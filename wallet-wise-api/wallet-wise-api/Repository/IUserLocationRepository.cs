namespace wallet_wise_api.Repository
{
    public interface IUserLocationRepository
    {
        public string GenerateMapWithPin(UserLocation location);

        public UserLocation GetUserLocation(int latitude, int longitude);
    }
}
