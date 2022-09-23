using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("TicketsMaster")]
    [Index(nameof(TaskUid), Name = "UQ__TicketsM__65DA9A848841E440", IsUnique = true)]
    public partial class TicketsMaster : BaseEntity
    {
        public TicketsMaster()
        {
            TicketTimeSheets = new HashSet<TicketTimeSheet>();
        }

        [Key]
        [Column("ID")]
        public long Id { get; set; }
       
        [Column("TaskUID")]
        [StringLength(1000)]
        public string? TaskUid { get; set; }
        [Column("EngagementID")]
        public long? EngagementId { get; set; }
        [Column("PhaseID")]
        public long? PhaseId { get; set; }
        [Column("ApplicationID")]
        public long? ApplicationId { get; set; }
        [Required]
        [StringLength(1000)]
        public string TicketTitle { get; set; }
       
        [StringLength(1000)]
        public string? TaskTitle { get; set; }
        [Required]
        public string TicketDescription { get; set; }
        public long AssignedTo { get; set; }
        public int Priority { get; set; }
        public decimal HoursAssigned { get; set; }
        public decimal? HoursSpent { get; set; }
        [Column(TypeName = "date")]
        public DateTime? IncidentDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ReportDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ResolveDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ResponedDate { get; set; }
        public int TicketType { get; set; }
        [Column("PreviousTicketID")]
        public long? PreviousTicketId { get; set; }
        public int TicketStatus { get; set; }
        public bool IsChargeable { get; set; }
        public string NoChargesReason { get; set; }
        public string Remarks { get; set; }

        public int? TicketNatureOfIssue { get; set; }
        public decimal? TodayHoursSpent { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ActualEndDate { get; set; }

        public string? PhaseString { get; set; }

        public string? ApplicationString { get; set; }

        public string? AssignedToString { get; set; }
        public string? EngagementString { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        public string StatusString { get; set; }
        public string Customer { get; set; }
        public string PriorityString { get; set; }
        public string CreatedByString { get; set; }
        public string? EngagementTypeString { get; set; }
        [ForeignKey(nameof(ApplicationId))]
        [InverseProperty(nameof(ApplicationsMaster.TicketsMasters))]
        public virtual ApplicationsMaster Application { get; set; }
        [ForeignKey(nameof(AssignedTo))]
        [InverseProperty(nameof(EmployeeMasterEntity.TicketsMasters))]
        public virtual EmployeeMasterEntity AssignedToNavigation { get; set; }
        [ForeignKey(nameof(EngagementId))]
        [InverseProperty(nameof(EngagementMaster.TicketsMasters))]
        public virtual EngagementMaster Engagement { get; set; }
        [ForeignKey(nameof(PhaseId))]
        [InverseProperty(nameof(PhaseMaster.TicketsMasters))]
        public virtual PhaseMaster Phase { get; set; }
        [InverseProperty(nameof(TicketTimeSheet.Ticket))]
        public virtual ICollection<TicketTimeSheet> TicketTimeSheets { get; set; }
    }
}
