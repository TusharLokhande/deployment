using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.ManagerDashboard
{
    public class ManagerDashboardService : IManagerDashboardService
    {
        private readonly SqlDbContext _context;

        private readonly IRepository<Entities.EngagementMaster> _engagementMaster;

        private readonly IRepository<PhaseMaster> _phaseMaster;


        private readonly IRepository<CapacityAllocation> _capacityAllocation;

        private readonly IRepository<ApplicationsMaster> _applicationsMaster;

        private readonly IRepository<TaskMaster> _taskMaster;

        private readonly IRepository<TicketsMaster> _ticketMaster;

        private readonly IRepository<ApplicationAndPhaseResponse> _applicationAndPhaseResponseMaster;

        public ManagerDashboardService(SqlDbContext context, IRepository<TaskMaster> taskMaster,
            IRepository<TicketsMaster> ticketMaster,
            IRepository<Entities.EngagementMaster> engagementMaster,
            IRepository<PhaseMaster> phaseMaster,
            IRepository<CapacityAllocation> capacityAllocation,
            IRepository<ApplicationsMaster> applicationsMaster,
            IRepository<ApplicationAndPhaseResponse> applicationAndPhaseResponseMaster)
        {
            _context = context;
            _taskMaster = taskMaster;
            _ticketMaster = ticketMaster;
            _engagementMaster = engagementMaster;
            _phaseMaster = phaseMaster;
            _capacityAllocation = capacityAllocation;
            _applicationsMaster = applicationsMaster;
            _applicationAndPhaseResponseMaster = applicationAndPhaseResponseMaster;
        }

        public dynamic GetManagerDashboardData(ManagerDashboardModel value)
        {
            //string sqlQuery;

            //List<SqlParameter> sqlParameters = new List<SqlParameter>
            //{
            //    new SqlParameter("@Emanager", value.Emanager),
            //    new SqlParameter("@UserId", value.UserId),
            //    new SqlParameter("@Type", value.Type),
            //    new SqlParameter("@StartPage", value.StartPage),
            //    new SqlParameter("@PageSize", value.PageSize),
            //    new SqlParameter("@OrderByColumn", value.OrderByColumn)
            //};

            //sqlQuery = "spGetManagerDashboardData @Emanager, @UserId, @Type, @StartPage, @PageSize ,@OrderByColumn";

            //var Data = _context.ManagerDashboardDbSet.FromSqlRaw(sqlQuery, sqlParameters.ToArray()).ToList();

            //return Data;

            //try
            //{
            //    SqlCommand command = new SqlCommand("stpGetAllLeaveRequests");
            //    command.CommandType = CommandType.StoredProcedure;
            //    var leaveRequestMasterData = _leaveRequest.GetRecords(command);
            //    return leaveRequestMasterData;
            //}
            //catch (Exception ex)
            //{
            //    throw;
            //}

            var data = new ManagerDashboardModelResponse();
            //ENF


            Expression<Func<Entities.TaskMaster, bool>> InitialCondition;

            Expression<Func<Entities.TaskMaster, bool>> EngagementCondition;

            Expression<Func<Entities.TaskMaster, bool>> SearchText;

            Expression<Func<Entities.TaskMaster, bool>> DateCondition;

            Expression<Func<Entities.TaskMaster, bool>> MemberCondition;

            Expression<Func<Entities.TaskMaster, bool>> StatusCondition;



            InitialCondition = k => k.Id != 0;



            if (value.searchText != null)
            {
                SearchText = k => k.TaskTitle.Contains(value.searchText);
            }
            else
            {
                SearchText = k => k.TaskTitle != "";
            }

            if (value.FromDate.HasValue && !value.ToDate.HasValue)
            {
                DateCondition = k => k.CreatedDate >= value.FromDate;
            }
            else if (!value.FromDate.HasValue && value.ToDate.HasValue)
            {
                DateCondition = k => k.CreatedDate <= value.ToDate;
            }
            else if (value.FromDate.HasValue && value.ToDate.HasValue)
            {
                DateCondition = k => k.CreatedDate <= value.ToDate && k.CreatedDate >= value.FromDate;
            }
            else
            {
                DateCondition = k => k.CreatedDate != null;
            }

            //Task Status Condition
            if (value.Status != 0) { 
            StatusCondition = k => k.TaskStatus == value.Status;
            }
            else
            {
                StatusCondition = k => k.TaskStatus != 5; //dont show completed task by default
            }

            //for Ticket

            Expression<Func<Entities.TicketsMaster, bool>> TicketInitialCondition;

            Expression<Func<Entities.TicketsMaster, bool>> TicketEngagementCondition;

            Expression<Func<Entities.TicketsMaster, bool>> TicketSearchText;

            Expression<Func<Entities.TicketsMaster, bool>> TicketDateCondition;

            Expression<Func<Entities.TicketsMaster, bool>> TicketMemberCondition;

            Expression<Func<Entities.TicketsMaster, bool>> TicketStatusCondition;


            TicketInitialCondition = k => k.Id != 0;


            if (value.searchText != null)
            {
                TicketSearchText = k => k.TicketTitle.Contains(value.searchText);
            }
            else
            {
                TicketSearchText = k => k.TaskTitle != "";
            }

            //Date for Ticket
            if (value.FromDate.HasValue && !value.ToDate.HasValue)
            {
                TicketDateCondition = k => k.CreatedDate >= value.FromDate;
            }
            else if (!value.FromDate.HasValue && value.ToDate.HasValue)
            {
                TicketDateCondition = k => k.CreatedDate <= value.ToDate;
            }
            else if (value.FromDate.HasValue && value.ToDate.HasValue)
            {
                TicketDateCondition = k => k.CreatedDate <= value.ToDate && k.CreatedDate >= value.FromDate;
            }
            else
            {
                TicketDateCondition = k => k.CreatedDate != null;
            }

            //Ticket Status Condition
            if (value.Status != 0)
            {
                TicketStatusCondition = k => k.TicketStatus == value.Status;
            }
            else
            {
                TicketStatusCondition = k => k.TicketStatus != 10; //dont show resolved ticket by default
            }



            if (value.Role == 1)  //emanager
            {
                if (value.Type == "task")
                {   

                    if (value.Engagement != null)
                    {
                        if (value.Engagement.Length > 0)
                        {
                            List<long> EngagementArray = new List<long>();

                            foreach (var eng in value.Engagement)
                            {
                                EngagementArray.Add(eng.value);
                            }

                            EngagementCondition = k => EngagementArray.Contains((long)k.EngagementId);
                        }
                        else
                        {
                            var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                            long[] engagementList = engagementEmployeeMappingData.ToArray();

                            List<long> arr = engagementList.OfType<long>().ToList();
                            EngagementCondition = k => arr.Contains((long)k.EngagementId);
                            //EngagementCondition = k => k.EngagementId != 0;
                        }
                    }
                    else
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        List<long> arr = engagementList.OfType<long>().ToList();
                        EngagementCondition = k => arr.Contains((long)k.EngagementId);


                    }


                    if (value.sortColumn == "" || value.sortDirection == "")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending("createdDate")).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {

                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }

                    }
                    else if (value.sortDirection == "desc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending(value.sortColumn)).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else {

                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }


                    }
                    else if (value.sortDirection == "asc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByProperty(value.sortColumn)).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                      

                    }

                }
                else
                {
                    if (value.Engagement != null)
                    {
                        if (value.Engagement.Length > 0)
                        {
                            List<long> EngagementArray = new List<long>();

                            foreach (var eng in value.Engagement)
                            {
                                EngagementArray.Add(eng.value);
                            }

                            TicketEngagementCondition = k => EngagementArray.Contains((long)k.EngagementId);
                        }
                        else
                        {
                            var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                            long[] engagementList = engagementEmployeeMappingData.ToArray();

                            List<long> arr = engagementList.OfType<long>().ToList();
                            TicketEngagementCondition = k => arr.Contains((long)k.EngagementId);
                            //TicketEngagementCondition = k => k.EngagementId != 0;
                        }
                    }
                    else
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        List<long> arr = engagementList.OfType<long>().ToList();
                        TicketEngagementCondition = k => arr.Contains((long)k.EngagementId);


                    }


                    if (value.sortColumn == "" || value.sortDirection == "")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending("createdDate")).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }



                    }
                    else if (value.sortDirection == "desc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending(value.sortColumn)).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                      

                    }
                    else if (value.sortDirection == "asc")
                    {

                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByProperty(value.sortColumn)).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                       

                    }
                }

            }
            else if (value.Role == 2)//For Manager
            {

                if (value.Type == "task")
                {

                    if (value.Engagement != null)
                    {
                        if (value.Engagement.Length > 0)
                        {
                            List<long> EngagementArray = new List<long>();

                            foreach (var eng in value.Engagement)
                            {
                                EngagementArray.Add(eng.value);
                            }
                            //   List<long> arr = value.Engagement.OfType<long>().ToList();
                            EngagementCondition = k => EngagementArray.Contains((long)k.EngagementId);
                        }
                        else
                        {
                            var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true).Select(s => s.EngagementId).Distinct().ToList();
                            long[] engagementList = engagementEmployeeMappingData.ToArray();

                            List<long> arr = engagementList.OfType<long>().ToList();
                            EngagementCondition = k => arr.Contains((long)k.EngagementId);
                        }
                    }
                    else
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        List<long> arr = engagementList.OfType<long>().ToList();
                        EngagementCondition = k => arr.Contains((long)k.EngagementId);


                    }


                    if (value.sortColumn == "" || value.sortDirection == "")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending("createdDate")).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }



                    }
                    else if (value.sortDirection == "desc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending(value.sortColumn)).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                     

                    }
                    else if (value.sortDirection == "asc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByProperty(value.sortColumn)).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }


                    }

                }
                else
                {
                    if (value.Engagement != null)
                    {
                        if (value.Engagement.Length > 0)
                        {
                            List<long> EngagementArray = new List<long>();

                            foreach (var eng in value.Engagement)
                            {
                                EngagementArray.Add(eng.value);
                            }
                            //   List<long> arr = value.Engagement.OfType<long>().ToList();
                            TicketEngagementCondition = k => EngagementArray.Contains((long)k.EngagementId);
                        }
                        else
                        {
                            var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true).Select(s => s.EngagementId).Distinct().ToList();
                            long[] engagementList = engagementEmployeeMappingData.ToArray();

                            List<long> arr = engagementList.OfType<long>().ToList();
                            TicketEngagementCondition = k => arr.Contains((long)k.EngagementId);
                            //TicketEngagementCondition = k => k.EngagementId != 0;
                        }
                    }
                    else
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        List<long> arr = engagementList.OfType<long>().ToList();
                        TicketEngagementCondition = k => arr.Contains((long)k.EngagementId);


                    }


                    if (value.sortColumn == "" || value.sortDirection == "")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending("createdDate")).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }

                      

                    }
                    else if (value.sortDirection == "desc")
                    {
                        if ((bool)value.isExcel)
                        {

                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending(value.sortColumn)).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else
                        {

                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }

                      

                    }
                    else if (value.sortDirection == "asc")
                    {
                        if ((bool)value.isExcel)
                        {

                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByProperty(value.sortColumn)).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                          

                    }
                }
            }
            else if (value.Role == 3) //Member
            {
                if (value.Type == "task")
                {
                    if (value.Engagement != null)
                    {
                        if (value.Engagement.Length > 0)
                        {
                            List<long> EngagementArray = new List<long>();

                            foreach (var eng in value.Engagement)
                            {
                                EngagementArray.Add(eng.value);
                            }

                            EngagementCondition = k => EngagementArray.Contains((long)k.EngagementId);
                        }
                        else
                        {
                            var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                            long[] engagementList = engagementEmployeeMappingData.ToArray();

                            List<long> arr = engagementList.OfType<long>().ToList();
                            EngagementCondition = k => arr.Contains((long)k.EngagementId);
                        }
                    }
                    else
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        List<long> arr = engagementList.OfType<long>().ToList();
                        EngagementCondition = k => arr.Contains((long)k.EngagementId);

                    }

                    MemberCondition = k => k.AssignedTo == value.UserId;

                    if (value.sortColumn == "" || value.sortDirection == "")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).Where(MemberCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).Where(MemberCondition).OrderByPropertyDescending("createdDate")).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).Where(MemberCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(DateCondition).Where(MemberCondition).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                            

                    }
                    else if (value.sortDirection == "desc")
                    {

                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition).OrderByPropertyDescending(value.sortColumn)).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        
                    }
                    else if (value.sortDirection == "asc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition).OrderByProperty(value.sortColumn)).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                        else
                        {
                            data.count = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition)).ToList().Count();
                            data.TaskData = _taskMaster.GetAll(b => b.Where(InitialCondition).Where(StatusCondition).Where(SearchText).Where(EngagementCondition).Where(MemberCondition).Where(DateCondition).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TaskData = addPhasesAndApplications(data.TaskData, true);
                        }
                      

                    }
                }
                else
                {
                    if (value.Engagement != null)
                    {
                        if (value.Engagement.Length > 0)
                        {
                            List<long> EngagementArray = new List<long>();

                            foreach (var eng in value.Engagement)
                            {
                                EngagementArray.Add(eng.value);
                            }

                            TicketEngagementCondition = k => EngagementArray.Contains((long)k.EngagementId);
                        }
                        else
                        {
                            var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                            long[] engagementList = engagementEmployeeMappingData.ToArray();

                            List<long> arr = engagementList.OfType<long>().ToList();
                            TicketEngagementCondition = k => arr.Contains((long)k.EngagementId); 
                            //TicketEngagementCondition = k => k.EngagementId != 0;
                        }
                    }
                    else
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.UserId).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        List<long> arr = engagementList.OfType<long>().ToList();
                        TicketEngagementCondition = k => arr.Contains((long)k.EngagementId);

                    }

                    TicketMemberCondition = k => k.AssignedTo == value.UserId;

                    if (value.sortColumn == "" || value.sortDirection == "")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).Where(TicketMemberCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).Where(TicketMemberCondition).OrderByPropertyDescending("createdDate")).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).Where(TicketMemberCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketDateCondition).Where(TicketMemberCondition).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                           

                    }
                    else if (value.sortDirection == "desc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition).OrderByPropertyDescending(value.sortColumn)).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }


                    }
                    else if (value.sortDirection == "asc")
                    {
                        if ((bool)value.isExcel)
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition).OrderByProperty(value.sortColumn)).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }
                        else
                        {
                            data.count = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition)).ToList().Count();
                            data.TicketData = _ticketMaster.GetAll(b => b.Where(TicketInitialCondition).Where(TicketStatusCondition).Where(TicketSearchText).Where(TicketEngagementCondition).Where(TicketMemberCondition).Where(TicketDateCondition).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
                            data.TicketData = addPhasesAndApplications(data.TicketData, false);
                        }

                        

                    }
                }
            }
            return data;
        }


        private dynamic addPhasesAndApplications(dynamic data,bool isTask)
        {
            if (data.Count > 0)
            {
                for (int i = 0; i < data.Count; i++)
                {
                    try
                    {
                        SqlCommand command = new SqlCommand("getTaskAndTicketGridData");
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add("@isTask", SqlDbType.Bit).Value = isTask;
                        command.Parameters.Add("@id", SqlDbType.BigInt).Value = data[i].Id;
                        command.Parameters.Add("@phaseId", SqlDbType.BigInt).Value = data[i].PhaseId;
                        command.Parameters.Add("@applicationId", SqlDbType.BigInt).Value = data[i].ApplicationId;
                        command.Parameters.Add("@assignedTo", SqlDbType.BigInt).Value = data[i].AssignedTo;
                        command.Parameters.Add("@engagementId", SqlDbType.BigInt).Value = data[i].EngagementId;
                        if (isTask)
                        {
                            command.Parameters.Add("@status", SqlDbType.Int).Value = data[i].TaskStatus;
                        }
                        else
                        {
                            command.Parameters.Add("@status", SqlDbType.Int).Value = data[i].TicketStatus;
                        }

                        var phaseAndApplicationData = _applicationAndPhaseResponseMaster.GetRecords(command).ToArray();
                        if (phaseAndApplicationData != null)
                        {
                            data[i].AssignedToString = phaseAndApplicationData[0].AssignedTo;
                            data[i].ApplicationString = phaseAndApplicationData[0].Application;
                            data[i].HoursSpent = phaseAndApplicationData[0].HoursSpent;
                            data[i].PhaseString = phaseAndApplicationData[0].Phase;
                            data[i].EngagementString = phaseAndApplicationData[0].Engagement;
                            data[i].Customer = phaseAndApplicationData[0].Customer;
                            data[i].CreatedByString = phaseAndApplicationData[0].CreatedByString;
                            data[i].StatusString = phaseAndApplicationData[0].Status;
                            //data[i].EngagementTypeString = phaseAndApplicationData[0].EngagementType;

                            var eTypeString = "";
                            if(phaseAndApplicationData[0].EngagementType == "1")
                            {
                                eTypeString = "AMC";
                            }
                            else if (phaseAndApplicationData[0].EngagementType == "2")
                            {
                                eTypeString = "PRODUCT";
                            }
                            else if (phaseAndApplicationData[0].EngagementType == "3")
                            {
                                eTypeString = "PROJECT";
                            }
                            else if (phaseAndApplicationData[0].EngagementType == "4")
                            {
                                eTypeString = "T&M";
                            }
                            else if (phaseAndApplicationData[0].EngagementType == "5")
                            {
                                eTypeString = "INTERNAL";
                            }

                            data[i].EngagementTypeString = eTypeString;

                            if (!isTask)
                            {
                                var priorityString = "";
                                if(phaseAndApplicationData[0].Priority == "1")
                                {
                                    priorityString = "Showstopper";
                                }
                                else if (phaseAndApplicationData[0].Priority == "2")
                                {
                                    priorityString = "Critical";
                                }
                                else if (phaseAndApplicationData[0].Priority == "3")
                                {
                                    priorityString = "Medium";
                                }
                                else
                                {
                                    priorityString = "Low";
                                }
                                data[i].PriorityString = priorityString;
                            }
                             
                        }
                        // return leaveRequestMasterData;
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            }
            return data;
        }


       
    }
}
