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

        public async Task<string> CreateFood(Food foodDto)
        {
            // Get the extension of the file
            var extension = Path.GetExtension(foodDto.File!.FileName);

            //create unique identifier for the image
            var imageId = Guid.NewGuid().ToString() + extension;

            // the folder in the firebase
            var objectName = $"foodImages/{imageId}";

            // check type of the uploaded file 
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(foodDto.File!.FileName, out var contentType))
            {
                //default type
                contentType = "application/octet-stream";
            }

            //copy the contents of the uploaded file
            using (var memoryStream = new MemoryStream())
            {
                await foodDto.File.CopyToAsync(memoryStream);
                //upload the contents to bucket
                await _storageClient.UploadObjectAsync(bucketName, objectName, contentType, memoryStream);
            }

            //modify public url based on bucket and its name
            var imageUrl = $"https://storage.googleapis.com/{bucketName}/{objectName}";

            var food = new Food
            {
                FoodType = foodDto.FoodType,
                Name = foodDto.Name,
                isAvailable = foodDto.isAvailable,
                Price = foodDto.Price,
                ImageUrl = imageUrl
            };

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

            return null;
        }
    }
}
