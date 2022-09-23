using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class MileStone : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Column("MileStone")]
        [StringLength(1000)]
        public string MileStones { get; set; }
        public long EngagementId { get; set; }
        public decimal Amount { get; set; }
        [Column(TypeName = "date")]
        public DateTime PlannedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime RevisedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? CompletedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? InvoicedDate { get; set; }
        public long MandaysBalance { get; set; }
        public long MandaysPlanned { get; set; }
        public long MandaysActual { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        public DateTime fromDate { get; set; }

        public DateTime toDate { get; set; }
        public string? Engagement_Name { get; set; }

        [ForeignKey(nameof(EngagementId))]
        [InverseProperty(nameof(EngagementMaster.MileStones))]
        public virtual EngagementMaster Engagement { get; set; }
    }
}
