using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class EngagementByIdResponseModel
    {
        public long Id { get; set; }
        public string Engagement { get; set; }
        public int EngagementType { get; set; }
        public int EngagementStatus { get; set; }
        public decimal POValue { get; set; }
        public int POStatus { get; set; }
        public DateTime POExpiry { get; set; }
        public int POMonths { get; set; }
        public int Billing { get; set; }
        public int POResourcesPerMonth { get; set; }
        public int BudgetResoucesPerMonth { get; set; }
        public int POManDaysPerMonth { get; set; }
        public int BudgetMandaysPerMonth { get; set; }
        public long InvoiceValue { get; set; }
        public long BalanceValue { get; set; }
        public long SpentMandates { get; set; }
        public long HoursSpent { get; set; }
        public long BudgetMandays { get; set; }
        public long POManDays { get; set; }
        public long BalanceMandays { get; set; }
        public long ActualCost { get; set; }
        public DateTime POCompletionDate { get; set; }
        public DateTime PlannedCompletionDate { get; set; }
        public DateTime ActualCompletionDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public long CreatedBy { get; set; }
        public long ModifiedBy { get; set; }
        public bool IsActive { get; set; }
    }

    public class EngagementByIdRequestModel
    {
        public int EngagementId { get; set; }
    }
}
