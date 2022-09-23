using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.WorkPolicy
{
    public class WorkPoliciesService :IWorkPoliciesService
    {

        #region Prop
        private readonly IRepository<Entities.WorkPoliciesMaster> _workPolicies;
        private readonly ILogger<WorkPoliciesService> _logger;
        #endregion

        #region Constructor
        public WorkPoliciesService(IRepository<Entities.WorkPoliciesMaster> WorkPoliciesMaster,
                        ILogger<WorkPoliciesService> logger)
        {
            _workPolicies = WorkPoliciesMaster;
            _logger = logger;
        }
        #endregion

        #region Methods
        public Entities.WorkPoliciesMaster GetWorkPoliciesMasterById(Entities.WorkPoliciesMaster value)
        {
            var workPoliciesMaster = _workPolicies.GetById(value.Id);

            return workPoliciesMaster;
        }
        public bool WorkPoliciesMasterExists(long id)
        {
            return _workPolicies.IsExist(id);
        }
        public WorkPoliciesMasterResponse GetWorkPoliciesMasterGridData(Entities.WorkPoliciesMaster value)
        {
            var data = new WorkPoliciesMasterResponse();

            Expression<Func<Entities.WorkPoliciesMaster, bool>> InitialCondition;
            Expression<Func<Entities.WorkPoliciesMaster, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.PolicyName.Contains(value.searchText);

            }
            else
            {
                SearchText = k => k.PolicyName != "";
            }

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _workPolicies.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.workPoliciesMasterData = _workPolicies.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _workPolicies.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.workPoliciesMasterData = _workPolicies.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _workPolicies.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.workPoliciesMasterData = _workPolicies.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            return data;
        }

        public bool CheckIfWorkPolicyExists(string PolicyName)
        {
            var data = _workPolicies.GetAll(b => b.Where(k => k.PolicyName == PolicyName)).ToList();
            if(data.Count > 0)
            {
                return true;
            }
            return false;
        }
        
        public dynamic InsertUpdateWorkPoliciesMasterData(Entities.WorkPoliciesMaster value)
        {
            Entities.WorkPoliciesMaster data = new Entities.WorkPoliciesMaster();

            data.Id = value.Id;

            if (data.Id == 0) // Insert in DB
            {
                data.PolicyName = value.PolicyName;
                data.ValidFrom = value.ValidFrom;
                data.ValidTill = value.ValidTill;
                data.IsActive = value.IsActive;
                data.WorkingDates = value.WorkingDates;
                data.HolidayDates = value.HolidayDates;

                data.Holiday1 = Convert.ToDateTime(value.HolidayDates[0]);
                data.Holiday2 = Convert.ToDateTime(value.HolidayDates[1]);
                data.Holiday3 = Convert.ToDateTime(value.HolidayDates[2]);
                data.Holiday4 = Convert.ToDateTime(value.HolidayDates[3]);
                data.Holiday5 = Convert.ToDateTime(value.HolidayDates[4]);
                data.Holiday6 = Convert.ToDateTime(value.HolidayDates[5]);
                data.Holiday7 = Convert.ToDateTime(value.HolidayDates[6]);
                data.Holiday8 = Convert.ToDateTime(value.HolidayDates[7]);
                data.Holiday9 = Convert.ToDateTime(value.HolidayDates[8]);

                if (value.HolidayDates.Count > 9)
                {
                    data.Holiday10 = Convert.ToDateTime(value.HolidayDates[9]);

                }

                if (value.HolidayDates.Count > 10)
                {
                    data.Holiday11 = Convert.ToDateTime(value.HolidayDates[10]);

                }

                data.WorkingDay1 = (value.WorkingDates[0].value);
                data.WorkingDay2 = (value.WorkingDates[1].value);
                data.WorkingDay3 = (value.WorkingDates[2].value);
                data.WorkingDay4 = (value.WorkingDates[3].value);
                data.WorkingDay5 = (value.WorkingDates[4].value);



                if (value.WorkingDates.Count > 5)
                {
                    data.WorkingDay6 = (value.WorkingDates[5].value);
                }



                Entities.WorkPoliciesMaster response = _workPolicies.InsertAndGet(data);
                return response.Id;
            }

            // Update in DB
            var workPoliciesMaster = _workPolicies.GetById(value.Id);
            workPoliciesMaster.PolicyName = value.PolicyName;
            workPoliciesMaster.ValidFrom = value.ValidFrom;
            workPoliciesMaster.ValidTill = value.ValidTill;
            workPoliciesMaster.IsActive = value.IsActive;
            workPoliciesMaster.ModifiedDate = DateTime.UtcNow;

            workPoliciesMaster.Holiday1 = Convert.ToDateTime(value.HolidayDates[0]);
            workPoliciesMaster.Holiday2 = Convert.ToDateTime(value.HolidayDates[1]);
            workPoliciesMaster.Holiday3 = Convert.ToDateTime(value.HolidayDates[2]);
            workPoliciesMaster.Holiday4 = Convert.ToDateTime(value.HolidayDates[3]);
            workPoliciesMaster.Holiday5 = Convert.ToDateTime(value.HolidayDates[4]);
            workPoliciesMaster.Holiday6 = Convert.ToDateTime(value.HolidayDates[5]);
            workPoliciesMaster.Holiday7 = Convert.ToDateTime(value.HolidayDates[6]);
            workPoliciesMaster.Holiday8 = Convert.ToDateTime(value.HolidayDates[7]);
            workPoliciesMaster.Holiday9 = Convert.ToDateTime(value.HolidayDates[8]);

            if (value.HolidayDates.Count > 9)
            {
                workPoliciesMaster.Holiday10 = Convert.ToDateTime(value.HolidayDates[9]);
            }
            else
            {
                workPoliciesMaster.Holiday10 = null;
            }

            if (value.HolidayDates.Count > 10)
            {
                workPoliciesMaster.Holiday11 = Convert.ToDateTime(value.HolidayDates[10]);

            }
            else
            {
                workPoliciesMaster.Holiday11 = null;
            }



            workPoliciesMaster.WorkingDay1 = (value.WorkingDates[0].value);
            workPoliciesMaster.WorkingDay2 = (value.WorkingDates[1].value);
            workPoliciesMaster.WorkingDay3 = (value.WorkingDates[2].value);
            workPoliciesMaster.WorkingDay4 = (value.WorkingDates[3].value);
            workPoliciesMaster.WorkingDay5 = (value.WorkingDates[4].value);



            if (value.WorkingDates.Count > 5)
            {
                workPoliciesMaster.WorkingDay6 = (value.WorkingDates[5].value);
            }
            else
            {
                workPoliciesMaster.WorkingDay6 = null;
            }

            _workPolicies.Update(workPoliciesMaster);
            return workPoliciesMaster.Id;
        }

        public dynamic getWorkPolicyHolidayList(WorkPolicyRequestModel value)
        {
            List<DateTime?> HolidayList = new List<DateTime?>();
            var data = _workPolicies.GetAll(b => b.Where(k => k.Id == value.WorkPolicyId && k.IsActive == true)).ToList();

            foreach (var item in data)
            {
                    HolidayList.Add(item.Holiday1);
                    HolidayList.Add(item.Holiday2);
                    HolidayList.Add(item.Holiday3);
                    HolidayList.Add(item.Holiday4);
                    HolidayList.Add(item.Holiday5);
                    HolidayList.Add(item.Holiday6);
                    HolidayList.Add(item.Holiday7);
                    HolidayList.Add(item.Holiday8);
                    HolidayList.Add(item.Holiday9);
                    HolidayList.Add(item.Holiday10);
                    HolidayList.Add(item.Holiday11);
                
            }

            return HolidayList;
        }

        public dynamic getWorkPolicyWorkdayList(WorkPolicyRequestModel value)
        {
            List<string?> WorkdayList = new List<string?>();
            var data = _workPolicies.GetAll(b => b.Where(k => k.Id == value.WorkPolicyId && k.IsActive == true)).ToList();

            foreach (var item in data)
            {
                WorkdayList.Add(item.WorkingDay1);
                WorkdayList.Add(item.WorkingDay2);
                WorkdayList.Add(item.WorkingDay3);
                WorkdayList.Add(item.WorkingDay4);
                WorkdayList.Add(item.WorkingDay5);
                WorkdayList.Add(item.WorkingDay6);

            }

            return WorkdayList;
        }

        /// <summary>
        /// WorkPolicyExportToExcel -- This method is for Export the data into Excel
        /// </summary>
        /// <param name= "SearchText" name="sortColumn" name="sortDirection"></param>
        /// <returns> This method returns the data of Customer table </returns>
        public List<WorkPoliciesMaster> WorkPolicyExportToExcel(string SearchText, string sortColumn, string sortDirection)
        {
            SqlCommand command = new SqlCommand("stpWorkPoliciesForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@SearchText", SqlDbType.VarChar).Value = SearchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection;
            var data = _workPolicies.GetRecords(command).ToList();

            return data;
        }

        #endregion

        #region Models
        public class WorkPoliciesMasterResponse
        {
            public int count { get; set; }
            public List<Entities.WorkPoliciesMaster> workPoliciesMasterData { get; set; }
        }

        public class WorkPolicyRequestModel
        {
            public long WorkPolicyId { get; set; }
        }

        #endregion
    }
}
