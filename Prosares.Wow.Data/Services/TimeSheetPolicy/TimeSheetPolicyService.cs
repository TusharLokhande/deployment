using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Prosares.Wow.Data.Entities;
using static Prosares.Wow.Data.Services.Customers.CustomerService;
using System.Linq.Expressions;
using Prosares.Wow.Data.Helpers;
using Microsoft.Data.SqlClient;
using System.Data;

namespace Prosares.Wow.Data.Services.TimeSheetPolicy
{
    public  class TimeSheetPolicyService : ITimeSheetPolicyService
    {

        #region Fields
        private readonly IRepository<TimesheetPolicy> _timeSheet;
        #endregion



        #region Constructor
        public TimeSheetPolicyService(IRepository<TimesheetPolicy> timeSheet)
        {
            _timeSheet = timeSheet;
        }

        #endregion


        #region Methods
        public dynamic GetTimeSheetPolicy(Entities.TimesheetPolicy value)
        {
            var data = new TimesheetPolicyResponse();

            Expression<Func<Entities.TimesheetPolicy, bool>> InitialCondition;
            Expression<Func<Entities.TimesheetPolicy, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.Name.Contains(value.searchText);


            }
            else
            {
                SearchText = k => k.Name != "";
            }

            if (value.sortColumn == null || value.sortDirection == "")
            {
                data.count = _timeSheet.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.data = _timeSheet.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("name")).Skip(value.start).Take(value.pageSize).ToList();
            }

            else if (value.sortDirection == "desc")
            {
                data.count = _timeSheet.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.data = _timeSheet.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();

            }
            else if (value.sortDirection == "asc")
            {
                data.count = _timeSheet.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.data = _timeSheet.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();

            }
  
            return data;
        }


        public dynamic GetTimeSheetPolicyById(Entities.TimesheetPolicy value)
        {
            var data = _timeSheet.GetById(value.Id);
            return data;
        }

        public dynamic InsertUpdateTimesheet(TimesheetPolicy value)
        {
            try
            {
                if(value.Id  == 0) //Insert 
                {
                    bool checkDuplicate = _timeSheet.Table.Any(k => k.Name == value.Name);
                    if (checkDuplicate)
                    {
                        return false;
                    }
                    _timeSheet.Insert(value);
                    return true;
                }
                else // update
                {
                    bool checkDuplicate =  _timeSheet.Table.Any(k => k.Id != value.Id && k.Name == value.Name);
                    if (checkDuplicate)
                    {
                        return false;
                    }
                    _timeSheet.Update(value);
                    return true;
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        public List<TimesheetPolicy> TimesheetPolicyExportToExcel()
        {
            SqlCommand command = new SqlCommand("stpTimesheetForExportToExcel");
            var data = _timeSheet.GetRecords(command).ToList();

            return data;
        }

        public List<TimesheetPolicy> TimesheetPolicyExportToExcel(string SearchText, string sortColumn, string sortDirection)
        {
            SqlCommand command = new SqlCommand("stpTimesheetForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@searchText", SqlDbType.VarChar).Value = SearchText == null ? "" : SearchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = sortColumn == null ? "" : sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection == null ? "" : sortDirection;
            var data = _timeSheet.GetRecords(command).ToList();

            return data;
        }

        #endregion
    }

    public class TimesheetPolicyResponse
    {
        public long count { get; set; }
        public dynamic data { get; set; }
    }
}
