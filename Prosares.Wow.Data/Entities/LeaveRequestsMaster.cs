using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using static Prosares.Wow.Data.Services.Common.DropdownService.DropdownService;

#nullable disable

namespace Prosares.Wow.Data.Entities
{
    [Table("LeaveRequestsMaster")]
    public partial class LeaveRequestsMaster : BaseEntity
    {
        //[Key]
        //[Column("ID")]
        //public long Id { get; set; }
        public long RequestorId { get; set; }
        public long? ApproverId { get; set; }
        [Column(TypeName = "date")]
        public DateTime FromDate { get; set; }
        public int FromDateLeaveType { get; set; }
        [Column(TypeName = "date")]
        public DateTime ToDate { get; set; }
        public int ToDateLeaveType { get; set; }
        public double LeaveDays { get; set; }
        public long ResonId { get; set; }

        public Boolean? IsPlanned { get; set; }

        //[Required]
        public string? Remark { get; set; }
        public string? ApproverName { get; set; }
        public string? RequesterName { get; set; }
        public string? LeavesReson { get; set; }
        public int RequestStatus { get; set; }
        public long LeaveType { get; set; }
        public string LeaveTypeName { get; set; }
        public string sortColumn { get; set; }
        public string sortDirection { get; set; }
        public int pageSize { get; set; }
        public int start { get; set; }
        public string searchText { get; set; }
        public long RoleId { get; set; }
        public List<CommomDropdownDataType> FYIUsersList { get; set; }
        public List<int> FYIUsersIntList { get; set; }
        public string? FYIUsers { get; set; }
        public string FYIUsersNames { get; set; }
        public long EmployeeId { get; set; }
        public string CreatedByName { get; set; }

        [ForeignKey(nameof(ApproverId))]
        [InverseProperty(nameof(EmployeeMasterEntity.LeaveRequestsMasterApprovers))]
        public virtual EmployeeMasterEntity Approver { get; set; }
        [ForeignKey(nameof(RequestorId))]
        [InverseProperty(nameof(EmployeeMasterEntity.LeaveRequestsMasterRequestors))]
        public virtual EmployeeMasterEntity Requestor { get; set; }
        [ForeignKey(nameof(ResonId))]
        [InverseProperty(nameof(LeavesResonMaster.LeaveRequestsMasters))]
        public virtual LeavesResonMaster Reson { get; set; }
    }
}
