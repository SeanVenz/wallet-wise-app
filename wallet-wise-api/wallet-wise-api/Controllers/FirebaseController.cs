using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using wallet_wise_api.Models;

[Route("api/[controller]")]
[ApiController]
public class FirebaseController : ControllerBase
{
    private readonly FirestoreDb _db;

    public FirebaseController()
    {
        // Initialize Firebase Admin SDK
        FirebaseApp app = FirebaseApp.DefaultInstance;
        if (app == null)
        {
            var options = new AppOptions
            {
                Credential = GoogleCredential.GetApplicationDefault(),
            };
            app = FirebaseApp.Create(options);
        }

        // Get the project ID from FirebaseApp
        string projectId = app.Options.ProjectId;

        // Create the FirestoreDb instance using the project ID
        _db = FirestoreDb.Create(projectId);
    }

    [HttpPost]
    public async Task<IActionResult> CreateDocument([FromBody] MyDataModel data)
    {
        // Create a new document reference
        CollectionReference collection = _db.Collection("myCollection");
        DocumentReference document = await collection.AddAsync(data);

        // Return a success response
        return Ok(document.Id);
    }
}
