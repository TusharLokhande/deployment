using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Utility.Entities
{
    public class TasksTimeSheet:BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Column("TaskID")]
        public long TaskId { get; set; }
        [Column(TypeName = "date")]
        public DateTime TimeSheetDate { get; set; }
        public int HoursSpend { get; set; }
        public int TaskStatus { get; set; }
        public string Remark { get; set; }

        public int HoursSpent { get; set; }
    }
}
