using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("LeavesResonMaster")]
    public partial class LeavesResonMaster :BaseEntity
    {
        public LeavesResonMaster()
        {
            LeaveRequestsMasters = new HashSet<LeaveRequestsMaster>();
        }

        //[Key]
        //[Column("ID")]
        //public long Id { get; set; }
        //[Required]
        //[StringLength(1000)]
        public string LeavesReson { get; set; }

        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        [InverseProperty(nameof(LeaveRequestsMaster.Reson))]
        public virtual ICollection<LeaveRequestsMaster> LeaveRequestsMasters { get; set; }
    }
}
