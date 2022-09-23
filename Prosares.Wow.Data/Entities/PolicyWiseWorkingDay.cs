using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class PolicyWiseWorkingDay : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Column("PolicyID")]
        public long PolicyId { get; set; }
        [Required]
        [StringLength(50)]
        public string Day { get; set; }
   

        [ForeignKey(nameof(PolicyId))]
        [InverseProperty(nameof(WorkPoliciesMaster.PolicyWiseWorkingDays))]
        public virtual WorkPoliciesMaster Policy { get; set; }
    }
}
