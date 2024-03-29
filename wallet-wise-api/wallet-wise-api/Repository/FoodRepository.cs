﻿using Google.Apis.Storage.v1.Data;
using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;
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

        public async Task<string> CreateFood(Food food)
        {
            // Get the extension of the file
            var extension = Path.GetExtension(food.File!.FileName);

            //create unique identifier for the image
            var imageId = Guid.NewGuid().ToString() + extension;

            // the folder in the firebase
            var objectName = $"foodImages/{imageId}";

            // check type of the uploaded file 
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(food.File!.FileName, out var contentType))
            {
                //default type
                contentType = "application/octet-stream";
            }

            //copy the contents of the uploaded file
            using (var memoryStream = new MemoryStream())
            {
                await food.File.CopyToAsync(memoryStream);
                //upload the contents to bucket
                await _storageClient.UploadObjectAsync(bucketName, objectName, contentType, memoryStream);
            }

            // Make the uploaded object publicly accessible
            var storageObject = await _storageClient.GetObjectAsync(bucketName, objectName);
            storageObject.Acl = storageObject.Acl ?? new List<ObjectAccessControl>();
            storageObject.Acl.Add(new ObjectAccessControl { Entity = "allUsers", Role = "READER" });
            await _storageClient.UpdateObjectAsync(storageObject);

            //modify public url based on bucket and its name
            food.ImageUrl = $"https://storage.googleapis.com/{bucketName}/{objectName}";

            //Add the food using the document reference
            _foodDocument = await _foodCollection.AddAsync(food);

            //return the documentId generated by firebase
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
