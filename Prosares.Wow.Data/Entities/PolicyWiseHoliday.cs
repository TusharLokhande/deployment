using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    public partial class PolicyWiseHoliday : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Column("PolicyID")]
        public long PolicyId { get; set; }
        [Column(TypeName = "date")]
        public DateTime Holiday { get; set; }
       

        [ForeignKey(nameof(PolicyId))]
        [InverseProperty(nameof(WorkPoliciesMaster.PolicyWiseHolidays))]
        public virtual WorkPoliciesMaster Policy { get; set; }
    }
}
