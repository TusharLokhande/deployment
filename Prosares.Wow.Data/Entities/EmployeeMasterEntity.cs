using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using static Prosares.Wow.Data.Services.Common.DropdownService.DropdownService;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("EmployeeMaster")]
    public partial class EmployeeMasterEntity : BaseEntity
    {
        public EmployeeMasterEntity()
        {
            AttendenceMasters = new HashSet<AttendenceMaster>();
            CapacityAllocations = new HashSet<CapacityAllocation>();
            EngagementLeadsMasters = new HashSet<EngagementLeadsMaster>();
            LeaveRequestsMasterApprovers = new HashSet<LeaveRequestsMaster>();
            LeaveRequestsMasterRequestors = new HashSet<LeaveRequestsMaster>();
            NotificationMasterFromEmpNavigations = new HashSet<NotificationMaster>();
            NotificationMasterToEmpNavigations = new HashSet<NotificationMaster>();
            TaskMasters = new HashSet<TaskMaster>();
            TicketsMasters = new HashSet<TicketsMaster>();
        }

        //[Key]
        //[Column("ID")]
        // public long Id { get; set; }
        [Column("EID")]
        public long Eid { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        [Column("CostCenterID")]
        public long CostCenterId { get; set; }
        [Column("WorkPolicyID")]
        public long WorkPolicyId { get; set; }
        public long TimeSheetPolicy { get; set; }

        public string CostCenter_Name { get; set; }
        public string PolicyName_Name { get; set; }
        public string TimeSheetPolicy_Name { get; set; }
        public string WorkPolicyName_Name { get; set; }
        public string RoleName { get; set; }
        public string ReportingManager { get; set; }

        public double Efficiency { get; set; }
        public string? Email { get; set; }
        public string LoginId { get; set; }
        public string Password { get; set; }
        public int? AvailableLeaveBalance { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }

        public string Location { get; set; }
        public string CurrentPassword { get; set; }

        public string? Url { get; set; }

        public long reportingManagerId { get; set; }

        public List<CommomDropdownDataType> employeeRole { get; set; }
        public bool FirstLogin { get; set; }
        public double LeaveBalance { get; set; }


        [ForeignKey(nameof(CostCenterId))]
        [InverseProperty("EmployeeMasters")]
        public virtual CostCenter CostCenter { get; set; }
        [ForeignKey(nameof(WorkPolicyId))]
        [InverseProperty(nameof(WorkPoliciesMaster.EmployeeMasters))]
        public virtual WorkPoliciesMaster WorkPolicy { get; set; }
        [InverseProperty(nameof(AttendenceMaster.Employee))]
        public virtual ICollection<AttendenceMaster> AttendenceMasters { get; set; }
        [InverseProperty(nameof(CapacityAllocation.Employee))]
        public virtual ICollection<CapacityAllocation> CapacityAllocations { get; set; }
        [InverseProperty(nameof(EngagementLeadsMaster.Employee))]
        public virtual ICollection<EngagementLeadsMaster> EngagementLeadsMasters { get; set; }
        [InverseProperty(nameof(LeaveRequestsMaster.Approver))]
        public virtual ICollection<LeaveRequestsMaster> LeaveRequestsMasterApprovers { get; set; }
        [InverseProperty(nameof(LeaveRequestsMaster.Requestor))]
        public virtual ICollection<LeaveRequestsMaster> LeaveRequestsMasterRequestors { get; set; }
        [InverseProperty(nameof(NotificationMaster.FromEmpNavigation))]
        public virtual ICollection<NotificationMaster> NotificationMasterFromEmpNavigations { get; set; }
        [InverseProperty(nameof(NotificationMaster.ToEmpNavigation))]
        public virtual ICollection<NotificationMaster> NotificationMasterToEmpNavigations { get; set; }
        [InverseProperty(nameof(TaskMaster.AssignedToNavigation))]
        public virtual ICollection<TaskMaster> TaskMasters { get; set; }
        [InverseProperty(nameof(TicketsMaster.AssignedToNavigation))]
        public virtual ICollection<TicketsMaster> TicketsMasters { get; set; }
    }
}
