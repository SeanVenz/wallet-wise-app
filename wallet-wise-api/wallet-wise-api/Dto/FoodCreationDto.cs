using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace wallet_wise_api.Dto
{
    [FirestoreData]
    public class FoodCreationDto
    {
        [Required(ErrorMessage = "FoodType is Required!")]
        [FirestoreProperty]
        public string? FoodType { get; set; }
        [Required(ErrorMessage = "Name is Required!")]
        [FirestoreProperty]
        public string? Name { get; set; }
        [FirestoreProperty]
        [Required(ErrorMessage = "Availability is Required!")]
        public bool isAvailable { get; set; }
        [Required(ErrorMessage = "Price is Required!")]
        [FirestoreProperty]
        public int Price { get; set; }
    }
}
