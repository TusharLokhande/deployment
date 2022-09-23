using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Task
{
    public class TaskService : ITaskService
    {
        #region Prop
        private readonly IRepository<Entities.TaskMaster> _taskMasterRepository;

        private readonly TaskService _taskService;
        private readonly SqlDbContext _context;
        #endregion

        #region Constructor
        public TaskService(IRepository<Entities.TaskMaster> taskMasterRepository, SqlDbContext context)
        {
            _taskMasterRepository = taskMasterRepository;
            _context = context;
        }
        #endregion


        #region Methods
        public void InsertIntoTaskMaster(Entities.TaskMaster value)
        {
            try
            {
                if (value.Id == 0)
                {
                    // value.CreatedDate = DateTime.Now;
                    value.IsActive = true;
                    _taskMasterRepository.Insert(value);
                }
                else
                {
                    //value.CreatedDate = DateTime.Now;
                    value.IsActive = true;
                    _taskMasterRepository.Update(value);
                }

            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public dynamic AutoPopulateMandaysFields(AutoPopulateRequestModel value)
        {
            try
            {
                string sqlQuery;

                List<SqlParameter> sqlParameters = new List<SqlParameter>
                {
                    new SqlParameter("@EngagementId", value.EngagementId),
                    new SqlParameter("@FromDate", value.FromDate),
                    new SqlParameter("@ToDate", value.ToDate)
                };

                sqlQuery = "spGetAutoPopulatedEngagementData @EngagementId, @FromDate ,@ToDate";

                var Data = _context.AutoPopulateResponseSet.FromSqlRaw(sqlQuery, sqlParameters.ToArray()).ToList();

                return Data[0];
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        public dynamic AutoPopulateAssignedHoursFields(AutoPopulateAssignedHoursRequestModel value)
        {
            try
            {
                string sqlQuery;

                List<SqlParameter> sqlParameters = new List<SqlParameter>
                {
                    new SqlParameter("@EngagementId", value.EngagementId),
                    new SqlParameter("@EmployeeId", value.EmployeeId),
                    new SqlParameter("@FromDate", value.FromDate),
                    new SqlParameter("@ToDate", value.ToDate)

                };

                sqlQuery = "spGetAutoPopulatedAssignedHoursData @EngagementId, @EmployeeId, @FromDate, @ToDate";

                var Data = _context.AutoPopulateAssignedHoursResponseSet.FromSqlRaw(sqlQuery, sqlParameters.ToArray()).ToList();

                return Data[0];
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #endregion
    }
}
