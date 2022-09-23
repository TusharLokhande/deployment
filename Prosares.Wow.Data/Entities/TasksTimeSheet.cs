using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("TasksTimeSheet")]
    public partial class TasksTimeSheet : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Column("TaskID")]
        public long TaskId { get; set; }
        [Column(TypeName = "date")]
        public DateTime TimeSheetDate { get; set; }
        public decimal HoursSpend { get; set; }
        public int TaskStatus { get; set; }
        public string Remark { get; set; }


        [ForeignKey(nameof(TaskId))]
        [InverseProperty(nameof(TaskMaster.TasksTimeSheets))]
        public virtual TaskMaster Task { get; set; }
    }
}
