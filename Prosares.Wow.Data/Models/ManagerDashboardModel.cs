using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class ManagerDashboardModel : BaseEntity
    {
        public int Role { get; set; }
        public long UserId { get; set; }
        public string Type { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        public EngagementVal[]? Engagement { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public bool? isExcel { get; set; }

        public int Status { get; set; }

    }

    public class ManagerDashboardModelResponse
    {
        public int count { get; set; }
        public List<Entities.TaskMaster> TaskData { get; set; }
        public List<Entities.TicketsMaster> TicketData { get; set; }

    }
    public class EngagementVal
    {
        public string label { get; set; }
        public long value { get; set; }
    }
    public class ApplicationAndPhaseResponse : BaseEntity
    {
        public decimal? HoursSpent { get; set; }

        public string? Application { get; set; }

        public string? Phase { get; set; }

        public string? AssignedTo { get; set; }

        public string? Engagement { get; set; }

        public string? Customer { get; set; }

        public string? CreatedByString { get; set; }

        public string? Status { get; set; }

        public string? Priority { get; set; }

        public string? EngagementType { get; set; }

    }
}
