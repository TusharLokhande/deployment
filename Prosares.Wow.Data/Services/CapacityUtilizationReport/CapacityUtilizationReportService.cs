using Microsoft.Data.SqlClient;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;


namespace Prosares.Wow.Data.Services.CapacityUtilizationReport
{
    public class CapacityUtilizationReportService : ICapacityUtilizationReport
    {
        private readonly IRepository<Models.CapacityUtilizationReport> _capacity;
        private readonly IRepository<Entities.Customer> _Customer;
        private readonly IRepository<Entities.EngagementTypeOption> _EngageTypeOption;
        private readonly IRepository<Entities.EngagementMaster> _EngagementMaster;

        public CapacityUtilizationReportService(IRepository<Entities.EngagementMaster> EngagementMaster, IRepository<Entities.EngagementTypeOption> EngageTypeOption,IRepository<Models.CapacityUtilizationReport> capcity, IRepository<Entities.Customer> customer)
        {
            _capacity = capcity;
            _Customer = customer;
            _EngageTypeOption = EngageTypeOption;
            _EngagementMaster = EngagementMaster;
            
        }

        public dynamic GetCapacityAllocation(Models.CapacityUtilizationReport value)
        {
            CapacityUtilizationReportResponse response = new CapacityUtilizationReportResponse();

            SqlCommand command = new SqlCommand("stp_capacityallocation");
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@dropdown", SqlDbType.VarChar).Value = value.MasterType;
            command.Parameters.Add("@customer", SqlDbType.NVarChar).Value = value.Customers;
            command.Parameters.Add("@EngagementType", SqlDbType.NVarChar).Value = value.EngagementTypes;
            command.Parameters.Add("@Engagement", SqlDbType.NVarChar).Value = value.Engagements;
            command.Parameters.Add("@fromdate", SqlDbType.Date).Value = value.FromDate == null ? null : value.FromDate;
            command.Parameters.Add("@todate", SqlDbType.Date).Value = value.ToDate == null ? null : value.ToDate;

            var data = _capacity.GetRecords(command);
            var count = data.Count();
            var report = _capacity.GetRecords(command);
            
            if (value.MasterType == "Resource")
            {
               

                if (value.sortColumn == "" || value.sortDirection == "" || value.sortColumn == null)
                {
                    
                    data = data.Where(
                                        k => ((value.searchText != null) ? k.Resource != null && k.Resource.ToLower().Contains(value.searchText.ToLower()) || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    
                    data = data.AsQueryable().OrderByPropertyDescending("mandaysPlanned").Skip(value.start).Take(value.pageSize).ToList();
                } 
                
                else if (value.sortDirection == "desc")
                {
                    
                    data = data.Where(
                                        k => ((value.searchText != null) ? k.Resource != null && k.Resource.ToLower().Contains(value.searchText.ToLower()) || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }
                
                else if (value.sortDirection == "asc")
                {
                    
                    data = data.Where(
                                        k => ((value.searchText != null) ? k.Resource != null && k.Resource.ToLower().Contains(value.searchText.ToLower()) || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByProperty(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }
                
            }

            if (value.MasterType == "Engagement")
            {
                if (value.sortColumn == "" || value.sortDirection == "" || value.sortColumn == null)
                {

                    data = data.Where(
                                        k => ((value.searchText != null) ? k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower())|| k.Engagement != null && k.Engagement.ToLower().Contains(value.searchText.ToLower()) || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Engagement != "")
                                     ).ToList();

                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending("mandaysPlanned").Skip(value.start).Take(value.pageSize).ToList();
                }

                else if (value.sortDirection == "desc")
                {

                    data = data.Where(
                                        k => ((value.searchText != null) ? k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower()) || k.Engagement != null && k.Engagement.ToLower().Contains(value.searchText.ToLower()) || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Engagement != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }

                else if (value.sortDirection == "asc")
                {

                    data = data.Where(
                                       k => ((value.searchText != null) ? k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower()) || k.Engagement != null && k.Engagement.ToLower().Contains(value.searchText.ToLower()) || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Engagement != "")
                                    ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByProperty(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }
            }

            if (value.MasterType == "Engagement Resource")
            {
                if (value.sortColumn == "" || value.sortDirection == "" || value.sortColumn == null)
                {

                    data = data.Where(
                                        k => (
                                                (value.searchText != null) ? k.Resource != null && k.Resource.ToLower().Contains(value.searchText.ToLower()) 
                                                || k.Engagement != null && k.Engagement.ToLower().Contains(value.searchText.ToLower())
                                                ||k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower()) 
                                                || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending("mandaysPlanned").Skip(value.start).Take(value.pageSize).ToList();
                }

                else if (value.sortDirection == "desc")
                {

                    data = data.Where(
                                        k => (
                                                (value.searchText != null) ? k.Resource != null && k.Resource.ToLower().Contains(value.searchText.ToLower())
                                                || k.Engagement != null && k.Engagement.ToLower().Contains(value.searchText.ToLower())
                                                || k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower())
                                                || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }

                else if (value.sortDirection == "asc")
                {

                    data = data.Where(
                                       k => (
                                               (value.searchText != null) ? k.Resource != null && k.Resource.ToLower().Contains(value.searchText.ToLower())
                                               || k.Engagement != null && k.Engagement.ToLower().Contains(value.searchText.ToLower())
                                               || k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower())
                                               || k.Customer != null && k.Customer.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                    ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByProperty(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }
            }

            if (value.MasterType == "Engagement Type")
            {
                if (value.sortColumn == "" || value.sortDirection == "" || value.sortColumn == null)
                {

                    data = data.Where(
                                        k => ((value.searchText != null) ? k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower())  : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending("mandaysPlanned").Skip(value.start).Take(value.pageSize).ToList();
                }

                else if (value.sortDirection == "desc")
                {

                    data = data.Where(
                                       k => ((value.searchText != null) ? k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                    ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }

                else if (value.sortDirection == "asc")
                {

                    data = data.Where(
                                        k => ((value.searchText != null) ? k.EngagementType != null && k.EngagementType.ToLower().Contains(value.searchText.ToLower()) : k.Resource != "")
                                     ).ToList();
                    report = data;
                    count = data.Count();
                    data = data.AsQueryable().OrderByProperty(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();

                }
            }
            response.count = count;
            response.data = data;
            response.report = report;
            return response;
        }





        public dynamic Getallcustomers()
        {
            var data = from x in _Customer.Table select new { Id = x.Id, Name = x.Name };
            return data;
        }

        public dynamic Getallengagementtype()
        {
            var data = from x in _EngageTypeOption.Table select new { Id = x.EngagementTypeId, Name = x.EngagementType };
            return data;
        }

        public dynamic Getallengagement()
        {
            var data = from x in _EngagementMaster.Table select new { Id = x.Id, Name = x.Engagement };
            return data;
        }
    }

    public class CapacityUtilizationReportResponse
    {
        public long count { get; set; }

        public  dynamic data { get; set; }

        public dynamic report { get; set; }
    }
}


