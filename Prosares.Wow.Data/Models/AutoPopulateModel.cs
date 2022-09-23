using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class AutoPopulateRequestModel
    {
        public long? EngagementId { get; set; }
      //  public long? EmployeeId { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

    }

    public class AutoPopulateResponseModel
    {
        public long? Id { get; set; }
        public decimal? HoursAssigned { get; set; }
        public decimal? Mandays { get; set; }
    }

    public class AutoPopulateAssignedHoursRequestModel
    {
        public long? EngagementId { get; set; }
        public long? EmployeeId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

    }

    public class AutoPopulateAssignedHoursResponseModel
    {
        public long? Id { get; set; }
        public decimal? HoursAssigned { get; set; }
        public decimal? HoursAllocated { get; set; }
    }
}
