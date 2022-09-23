using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class CapacityUtilizationReport : BaseEntity
    {
        public string EngagementType { get; set; }
        public string Engagement { get; set; }

        public string MasterType { get; set; }
        public string Resource { get; set; }
        public string Customer { get; set; }

        public float POValue { get; set; }

        public string POStatus { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Customers { get; set; }

        public string EngagementTypes { get; set; }

        public string Engagements { get; set; }

        public int MandaysPlanned { get; set; }

        public float MandaysLeaves { get; set; }

        public float MandaysActual { get; set; }

        public float Variance { get; set; }

        public float NonCharged { get; set; }

        public int POManDays { get; set; }

        public float BudgetMandays { get; set; }

        public float TotalspendMandays { get; set; }

        public float BalanceMandays { get; set; }


        public long count { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }


    }
}
