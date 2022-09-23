using Microsoft.Data.SqlClient;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Calendar
{
    public class CalendarService : ICalendarService
    {

        #region Fields

        private readonly IRepository<EmployeeMasterEntity> _employeeMaster;
        private readonly IRepository<EmployeeCalendar> _employeeCalendar;
        private readonly IRepository<WorkPoliciesMaster> _workPolicyMaster;
        private readonly IRepository<CalenderResponseModel> _calenderResponseModel;


        #endregion

        #region Constructor

        public CalendarService(IRepository<EmployeeMasterEntity> employeeMaster,
            IRepository<EmployeeCalendar> employeeCalendar,
            IRepository<WorkPoliciesMaster> workPolicyMaster,
            IRepository<CalenderResponseModel> calenderResponseModel)
        {
            _calenderResponseModel = calenderResponseModel;
            _employeeCalendar = employeeCalendar;
            _employeeMaster = employeeMaster;
            _workPolicyMaster = workPolicyMaster;
        }

        #endregion

        #region Methods
        public dynamic getCalendarData(calendarRequestMode value)
        {
            try
            {
                //dynamic data;
                SqlCommand command = new SqlCommand("spGetCalendarDataForUser");
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add("@EmployeeId", SqlDbType.BigInt).Value = value.EmployeeId;
                command.Parameters.Add("@Month", SqlDbType.BigInt).Value = value.Month;
                command.Parameters.Add("@Year", SqlDbType.BigInt).Value = value.Year;
                var calenderResponse = _calenderResponseModel.GetRecords(command);
                return calenderResponse;
                //string currentDateMonthString = value.Date.ToString("MMM");
                //data = (from ec in _employeeCalendar.Table
                //        join em in _employeeMaster.Table on ec.EmployeeId equals em.Id
                //        select new
                //        {
                //            Date = ec.Date,
                //            Status = (ec.TotalHoursSpent >= 8.5M ? "full" : (ec.TotalHoursSpent == 0 ? "notfilled" : (ec.TotalHoursSpent < 8.5M ? "half" : ""))),
                //            EmployeeId = em.Id,
                //        }
                //        ).Where(k => k.EmployeeId == value.EmployeeId).ToList();
                //return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion

        public class calendarRequestMode
        {
            public int EmployeeId { get; set; }
            public int Month { get; set; }
            public int Year { get; set; }
        }
    }
}
