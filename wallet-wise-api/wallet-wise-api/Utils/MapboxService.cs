namespace wallet_wise_api.Utils
{
    internal class MapboxService
    {
        private string mapboxAccessToken;

        public MapboxService(string mapboxAccessToken)
        {
            this.mapboxAccessToken = mapboxAccessToken;
        }

        public string GenerateMapWithPin(double latitude, double longitude)
        {
            return "Generate Map";
        }
    }
}