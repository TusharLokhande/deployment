using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("TaskTicketStatus")]
    public partial class TaskTicketStatus: BaseEntity
    {
        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Required]
        [StringLength(1000)]
        public string Value { get; set; }
        public string Type { get; set; }
    }
}
