using System.ComponentModel.DataAnnotations;

namespace WowLoginModule.Models.Login
{
    public class LoginModel
    {
        //[JsonPropertyName("UN")]
        [Required]
        public string UserName { get; set; }


        //[JsonPropertyName("PWD")]
        [Required]
        public string Password { get; set; }


        //[JsonPropertyName("TKN")]
        //[Required]
        //public string Token { get; set; }
    }
}
