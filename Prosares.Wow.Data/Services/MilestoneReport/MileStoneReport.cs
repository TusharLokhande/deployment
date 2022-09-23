
using Microsoft.Data.SqlClient;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.MilestoneReport
{
    public class MileStoneReport : IMileStoneReport
    {
        private readonly IRepository<Entities.MilestoneReportEntity> _milestone;
        private readonly IRepository<Customer> _customer;
        // private readonly IRepository<Entities.DropeDownEntity> _dropedown;


        #region Constructor
        public MileStoneReport(IRepository<Entities.MilestoneReportEntity> milestone, IRepository<Customer> customer)
        {
            _milestone = milestone;
            _customer = customer;
            //  _dropedown = dropedown;
        }

        public dynamic GetDropedownCustomerNameList()
        {
            SqlCommand command = new SqlCommand("GetCustomerDropDownList");
            command.CommandType = CommandType.StoredProcedure;
            return _milestone.GetRecords(command).ToList();
            //var data = (from x in _customer.Table
            //           select new { Id = x.Id , Name = x.Name } );

            //List<ResponseModelEntity> obj = new List<ResponseModelEntity>();
            //foreach (var x in data)
            //{
            //    ResponseModelEntity rj = new ResponseModelEntity();
            //    rj.Id = x.Id;
            //    rj.Name = x.Name;
            //    obj.Add(rj);
            //}

        }

        public IEnumerable<MilestoneReportEntity> GetDropedownEngagementTypeList()
        {
            SqlCommand command = new SqlCommand("stpEngagementTypeDropeDownList");
            command.CommandType = CommandType.StoredProcedure;
            return _milestone.GetRecords(command).ToList();
        }

        public IEnumerable<MilestoneReportEntity> MilestoneDashboardData(Entities.MilestoneReportEntity value)
        {
            List<MilestoneReportEntity> list = new List<MilestoneReportEntity>();
            SqlCommand command = new SqlCommand("stpGetReportMilestone");
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@pageSize", SqlDbType.BigInt).Value = value.pageSize;
            command.Parameters.Add("@start", SqlDbType.BigInt).Value = value.start;
            command.Parameters.Add("@SortColumn", SqlDbType.VarChar).Value = value.SortColumn;
            command.Parameters.Add("@SortOrder", SqlDbType.VarChar).Value = value.SortOrder;
            command.Parameters.Add("@SearchText", SqlDbType.VarChar).Value = value.SearchText;
            command.Parameters.Add("@Customer", SqlDbType.VarChar).Value = value.Customer;
            command.Parameters.Add("@EngagementTypeids", SqlDbType.VarChar).Value = value.EngagementType;
            command.Parameters.Add("@FromDate", SqlDbType.Date).Value = (value.FromDate != null ? value.FromDate : null);
            command.Parameters.Add("@ToDate", SqlDbType.Date).Value = (value.ToDate != null ? value.ToDate : null);
            list = _milestone.GetRecords(command).ToList();

            MilestoneReportResponse obj = new MilestoneReportResponse();
            obj.data = list;


            return list;
        }

        #endregion
    }

    public class MilestoneReportResponse {

        public long count { get; set; }
        public dynamic data { get; set; }
    }







}
