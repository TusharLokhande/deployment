using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("NotificationMaster")]
    public partial class NotificationMaster :BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        public long ToEmp { get; set; }
        public long? FromEmp { get; set; }
        public long NotificationtType { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime ExpiryDate { get; set; }
      

        [ForeignKey(nameof(FromEmp))]
        [InverseProperty(nameof(EmployeeMasterEntity.NotificationMasterFromEmpNavigations))]
        public virtual EmployeeMasterEntity FromEmpNavigation { get; set; }
        [ForeignKey(nameof(ToEmp))]
        [InverseProperty(nameof(EmployeeMasterEntity.NotificationMasterToEmpNavigations))]
        public virtual EmployeeMasterEntity ToEmpNavigation { get; set; }
    }
}
