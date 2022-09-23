using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("CostCenter")]
    public partial class CostCenter : BaseEntity
    {
        public CostCenter()
        {
            EmployeeMasters = new HashSet<EmployeeMasterEntity>();
        }

        //[Key]
        //[Column("ID")]
        //public long Id { get; set; }
       //[Required]
        [Column("CostCenter")]
        [StringLength(500)]
        public string CostCenter1 { get; set; }

        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        [InverseProperty(nameof(EmployeeMasterEntity.CostCenter))]
        public virtual ICollection<EmployeeMasterEntity> EmployeeMasters { get; set; }
    }
}
