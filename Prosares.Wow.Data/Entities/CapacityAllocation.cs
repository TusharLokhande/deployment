using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("CapacityAllocation")]
    public partial class CapacityAllocation : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        public long EngagementId { get; set; }
        [Column(TypeName = "date")]
        public DateTime FromDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime ToDate { get; set; }
        public long EmployeeId { get; set; }
        public bool? IsEngagementLead { get; set; }
        public double FractionAllocated { get; set; }
        public double allocatedMandaysPerMonth { get; set; }
        public double allocatedResourcePerMonth { get; set; }
        public double totalAllocatedMandays { get; set; }
        public double totalResourceAllocation { get; set; }
        public double Mandays { get; set; }
        //public string EngagementLead { get; set; }
        public string EngagementType { get; set; }
        public string EmployeeName { get; set; }
        [ForeignKey(nameof(EmployeeId))]
        [InverseProperty(nameof(EmployeeMasterEntity.CapacityAllocations))]
        public virtual EmployeeMasterEntity Employee { get; set; }
        [ForeignKey(nameof(EngagementId))]
        [InverseProperty(nameof(EngagementMaster.CapacityAllocations))]
        public virtual EngagementMaster Engagement { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }

    }
}
