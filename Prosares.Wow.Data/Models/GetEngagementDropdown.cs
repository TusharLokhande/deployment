using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class GetEngagementDropdown:BaseEntity

    {
        public string Engagement { get; set; }
        public string? Phase { get; set; }

        public long? PhaseId { get; set; }

        public string? Application { get; set; }

        public long? ApplicationId { get; set; }

        public long? EngagementType { get; set; }

        public long EmployeeId { get; set; }
        public long EngagementId { get; set; }
    }
}
