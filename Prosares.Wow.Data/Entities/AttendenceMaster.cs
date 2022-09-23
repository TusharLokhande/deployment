using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("AttendenceMaster")]
    public partial class AttendenceMaster :BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        public long EmployeeId { get; set; }
        [Column(TypeName = "date")]
        public DateTime CalenderDate { get; set; }
        public int HoursWorked { get; set; }
        public int AttendenceType { get; set; }
      

        [ForeignKey(nameof(EmployeeId))]
        [InverseProperty(nameof(EmployeeMasterEntity.AttendenceMasters))]
        public virtual EmployeeMasterEntity Employee { get; set; }
    }
}
