using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class EngagementMaster : BaseEntity
    {
        public long Id { get; set; }
        public string Engagement { get; set; }

        public string? CustomerName { get; set; }
        public long CustomerId { get; set; }
        public int EngagementType { get; set; }
        public decimal? Povalue { get; set; }
        public int Postatus { get; set; }
        public DateTime? Poexpiry { get; set; }
        public decimal? Pomonths { get; set; }
        public int Billing { get; set; }

        public decimal? PoresourcesPerMonth { get; set; }
        public decimal? BudgetResoucesPerMonth { get; set; }
        public decimal? PomanDaysPerMonth { get; set; }
        public decimal? BudgetMandaysPerMonth { get; set; }
        public int? EngagementStatus { get; set; }
        public decimal? InvoiceValue { get; set; }
        public decimal? BalanceValue { get; set; }
        public decimal? SpentMandates { get; set; }
        public decimal? BalanceMandays { get; set; }
        public decimal? ActualCost { get; set; }
        public DateTime? PocompletionDate { get; set; }
        public DateTime? PlannedCompletionDate { get; set; }
        public DateTime? ActualCompletionDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public long CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public long? ModifiedBy { get; set; }
        public long? HoursSpent { get; set; }
        public decimal? PomanDays { get; set; }
        public decimal? BudgetMandays { get; set; }
        public string Engagement_Type { get; set; }



        [ForeignKey(nameof(CustomerId))]
        [InverseProperty("EngagementMasters")]
        public virtual Customer Customer { get; set; }
        [InverseProperty(nameof(ApplicationsMaster.Engagement))]
        public virtual ICollection<ApplicationsMaster> ApplicationsMasters { get; set; }
        [InverseProperty(nameof(CapacityAllocation.Engagement))]
        public virtual ICollection<CapacityAllocation> CapacityAllocations { get; set; }
        [InverseProperty(nameof(EngagementLeadsMaster.Engagement))]
        public virtual ICollection<EngagementLeadsMaster> EngagementLeadsMasters { get; set; }
        [InverseProperty(nameof(MileStone.Engagement))]
        public virtual ICollection<MileStone> MileStones { get; set; }
        [InverseProperty(nameof(PhaseMaster.Engagement))]
        public virtual ICollection<PhaseMaster> PhaseMasters { get; set; }
        [InverseProperty(nameof(TaskMaster.Engagement))]
        public virtual ICollection<TaskMaster> TaskMasters { get; set; }
        [InverseProperty(nameof(TicketsMaster.Engagement))]
        public virtual ICollection<TicketsMaster> TicketsMasters { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

    }
}
