using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;


namespace Prosares.Wow.Data.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        #region Prop
        private readonly IRepository<Entities.TaskMaster> _taskMaster;
        private readonly IRepository<Entities.TicketsMaster> _ticketMaster;
        private readonly IRepository<Entities.EngagementMaster> _engagementMaster;
        private readonly IRepository<Entities.PhaseMaster> _phaseMaster;
        private readonly IRepository<Entities.ApplicationsMaster> _applicationMaster;
        private readonly IRepository<Entities.TasksTimeSheet> _tasksTimeSheet;
        private readonly IRepository<Entities.TicketTimeSheet> _ticketTimeSheet;
        private readonly ILogger<DashboardService> _logger;

        private readonly IRepository<DashboardResponseModel> _dashboardResponseModel;
        private readonly SqlDbContext _context;
        #endregion

        #region constructor
        public DashboardService(IRepository<TaskMaster> taskMaster, IRepository<Entities.TicketsMaster> ticketMaster, IRepository<Entities.EngagementMaster> engagementMaster, IRepository<Entities.PhaseMaster> phaseMaster, IRepository<Entities.ApplicationsMaster> applicationMaster, ILogger<DashboardService> logger, SqlDbContext context, IRepository<TasksTimeSheet> tasksTimeSheet, IRepository<TicketTimeSheet> ticketTimeSheet,
        IRepository<DashboardResponseModel> dashboardResponseModel)
        {
            _taskMaster = taskMaster;
            _ticketMaster = ticketMaster;
            _engagementMaster = engagementMaster;
            _phaseMaster = phaseMaster;
            _applicationMaster = applicationMaster;
            _logger = logger;
            _context = context;
            _tasksTimeSheet = tasksTimeSheet;
            _ticketTimeSheet = ticketTimeSheet;
            _dashboardResponseModel = dashboardResponseModel;
        }

        #endregion

        #region methods
        public dynamic GetDashboardData(DashboardRequestModel value)
        {

            SqlCommand command = new SqlCommand("spGetDashBoardData");
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@UserID", SqlDbType.BigInt).Value = value.UserId;
            var Data = _dashboardResponseModel.GetRecords(command);
            return Data;

        }

        public dynamic InsertUpdateDashboardData(DashboardResponseModel value)
        {
            //TimeSpan start = TimeSpan.Parse("00:00"); // 12 AM 
            //TimeSpan end = TimeSpan.Parse("06:00"); // 06 AM
            //TimeSpan now = DateTime.Now.TimeOfDay;

            //DateTime dateTobe = DateTime.Now;  // will give you today's date

            //if ((now >= start) && (now <= end))
            //{
            //    dateTobe = dateTobe.Date.AddDays(-1); // will give yesterday date
            //}

            if (value.RType == "Task") // insert and update Task
            {
                // Update in DB
                TaskMaster taskMaster = _taskMaster.GetById(value.Id);

                taskMaster.TodayHoursSpent = (taskMaster.TodayHoursSpent == null) ? 0 + value.TodayHoursSpent : (decimal)(taskMaster.TodayHoursSpent + value.TodayHoursSpent);
                taskMaster.TaskStatus = value.Status;
                taskMaster.ActualStartDate = value.ActualStartDate;
                taskMaster.ActualEndDate = value.ActualEndDate;
                taskMaster.Remarks = value.Remarks;

                _taskMaster.Update(taskMaster);

                // Insert in TimeSheet
                TasksTimeSheet tasksTimeSheet = new TasksTimeSheet();

                tasksTimeSheet.TaskId = taskMaster.Id;
                tasksTimeSheet.TimeSheetDate = value.TimesheetDateToBe; // date as per 6AM logic
                tasksTimeSheet.HoursSpend = (value.TodayHoursSpent == null) ? 0 : (decimal)value.TodayHoursSpent;
                tasksTimeSheet.TaskStatus = (int)value.Status;
                tasksTimeSheet.Remark = value.Remarks;
                tasksTimeSheet.IsActive = true;
                tasksTimeSheet.CreatedBy = value.AssignedTo;
                tasksTimeSheet.CreatedDate = DateTime.UtcNow;

                var result = _tasksTimeSheet.InsertAndGet(tasksTimeSheet);

                return result.Id;

            }
            else
            {
                // Update in DB
                TicketsMaster ticketMaster = _ticketMaster.GetById(value.Id);

                ticketMaster.TodayHoursSpent = (ticketMaster.TodayHoursSpent == null) ? 0 + value.TodayHoursSpent : (decimal)(ticketMaster.TodayHoursSpent + value.TodayHoursSpent);
                ticketMaster.TicketStatus = value.Status;
                ticketMaster.TicketNatureOfIssue = value.TicketNatureOfIssue;
                ticketMaster.ResponedDate = value.ResponedDate;
                ticketMaster.ActualEndDate = value.ActualEndDate;
                ticketMaster.Remarks = value.Remarks;

                _ticketMaster.Update(ticketMaster);

                // Insert in TimeSheet
                TicketTimeSheet ticketTimeSheet = new TicketTimeSheet();

                ticketTimeSheet.TicketId = ticketMaster.Id;
                ticketTimeSheet.TimeSheetDate = value.TimesheetDateToBe; // date as per 6AM logic
                ticketTimeSheet.HoursSpend = (value.TodayHoursSpent == null) ? 0 : (decimal)value.TodayHoursSpent;
                ticketTimeSheet.TicketStatus = (int)value.Status;
                ticketTimeSheet.Remark = value.Remarks;
                ticketTimeSheet.IsActive = true;
                ticketTimeSheet.CreatedBy = value.AssignedTo;
                ticketTimeSheet.CreatedDate = DateTime.UtcNow;

                var result = _ticketTimeSheet.InsertAndGet(ticketTimeSheet);

                return result.Id;
            }

        }

        //public dynamic sendMailAfterTaskTicketClose(DashboardResponseModel value) 
        //{
        //    try
        //    {
        //        SendMailModel MailDetails = new SendMailModel();
        //        EmailTemplate template = new EmailTemplate();


        //        string TempBody = "<p>Dear Sir/ Madam,</p> \r\n <p>Here are your login details for the portal.</p>\r\n \r\n <p> Login Id: " + newEmployee.LoginId + "</p> \r\n <p> Password: " + newEmployee.Password + "</p><p>Thanks &amp; Regards,</p>";
        //        string TempSub = "Login Details";
        //        template.Body = TempBody;
        //        template.Subject = TempSub;

        //        string TemplateBody = template.Body;
        //        string TemplateSubject = template.Subject;
        //        StringBuilder sbTemplateBody = new StringBuilder(TemplateBody);
        //        StringBuilder sbTemplateSubject = new StringBuilder(TemplateSubject);

        //        //MailDetails.Subject = sbTemplateSubject.ToString();
        //        MailDetails.To = newEmployee.LoginId;  //mail

        //        MailDetails.Body = sbTemplateBody.ToString();
        //        MailDetails.Subject = sbTemplateSubject.ToString();
        //        var returnValue = _mailService.SendMail(MailDetails);
        //    }
        //    catch (err) 
        //    {
        //        throw err;
        //    }
        //}
        #endregion

    }

}
