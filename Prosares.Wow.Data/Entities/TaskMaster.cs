using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("TaskMaster")]
    [Index(nameof(TaskUid), Name = "UQ__TaskMast__65DA9A84F963371B", IsUnique = true)]
    public partial class TaskMaster : BaseEntity
    {
        public TaskMaster()
        {
            TasksTimeSheets = new HashSet<TasksTimeSheet>();
        }

        [Key]
        [Column("ID")]
        public long Id { get; set; }
        [Required]
        [Column("TaskUID")]
        [StringLength(50)]
        public string TaskUid { get; set; }
        [Column("EngagementID")]
        public long EngagementId { get; set; }
        [Column("PhaseID")]
        public long? PhaseId { get; set; }
        [Column("ApplicationID")]
        public long? ApplicationId { get; set; }
        [Column("RequirementID")]
        public long? RequirementId { get; set; }
        [Required]
        [StringLength(1000)]
        public string TaskTitle { get; set; }
        [Required]
        public string TaskDescription { get; set; }
        public long AssignedTo { get; set; }
        [Column(TypeName = "date")]
        public DateTime PlannedStartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime PlannedEndDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ActualStartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ActualEndDate { get; set; }
        public decimal HoursAssigned { get; set; }
        public decimal? HoursSpent { get; set; }
        public int TaskStatus { get; set; }
        public bool IsChargeable { get; set; }
        public string? NoChargesReason { get; set; }
        public string Remarks { get; set; }
        public decimal? TodayHoursSpent { get; set; }

        public string? PhaseString { get; set; }

        public string? ApplicationString { get; set; }

        public string? AssignedToString { get; set; }
        public string? EngagementString { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }
        public string Customer { get; set; }
        public string CreatedByString { get; set; }

        public string StatusString { get; set; }

        public string? EngagementTypeString { get; set; }

        [ForeignKey(nameof(ApplicationId))]
        [InverseProperty(nameof(ApplicationsMaster.TaskMasters))]
        public virtual ApplicationsMaster Application { get; set; }
        [ForeignKey(nameof(AssignedTo))]
        [InverseProperty(nameof(EmployeeMasterEntity.TaskMasters))]
        public virtual EmployeeMasterEntity AssignedToNavigation { get; set; }
        [ForeignKey(nameof(EngagementId))]
        [InverseProperty(nameof(EngagementMaster.TaskMasters))]
        public virtual EngagementMaster Engagement { get; set; }
        [ForeignKey(nameof(PhaseId))]
        [InverseProperty(nameof(PhaseMaster.TaskMasters))]
        public virtual PhaseMaster Phase { get; set; }
        [InverseProperty(nameof(TasksTimeSheet.Task))]
        public virtual ICollection<TasksTimeSheet> TasksTimeSheets { get; set; }
    }
}
