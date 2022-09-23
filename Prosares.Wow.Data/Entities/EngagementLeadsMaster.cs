using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("EngagementLeadsMaster")]
    public partial class EngagementLeadsMaster : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        public long EngagementId { get; set; }
        public long EmployeeId { get; set; }
        

        [ForeignKey(nameof(EmployeeId))]
        [InverseProperty(nameof(EmployeeMasterEntity.EngagementLeadsMasters))]
        public virtual EmployeeMasterEntity Employee { get; set; }
        [ForeignKey(nameof(EngagementId))]
        [InverseProperty(nameof(EngagementMaster.EngagementLeadsMasters))]
        public virtual EngagementMaster Engagement { get; set; }
    }
}
