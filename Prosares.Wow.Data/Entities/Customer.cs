using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class Customer : BaseEntity
    {
        public Customer()
        {
            EngagementMasters = new HashSet<EngagementMaster>();
        }

        //[Key]
        //[Column("ID")]
        //public long Id { get; set; }
        [StringLength(500)]
        public string Name { get; set; }
        [StringLength(500)]
        public string Abbreviation { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }


        [InverseProperty(nameof(EngagementMaster.Customer))]
        public virtual ICollection<EngagementMaster> EngagementMasters { get; set; }
    }
}
