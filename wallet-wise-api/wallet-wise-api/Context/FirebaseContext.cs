using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Configuration;

public class FirebaseContext
{
    public static void Initialize(IConfiguration configuration)
    {
        string pathToServiceAccountKey = configuration["Firebase:ServiceAccountKey"];

        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromFile(pathToServiceAccountKey),
        });
    }
}
