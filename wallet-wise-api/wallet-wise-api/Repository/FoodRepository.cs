using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;
using System.IO;
using Microsoft.AspNetCore.StaticFiles;

namespace wallet_wise_api.Repository
{
    public class FoodRepository : IFoodRepository
    {
        private readonly FirestoreContext _context;
        private readonly CollectionReference _foodCollection;
        private DocumentReference _foodDocument;
        private readonly string bucketName = "wallet-wise-baaf0.appspot.com";
        private readonly StorageClient _storageClient;

        public FoodRepository(FirestoreContext context)
        {
            _context = context;
            _foodCollection = _context.Db.Collection("food");
            _storageClient = StorageClient.Create();
            _foodDocument = _foodCollection.Document();
        }

        public async Task<string> CreateFood(Food food, IFormFile file)
        {
            // Get the extension of the file
            var extension = Path.GetExtension(file.FileName);

            var imageId = Guid.NewGuid().ToString() + extension;
            var objectName = $"foodImages/{imageId}";

            // Get the MIME type of the file
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(file.FileName, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                await _storageClient.UploadObjectAsync(bucketName, objectName, contentType, memoryStream);
            }

            // You can adjust the URL depending on the region of your bucket
            food.ImageUrl = $"https://storage.googleapis.com/{bucketName}/{objectName}";

            _foodDocument = await _foodCollection.AddAsync(food);
            return _foodDocument.Id;
        }

        public async Task<IEnumerable<Food>> GetAllFoods()
        {
            QuerySnapshot snapshot = await _foodCollection.GetSnapshotAsync();

            List<Food> foodItems = snapshot.Documents
                .Select(document => document.ConvertTo<Food>())
                .ToList();

            return foodItems;
        }

        public async Task<Food?> GetFood(string documentId)
        {
            var foodDocument = await _foodCollection.Document(documentId).GetSnapshotAsync();

            if (foodDocument.Exists)
            {
                var foodData = foodDocument.ConvertTo<Food>();
                return foodData;
            }

            return null; // Or throw an exception if the document is not found
        }


        //if filename is retained
        //public async Task<string> CreateFood(Food food, IFormFile file)
        //{
        //    // Get the cleaned filename 
        //    var filename = Path.GetFileName(file.FileName);

        //    var objectName = $"foodImages/{filename}";

        //    // Get the MIME type of the file
        //    var provider = new FileExtensionContentTypeProvider();
        //    if (!provider.TryGetContentType(file.FileName, out var contentType))
        //    {
        //        contentType = "application/octet-stream";
        //    }

        //    using (var memoryStream = new MemoryStream())
        //    {
        //        await file.CopyToAsync(memoryStream);
        //        await _storageClient.UploadObjectAsync(bucketName, objectName, contentType, memoryStream);
        //    }

        //    // You can adjust the URL depending on the region of your bucket
        //    food.ImageUrl = $"https://storage.googleapis.com/{bucketName}/{objectName}";

        //    _foodDocument = await _foodCollection.AddAsync(food);
        //    return _foodDocument.Id;
        //}


    }
}
