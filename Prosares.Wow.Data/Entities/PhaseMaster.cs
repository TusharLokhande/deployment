using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("PhaseMaster")]
    public partial class PhaseMaster : BaseEntity
    {
        public PhaseMaster()
        {
            TaskMasters = new HashSet<TaskMaster>();
            TicketsMasters = new HashSet<TicketsMaster>();
        }

        //[Key]
        //[Column("ID")]
        //public long Id { get; set; }
        //[Required]
        [StringLength(1000)]
        public string Phase { get; set; }
        //[Required]
        public string Description { get; set; }
        [Column("EngagementID")]
        public long EngagementId { get; set; }
        [Column(TypeName = "date")]
        public DateTime PlannedDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime ActualDate { get; set; }

        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        public string EngagementName { get; set; }


        [ForeignKey(nameof(EngagementId))]
        [InverseProperty(nameof(EngagementMaster.PhaseMasters))]
        public virtual EngagementMaster Engagement { get; set; }
        [InverseProperty(nameof(TaskMaster.Phase))]
        public virtual ICollection<TaskMaster> TaskMasters { get; set; }
        [InverseProperty(nameof(TicketsMaster.Phase))]
        public virtual ICollection<TicketsMaster> TicketsMasters { get; set; }
    }
}
