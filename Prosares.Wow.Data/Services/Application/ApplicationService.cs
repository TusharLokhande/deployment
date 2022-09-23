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

namespace Prosares.Wow.Data.Services.Application
{
    public class ApplicationService : IApplicationService   
    {
        #region Prop
        private readonly IRepository<ApplicationsMaster> _applicationMaster;
        private readonly IRepository<Entities.EngagementMaster> _engagementMaster;
        private readonly ILogger<ApplicationService> _logger;
        #endregion

        #region Constructor
        public ApplicationService(IRepository<ApplicationsMaster> applicationMaster, 
        IRepository<Entities.EngagementMaster> engagementMaster,ILogger<ApplicationService> logger)
        {
            _applicationMaster = applicationMaster;
            _engagementMaster= engagementMaster;

            _logger = logger;
        }
        #endregion

        #region Methods

        public ApplicationMasterResponse GetApplicationMasterGridData(ApplicationsMaster value)
        {
            var data = new ApplicationMasterResponse();

            Expression<Func<Entities.ApplicationsMaster, bool>> InitialCondition;
            Expression<Func<Entities.ApplicationsMaster, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.Application.Contains(value.searchText);

            }
            else
            {
                SearchText = k => k.Application != "";
            }

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _applicationMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.applicationData = _applicationMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _applicationMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.applicationData = _applicationMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _applicationMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.applicationData = _applicationMaster.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            foreach (var item in data.applicationData)
            {
                item.EngagementName = _engagementMaster.Table.Where(b => b.Id == item.EngagementId).Select(s => s.Engagement).FirstOrDefault();
            }

            return data;
        }

        public bool CheckIfApplicationExists(string Application)
        {
            var data = _applicationMaster.GetAll(b => b.Where(k => k.IsActive == true && k.Application == Application)).ToList();
            if(data.Count > 0)
            {
                return true;
            }
            return false;
        }
        public dynamic InsertUpdateApplicationMasterData(Entities.ApplicationsMaster value)
        {
            ApplicationsMaster data = new ApplicationsMaster();

            data.Id = value.Id;

            if (data.Id == 0) // Insert in DB
            {
                
                data.Application = value.Application;
                data.EngagementId= value.EngagementId;
                data.IsActive = value.IsActive;
                ApplicationsMaster response = _applicationMaster.InsertAndGet(data);
                return response.Id;
            }

            // Update in DB
            var applicationData = _applicationMaster.GetById(value.Id);
            applicationData.Application = value.Application;
            applicationData.EngagementId = value.EngagementId;            
            applicationData.IsActive = value.IsActive;
            _applicationMaster.Update(applicationData);
            return applicationData.Id;

        }

        public dynamic GeApplicationMasterById(ApplicationsMaster value) //ApplicationMaster
        {
            var applicationMaster = _applicationMaster.GetById(value.Id);

             var response = (from am in _applicationMaster.Table
                             join eng in _engagementMaster.Table on am.EngagementId equals eng.Id                            
                        select new {
                            Application = am.Application,
                            EngagementID = am.EngagementId,
                            Engagement = eng.Engagement,                            
                            ID = am.Id,
                            isActive = am.IsActive
                                   
            }).Where(k=>k.ID==value.Id);
            return response;            
        }

        /// <summary>
        /// ApplicationExportToExcel -- This method is for Export the data into Excel
        /// </summary>
        /// <param name= "SearchText" name="sortColumn" name="sortDirection"></param>
        /// <returns> This method returns the data of ApplicationMaster table </returns>
        public List<ApplicationsMaster> ApplicationExportToExcel(string SearchText, string sortColumn, string sortDirection)
        {
            SqlCommand command = new SqlCommand("stpAplicationMasterForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@searchText", SqlDbType.VarChar).Value = SearchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = sortDirection;
            var data = _applicationMaster.GetRecords(command).ToList();
            return data;
        }
        #endregion

        #region Models

        public class ApplicationMasterResponse
        {
            public int count { get; set; }
            public List<Entities.ApplicationsMaster> applicationData { get; set; }
        }
        #endregion
    }
}
