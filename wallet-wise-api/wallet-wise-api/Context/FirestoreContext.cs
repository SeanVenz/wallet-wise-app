using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.Extensions.Configuration;

public class FirestoreContext
{
    public FirestoreDb Db { get; }

    public FirestoreContext(IConfiguration configuration)
    {
        string pathToServiceAccountKey = configuration["Firebase:ServiceAccountKey"];
        string projectId = configuration["Firebase:ProjectId"];

        FirebaseApp app = FirebaseApp.DefaultInstance;

        if (app == null)
        {
            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.FromFile(pathToServiceAccountKey),
            });
        }

        Db = FirestoreDb.Create(projectId);
    }
}
