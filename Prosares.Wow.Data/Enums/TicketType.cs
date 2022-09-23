using System;
using System.ComponentModel.DataAnnotations;

namespace Prosares.Wow.Data.Enums
{
    public enum TicketType
    {
        [Display(Name = "Showstopper")]
        Bug = 1,
        [Display(Name = "Critical")]
        DataUpdate = 2,
        [Display(Name = "Medium")]
        UserSupport = 3,
        [Display(Name = "Low")]
        Enhancement = 4,
    }
}