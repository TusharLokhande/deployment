using System.ComponentModel.DataAnnotations;

namespace Prosares.Wow.Data.Enums
{
    public enum EfficiencyEnum
    {
        [Display(Name = "0.25")]
        one = 1,
        [Display(Name =  "0.5")]
        two = 2,
        [Display(Name = "0.75")]
        three = 3,
        [Display(Name = "1")]
        four = 4
    }
}