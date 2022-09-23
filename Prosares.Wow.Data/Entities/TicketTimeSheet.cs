using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("TicketTimeSheet")]
    public partial class TicketTimeSheet : BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Column("TicketID")]
        public long TicketId { get; set; }
        [Column(TypeName = "date")]
        public DateTime TimeSheetDate { get; set; }
        public decimal HoursSpend { get; set; }
        public int TicketStatus { get; set; }
        public string Remark { get; set; }


        [ForeignKey(nameof(TicketId))]
        [InverseProperty(nameof(TicketsMaster.TicketTimeSheets))]
        public virtual TicketsMaster Ticket { get; set; }
    }
}
