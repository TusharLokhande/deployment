using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class CalenderResponseModel : BaseEntity
    {
        public int HoursSpent { get; set; }
        public DateTime Date { get; set; }
        public int EmployeeId { get; set; }
        public string Status { get; set; }
    }
}
