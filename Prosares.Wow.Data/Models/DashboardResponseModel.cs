using Microsoft.EntityFrameworkCore;
using Prosares.Wow.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Models
{
    public class DashboardResponseModel : BaseEntity
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PhaseName { get; set; }
        public string ApplicationName { get; set; }
        public string Engagement { get; set; }
        public decimal HoursAssigned { get; set; }
        public decimal? HoursSpent { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime? ReportDate { get; set; }
        public DateTime? ResponedDate { get; set; }
        public DateTime? IncidentDate { get; set; }

        public string Remarks { get; set; }
        public int Status { get; set; }
        public long AssignedTo { get; set; }
        public int? Type { get; set; }
        public int? Priority { get; set; }
        public long? PreviousTicketId { get; set; }
        public string RType { get; set; }
        public int? TicketNatureOfIssue { get; set; }
        public decimal? TodayHoursSpent { get; set; }

        public DateTime TimesheetDateToBe { get; set; }
    }

    public class ManagerDashboardResponseModel
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PhaseName { get; set; }
        public string ApplicationName { get; set; }
        public string Engagement { get; set; }
        public decimal HoursAssigned { get; set; }
        public decimal? HoursSpent { get; set; }
        public decimal? TotalHoursSpent { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime? ReportDate { get; set; }
        public DateTime? ResponedDate { get; set; }
        public DateTime? IncidentDate { get; set; }
        public string Remarks { get; set; }
        public int Status { get; set; }
        public string StatusString { get; set; }
        public string AssignedTo { get; set; }
        public int? Type { get; set; }
        public int? Priority { get; set; }
        public long? PreviousTicketId { get; set; }
        public string RType { get; set; }
        public int? TicketNatureOfIssue { get; set; }
        public decimal? TodayHoursSpent { get; set; }
    }
    public class DashboardRequestModel
    {
        public int UserId { get; set; }
    }

}
