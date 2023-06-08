using System.ComponentModel.DataAnnotations;

namespace wallet_wise_api.Dto
{
    public class FoodFormModelDto
    {
        public FoodCreationDto? Food { get; set; }
        [Required(ErrorMessage = "Image is Required!")]
        public IFormFile? File { get; set; }
    }
}
