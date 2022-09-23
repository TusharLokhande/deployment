using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Enums;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Common.DropdownService
{
    public class DropdownService : IDropdownService
    {
        private readonly IRepository<EmployeeMasterEntity> _employeeMaster;

        private readonly IRepository<Entities.EngagementMaster> _engagementMaster;

        private readonly IRepository<PhaseMaster> _phaseMaster;

        private readonly IRepository<EngagementEmployeeMapping> _engagementEmployeeMapping;

        private readonly IRepository<LeavesResonMaster> _leavesResonMaster;

        private readonly IRepository<NoChargesReason> _noChargesReasonMaster;


        private readonly IRepository<CostCenter> _costCenter;
        private readonly IRepository<WorkPoliciesMaster> _workPolicyMaster;
        private readonly IRepository<TicketTimeSheet> _ticketTimeSheet;
        private readonly IRepository<TaskMaster> _taskMaster;

        private readonly IRepository<EmployeeRoleMapping> _employeeRoleMapping;

        private readonly IRepository<CapacityAllocation> _capacityAllocation;
        private readonly IRepository<Customer> _customerMaster;
        private readonly IRepository<ApplicationsMaster> _applicationsMaster;
        private readonly SqlDbContext _db;

        private readonly IRepository<Entities.TaskTicketStatus> _taskTicketStatusRepository;

        private readonly IRepository<Entities.LeaveType> _leaveTypeRepository;
        private readonly IRepository<Entities.RolesMaster> _rolesMasterRepository;
        private readonly IRepository<Entities.TimesheetPolicy> _timesheetPolicyRepository;






        public DropdownService(IRepository<Entities.EngagementMaster> engagementMaster,
            IRepository<EmployeeRoleMapping> employeeRoleMapping,
            IRepository<EmployeeMasterEntity> employeeMaster,
            IRepository<EngagementEmployeeMapping> engagementEmployeeMapping,
            IRepository<LeavesResonMaster> leavesResonMaster,
            IRepository<CostCenter> costCenter,
            IRepository<WorkPoliciesMaster> workPolicyMaster,
            IRepository<TicketTimeSheet> ticketTimeSheet,
           SqlDbContext db,
            IRepository<PhaseMaster> phaseMaster,
            IRepository<Entities.TaskTicketStatus> taskTicketStatusRepository,
            IRepository<Customer> customerMaster,
            IRepository<ApplicationsMaster> applicationsMaster,
            IRepository<CapacityAllocation> capacityAllocation,
            IRepository<TaskMaster> taskMaster,
            IRepository<NoChargesReason> noChargesReasonMaster,
             IRepository<Entities.LeaveType> leaveTypeRepository,
             IRepository<Entities.RolesMaster> rolesMasterRepository,
             IRepository<Entities.TimesheetPolicy> timesheetPolicyRepository
            )
        {
            _engagementMaster = engagementMaster;
            _engagementEmployeeMapping = engagementEmployeeMapping;
            _employeeMaster = employeeMaster;
            _leavesResonMaster = leavesResonMaster;
            _taskTicketStatusRepository = taskTicketStatusRepository;
            _costCenter = costCenter;
            _workPolicyMaster = workPolicyMaster;
            _ticketTimeSheet = ticketTimeSheet;
            _customerMaster = customerMaster;
            _applicationsMaster = applicationsMaster;
            _phaseMaster = phaseMaster;
            _employeeRoleMapping = employeeRoleMapping;
            _capacityAllocation = capacityAllocation;
            _db = db;
            _taskMaster = taskMaster;
            _noChargesReasonMaster = noChargesReasonMaster;
            _leaveTypeRepository = leaveTypeRepository;
            _rolesMasterRepository = rolesMasterRepository;
            _timesheetPolicyRepository = timesheetPolicyRepository;
        }

        public dynamic GetDropdownList(CommonDropdownModel value) //searchFor //searchValue
        {
            try
            {
                if (value.SearchFor != null && value.SearchValue != 0)
                {
                    if (value.SearchFor == "capacityAllcoationData")
                    {

                        var data = (from ca in _capacityAllocation.Table
                                    join tm in _taskMaster.Table on ca.EngagementId equals tm.EngagementId
                                    where ca.EngagementId == value.SearchValue
                                    select new
                                    {
                                        ca.EngagementId,
                                        ca.FromDate,
                                        ca.ToDate,
                                        ca.Mandays,
                                        ca.IsActive,
                                        //hoursAssigned= a.Sum(s=>s.HoursAssigned),
                                        //AssignedMandays = a.Sum(s => s.HoursAssigned)*8
                                    }).Where(b => b.IsActive == true).ToList();
                        // var capacityAllocationData = _capacityAllocation.GetAll(b=>b.Where(b => b.IsActive == true && b.EngagementId == value.SearchValue)).ToList();
                        return data;
                    }
                    if (value.SearchFor == "assignedTo")
                    {
                        var engagementEmployeeMappingData = _capacityAllocation.Table.
                            Where(b => b.IsActive == true && b.EngagementId == value.SearchValue)
                            .Where(b => b.FromDate >= value.fromDate && b.ToDate <= value.toDate)
                            .Select(s => s.EmployeeId).Distinct().ToList();
                        long[] employeeList = engagementEmployeeMappingData.ToArray();
                        if (engagementEmployeeMappingData != null)
                        {
                            var data = _employeeMaster.GetAll(k => k.Where(b => b.IsActive == true && employeeList.Contains(b.Id))).ToList();
                            return data;
                        }

                        return null;
                    }
                    if (value.SearchFor == "onlyEngagement")
                    {
                        var onlyEngagement = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true)).ToList();
                        return onlyEngagement;
                    }
                    if (value.SearchFor == "engagementLeadsManagers")
                    {
                        var engagementLeadsManagers = (from erm in _employeeRoleMapping.Table
                                                       join em in _employeeMaster.Table on erm.EmployeeId equals em.Id
                                                       select new
                                                       {
                                                           erm.RoleId,
                                                           em.Name,
                                                           em.Id,
                                                           em.IsActive
                                                       }).Where(b => b.IsActive == true && (b.RoleId == 2 || b.RoleId == 3));
                        return engagementLeadsManagers;
                    }
                    if (value.SearchFor == "capacityEngagement")
                    {
                        if (value.SearchValue > 0)
                        {
                            var capacityEngagement = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && (b.EngagementType == value.SearchValue))).Select(s => new { s.Id, s.Engagement });
                            return capacityEngagement;
                        }
                        //else
                        //{
                        //    List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();
                        //    var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType == value.SearchValue)).ToList();

                        //    if (engagementData.Count > 0)
                        //    {
                        //        for (var i = 0; i < engagementData.Count; i++)
                        //        {

                        //            var phaseMaster = _phaseMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                        //            var applicationMaster = _applicationsMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                        //            if (phaseMaster.Count > 0)
                        //            {
                        //                foreach (var phase in phaseMaster)
                        //                {
                        //                    GetEngagementDropdown phaseD = new GetEngagementDropdown();
                        //                    phaseD.Engagement = engagementData[i].Engagement;
                        //                    phaseD.EngagementId = engagementData[i].Id;
                        //                    //phaseD.EmployeeId = engagementData[i].CustomerId;
                        //                    //phaseD.EngagementType = engagementData[i].EngagementType;
                        //                    phaseD.Phase = phase.Phase;
                        //                    phaseD.PhaseId = phase.Id;
                        //                    data.Add(phaseD);
                        //                }
                        //            }
                        //            else if (applicationMaster.Count > 0)
                        //            {
                        //                foreach (var applications in applicationMaster)
                        //                {
                        //                    GetEngagementDropdown phaseD = new GetEngagementDropdown();
                        //                    phaseD.Engagement = engagementData[i].Engagement;
                        //                    phaseD.EngagementId = engagementData[i].Id;
                        //                    //phaseD.EmployeeId = engagementData[i].CustomerId;
                        //                    //phaseD.EngagementType = engagementData[i].EngagementType;
                        //                    phaseD.Application = applications.Application;
                        //                    phaseD.ApplicationId = applications.Id;
                        //                    data.Add(phaseD);
                        //                }
                        //            }
                        //            else
                        //            {
                        //                GetEngagementDropdown phaseD = new GetEngagementDropdown();
                        //                phaseD.Engagement = engagementData[i].Engagement;
                        //                phaseD.EngagementId = engagementData[i].Id;
                        //                //phaseD.EmployeeId = engagementData[i].CustomerId;
                        //                //phaseD.EngagementType = engagementData[i].EngagementType;
                        //                data.Add(phaseD);
                        //            }
                        //        }
                        //    }
                        //    return data;
                        //}
                        return null;
                    }
                    if (value.SearchFor == "engagement") //for Member
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.SearchValue).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        if (engagementEmployeeMappingData != null)
                        {
                            var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && engagementList.Contains(b.Id))).ToList();

                            if (engagementData.Count > 0)
                            {
                                for (var i = 0; i < engagementData.Count; i++)
                                {

                                    var phaseMaster = _phaseMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                                    var applicationMaster = _applicationsMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                                    if (phaseMaster.Count > 0)
                                    {
                                        foreach (var phase in phaseMaster)
                                        {
                                            GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                            phaseD.Engagement = engagementData[i].Engagement;
                                            phaseD.EngagementId = engagementData[i].Id;
                                            phaseD.EmployeeId = engagementData[i].CustomerId;
                                            phaseD.EngagementType = engagementData[i].EngagementType;

                                            phaseD.Phase = phase.Phase;
                                            phaseD.PhaseId = phase.Id;
                                            data.Add(phaseD);
                                        }
                                    }
                                    else if (applicationMaster.Count > 0)
                                    {
                                        foreach (var applications in applicationMaster)
                                        {
                                            GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                            phaseD.Engagement = engagementData[i].Engagement;
                                            phaseD.EngagementId = engagementData[i].Id;
                                            phaseD.EmployeeId = engagementData[i].CustomerId;
                                            phaseD.EngagementType = engagementData[i].EngagementType;

                                            phaseD.Application = applications.Application;
                                            phaseD.ApplicationId = applications.Id;
                                            data.Add(phaseD);
                                        }
                                    }
                                    else
                                    {
                                        GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                        phaseD.Engagement = engagementData[i].Engagement;
                                        phaseD.EngagementId = engagementData[i].Id;
                                        phaseD.EmployeeId = engagementData[i].CustomerId;
                                        phaseD.EngagementType = engagementData[i].EngagementType;
                                        data.Add(phaseD);
                                    }
                                }
                            }
                            return data;
                        }


                    }
                    if (value.SearchFor == "engagementForManagerTask") //for Manager
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType != 1).OrderByProperty("Engagement")).ToList();

                        if (engagementData.Count > 0)
                        {
                            for (var i = 0; i < engagementData.Count; i++)
                            {

                                var phaseMaster = _phaseMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                                var applicationMaster = _applicationsMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                                if (phaseMaster.Count > 0)
                                {
                                    foreach (var phase in phaseMaster)
                                    {
                                        GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                        phaseD.Engagement = engagementData[i].Engagement;
                                        phaseD.EngagementId = engagementData[i].Id;
                                        phaseD.EmployeeId = engagementData[i].CustomerId;
                                        phaseD.EngagementType = engagementData[i].EngagementType;

                                        phaseD.Phase = phase.Phase;
                                        phaseD.PhaseId = phase.Id;
                                        data.Add(phaseD);
                                    }
                                }
                                else if (applicationMaster.Count > 0)
                                {
                                    foreach (var applications in applicationMaster)
                                    {
                                        GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                        phaseD.Engagement = engagementData[i].Engagement;
                                        phaseD.EngagementId = engagementData[i].Id;
                                        phaseD.EmployeeId = engagementData[i].CustomerId;
                                        phaseD.EngagementType = engagementData[i].EngagementType;

                                        phaseD.Application = applications.Application;
                                        phaseD.ApplicationId = applications.Id;
                                        data.Add(phaseD);
                                    }
                                }
                                else
                                {
                                    GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                    phaseD.Engagement = engagementData[i].Engagement;
                                    phaseD.EngagementId = engagementData[i].Id;
                                    phaseD.EmployeeId = engagementData[i].CustomerId;
                                    phaseD.EngagementType = engagementData[i].EngagementType;
                                    data.Add(phaseD);
                                }
                            }
                        }
                        return data;

                    }
                    if (value.SearchFor == "engagementForManagerTicket") //for Manager
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType == 1).OrderByProperty("Engagement")).ToList();

                        if (engagementData.Count > 0)
                        {
                            for (var i = 0; i < engagementData.Count; i++)
                            {

                                var phaseMaster = _phaseMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                                var applicationMaster = _applicationsMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementId == engagementData[i].Id)).ToList();

                                if (phaseMaster.Count > 0)
                                {
                                    foreach (var phase in phaseMaster)
                                    {
                                        GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                        phaseD.Engagement = engagementData[i].Engagement;
                                        phaseD.EngagementId = engagementData[i].Id;
                                        phaseD.EmployeeId = engagementData[i].CustomerId;
                                        phaseD.EngagementType = engagementData[i].EngagementType;

                                        phaseD.Phase = phase.Phase;
                                        phaseD.PhaseId = phase.Id;
                                        data.Add(phaseD);
                                    }
                                }
                                else if (applicationMaster.Count > 0)
                                {
                                    foreach (var applications in applicationMaster)
                                    {
                                        GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                        phaseD.Engagement = engagementData[i].Engagement;
                                        phaseD.EngagementId = engagementData[i].Id;
                                        phaseD.EmployeeId = engagementData[i].CustomerId;
                                        phaseD.EngagementType = engagementData[i].EngagementType;

                                        phaseD.Application = applications.Application;
                                        phaseD.ApplicationId = applications.Id;
                                        data.Add(phaseD);
                                    }
                                }
                                else
                                {
                                    GetEngagementDropdown phaseD = new GetEngagementDropdown();
                                    phaseD.Engagement = engagementData[i].Engagement;
                                    phaseD.EngagementId = engagementData[i].Id;
                                    phaseD.EmployeeId = engagementData[i].CustomerId;
                                    phaseD.EngagementType = engagementData[i].EngagementType;
                                    data.Add(phaseD);
                                }
                            }
                        }
                        return data;

                    }
                    if (value.SearchFor == "engagementForManager") //for Manager
                    {


                        var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType != 1).OrderByProperty("Engagement")).ToList();

                        return engagementData;



                    }
                    if (value.SearchFor == "engagementForEManager") //for EnagagementManager
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.SearchValue).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        if (engagementEmployeeMappingData != null)
                        {
                            var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType != 1 && engagementList.Contains(b.Id)).OrderByProperty("Engagement")).ToList();


                            return engagementData;
                        }


                    }
                    if (value.SearchFor == "engagementForMember") //for Member
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.SearchValue).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        if (engagementEmployeeMappingData != null)
                        {
                            var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType != 1 && engagementList.Contains(b.Id)).OrderByProperty("Engagement")).ToList();

                            return engagementData;
                        }


                    }

                    if (value.SearchFor == "engagementForManagerTicketForD") //for Manager
                    {

                        var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType == 1).OrderByProperty("Engagement")).ToList();

                        return engagementData;

                    }
                    if (value.SearchFor == "engagementForEManagerTicket") //for EnagagementManager
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.SearchValue).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        if (engagementEmployeeMappingData != null)
                        {
                            var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && engagementList.Contains(b.Id) && b.EngagementType == 1).OrderByProperty("Engagement")).ToList();


                            return engagementData;
                        }


                    }
                    if (value.SearchFor == "engagementForMemberTicket") //for Member
                    {

                        List<GetEngagementDropdown> data = new List<GetEngagementDropdown>();

                        var engagementEmployeeMappingData = _capacityAllocation.Table.Where(b => b.IsActive == true && b.EmployeeId == value.SearchValue).Select(s => s.EngagementId).Distinct().ToList();
                        long[] engagementList = engagementEmployeeMappingData.ToArray();

                        if (engagementEmployeeMappingData != null)
                        {
                            var engagementData = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true && engagementList.Contains(b.Id) && b.EngagementType == 1).OrderByProperty("Engagement")).ToList();

                            return engagementData;
                        }


                    }
                    if (value.SearchFor == "reason")
                    {
                        var data = _noChargesReasonMaster.GetAll(k => k.Where(b => b.IsActive == true && b.EngagementType == value.SearchValue)).Select(s => new { s.Id, s.Reason });
                        return data;
                    }
                    if (value.SearchFor == "leaveReason")
                    {
                        var data = _leavesResonMaster.GetAll(k => k.Where(b => b.IsActive == true)).Select(s => new { s.Id, s.LeavesReson });
                        return data;
                    }
                    if (value.SearchFor == "costcenter")
                    {

                        var data = _costCenter.GetAll(k => k.Where(b => b.IsActive == true)).OrderBy(k => k.CostCenter1).Select(s => new { s.Id, s.CostCenter1 });
                        return data;
                    }
                    if (value.SearchFor == "policyname")
                    {

                        var data = _workPolicyMaster.GetAll(k => k.Where(b => b.IsActive == true)).OrderBy(k => k.PolicyName).Select(s => new { s.Id, s.PolicyName });
                        return data;
                    }
                    if (value.SearchFor == "employee")
                    {
                        var data = _employeeMaster.GetAll(k => k.Where(b => b.IsActive == true)).OrderBy(k => k.Name).Select(s => new { s.Id, s.Name, s.Eid });
                        return data;
                    }
                    if (value.SearchFor == "customer")
                    {
                        var data = _customerMaster.GetAll(k => k.Where(b => b.IsActive == true)).OrderBy(k => k.Name).Select(s => new { s.Id, s.Name, s.Abbreviation });
                        return data;
                    }
                    if (value.SearchFor == "applications")
                    {
                        var data = _applicationsMaster.GetAll(k => k.Where(b => b.IsActive == true)).OrderBy(k => k.Application).Select(s => new { s.Id, s.Application });
                        return data;
                    }
                    if (value.SearchFor == "phases")
                    {
                        var data = _phaseMaster.GetAll(k => k.Where(b => b.IsActive == true)).OrderBy(k => k.Phase).Select(s => new { s.Id, s.Phase });
                        return data;
                    }
                    if (value.SearchFor == "status")
                    {
                        if (value.SearchValue == 1)
                        {
                            var data = _taskTicketStatusRepository.GetAll(k => k.Where(b => b.IsActive == true && b.Type == "task")).ToList();
                            return data;
                        }
                        else
                        {
                            var data = _taskTicketStatusRepository.GetAll(k => k.Where(b => b.IsActive == true && b.Type == "ticket")).ToList();
                            return data;
                        }
                    }
                    if (value.SearchFor == "ticketType")
                    {
                        List<CommomDropdownDataType> data = new List<CommomDropdownDataType>();

                        foreach (var type in Enum.GetNames<TicketType>())
                        {
                            CommomDropdownDataType temp = new CommomDropdownDataType();

                            temp.Label = type.GetValueFromName<TicketType>();
                            temp.Value = (int)Enum.Parse(typeof(TicketType), type);
                            data.Add(temp);

                        }

                        return data;


                    }
                    if (value.SearchFor == "engagementMasterOnly")
                    {

                        var data = _engagementMaster.GetAll(k => k.Where(b => b.IsActive == true)).Select(s => new { s.Id, s.Engagement });
                        return data;
                    }
                    if (value.SearchFor == "timesheet")
                    {

                        var data = _timesheetPolicyRepository.GetAll(k => k.Where(b => b.IsActive == true)).Select(s => new CommomDropdownDataType { Value = (int)s.Id, Label = s.Name });
                        return data;

                    }
                    if (value.SearchFor == "efficiency")
                    {

                        List<CommomDropdownDataType> data = new List<CommomDropdownDataType>();

                        foreach (var type in Enum.GetNames(typeof(EfficiencyEnum)))

                        {
                            CommomDropdownDataType temp = new CommomDropdownDataType();


                            temp.Label = type.GetValueFromName<EfficiencyEnum>();

                            temp.Value = (int)Enum.Parse(typeof(EfficiencyEnum), type);
                            data.Add(temp);

                        }

                        return data;


                    }
                    if (value.SearchFor == "leaveType")
                    {

                        var data = _leaveTypeRepository.GetAll(k => k.Where(b => b.IsActive == true)).Select(s => new CommomDropdownDataType { Value = (int)s.Id, Label = s.LeaveName });
                        return data;

                    }
                    if (value.SearchFor == "fromAndToDate")
                    {
                        var data = _capacityAllocation.GetAll(k => k.Where(b => b.IsActive == true && value.SearchValue == b.EngagementId));
                    }
                    if (value.SearchFor == "employeeRoles")
                    {
                        var data = _rolesMasterRepository.GetAll(b => b.Where(k => k.IsActive == true)).Select(s => new CommomDropdownDataType { Label = s.RoleName, Value = (int)s.Id });
                        return data;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return null;
        }

        public class CommomDropdownDataType
        {
            public string Label { get; set; }

            public int Value { get; set; }
        }

    }
}
