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

namespace Prosares.Wow.Data.Services.Milestone
{
    public class MilestoneService : IMilestoneService
    {
        #region Prop
        private readonly IRepository<MileStone> _milestone;
        private readonly ILogger<MilestoneService> _logger;
        private readonly IRepository<Entities.EngagementMaster> _engagement;
        #endregion

        #region Constructor
        public MilestoneService(IRepository<MileStone> milestone,
                        ILogger<MilestoneService> logger,
                        IRepository<Entities.EngagementMaster> engagement)
        {
            _milestone = milestone;
            _logger = logger;
            _engagement = engagement;
        }
        #endregion

        #region Methods
        public MilestoneResponse GetMilestoneData(MileStone value)
        {
            var data = new MilestoneResponse();

            Expression<Func<Entities.MileStone, bool>> InitialCondition;
            Expression<Func<Entities.MileStone, bool>> SearchText;
            Expression<Func<Entities.MileStone, bool>> DateFilter;


            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                // SearchText = k => k.Engagement.Engagement.Contains(value.searchText);
                SearchText = k => k.MileStones.Contains(value.searchText);

            }
            else
            {
                // SearchText = k => k.Engagement.Engagement != "";
                SearchText = k => k.MileStones != "";
            }

            DateFilter = k => k.RevisedDate >= value.fromDate && k.RevisedDate <= value.toDate;

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _milestone.GetAll(b => b.Where(InitialCondition).Where(DateFilter).Where(SearchText)).ToList().Count();
                data.milestoneData = _milestone.GetAll(b => b.Where(InitialCondition).Where(DateFilter).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _milestone.GetAll(b => b.Where(InitialCondition).Where(DateFilter).Where(SearchText)).ToList().Count();
                data.milestoneData = _milestone.GetAll(b => b.Where(InitialCondition).Where(DateFilter).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _milestone.GetAll(b => b.Where(InitialCondition).Where(DateFilter).Where(SearchText)).ToList().Count();
                data.milestoneData = _milestone.GetAll(b => b.Where(InitialCondition).Where(DateFilter).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            return data;
        }

        public bool CheckIfMilestoneExists(string MileStone)
        {
            var data = _milestone.GetAll(b => b.Where(k => k.IsActive == true && k.MileStones == MileStone)).ToList();
            if (data.Count > 0)
            {
                return true;
            }
            return false;
        }

        public MileStone GetMilestoneById(MileStone value)
        {
            var milestone = _milestone.GetById(value.Id);

            return milestone;
        }

        public void InsertUpdateMilestoneData(MileStone value)
        {
            try
            {
                if (value.Id == 0)
                {
                    _milestone.Insert(value);
                }
                else
                {
                    _milestone.Update(value);
                }
            }
            catch (Exception ex)
            {
                throw;
            }


        }

        public dynamic ExportToExcel(Entities.MileStone value)
        {




            //var x = (from cc in _milestone.Table
            //         join em in _engagement.Table on cc.EngagementId equals em.Id
            //         select new
            //         {
            //             MileStones = cc.MileStones,
            //             Engagement_Name = em.Engagement,
            //             Amount = cc.Amount,
            //             PlannedDate = cc.PlannedDate,
            //             RevisedDate = cc.RevisedDate,
            //             CompletedDate = cc.CompletedDate,
            //             InvoicedDate = cc.InvoicedDate,
            //             IsActive = cc.IsActive,
            //             CreatedDate = cc.CreatedDate,
            //         }).ToList();

            List<Entities.MileStone> x = _milestone.GetAll().ToList();
            List<Entities.EngagementMaster> list = new List<Entities.EngagementMaster>();
            List<MileStonExport> export = new List<MileStonExport>();
            foreach (var item in x)
            {
                Entities.EngagementMaster op = _engagement.GetAll().Where(a => a.Id == item.EngagementId).Single();
                list.Add(op);
            }

            foreach (var item in x)
            {
                MileStonExport mm = new MileStonExport()
                {
                    MileStones = item.MileStones,
                    Amount = item.Amount,
                    PlannedDate = item.PlannedDate,
                    InvoicedDate = item.InvoicedDate,
                    RevisedDate = item.RevisedDate,
                    IsActive = item.IsActive,
                    CreatedDate = item.CreatedDate,
                    CompletedDate = item.CompletedDate,

                };
                export.Add(mm);
            }

            foreach (var a in list)
            {
                foreach (var b in export)
                {
                    b.Engagement_Name = a.Engagement;
                }
            }

            var data = export;

            //var data = x;




            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data = data = data.Where(
                                        k => ((value.searchText != null) ? k.MileStones != null && k.MileStones.ToLower().Contains(value.searchText.ToLower()) : k.MileStones != "")
                                     ).ToList();
                data = data.ToList().AsQueryable().OrderByPropertyDescending("createdDate").Skip(value.start).Take(value.pageSize).ToList(); ;
            }
            else if (value.sortDirection == "desc")
            {
                data = data = data.Where(
                                      k => ((value.searchText != null) ? k.MileStones != null && k.MileStones.ToLower().Contains(value.searchText.ToLower()) : k.MileStones != "")
                                   ).ToList();
                data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data = data = data.Where(
                                      k => ((value.searchText != null) ? k.MileStones != null && k.MileStones.ToLower().Contains(value.searchText.ToLower()) : k.MileStones != "")
                                   ).ToList();
                data = data.AsQueryable().OrderByPropertyDescending(value.sortColumn).Skip(value.start).Take(value.pageSize).ToList();
            }
            return data;
        }

        public dynamic MilestoneExportToExcel(MileStone value)
        {
            SqlCommand command = new SqlCommand("stpMileStoneForExportToExcel");
            command.CommandType = System.Data.CommandType.StoredProcedure;
            command.Parameters.Add("@searchText", SqlDbType.VarChar).Value = value.searchText;
            command.Parameters.Add("@sortColumn", SqlDbType.VarChar).Value = value.sortColumn;
            command.Parameters.Add("@sortDirection", SqlDbType.VarChar).Value = value.sortDirection;
            var x = _milestone.GetRecords(command).ToList();

            var data = x.Where(k => k.RevisedDate >= value.fromDate && k.RevisedDate <= value.toDate).ToList();
            return data;
        }


        #endregion
        public class MilestoneResponse
        {
            public int count { get; set; }
            public List<Entities.MileStone> milestoneData { get; set; }
        }


        public class MileStonExport {

            public string MileStones { get; set; }
            public string Engagement_Name { get; set; }
            public decimal Amount { get; set; }
            public DateTime? PlannedDate { get; set; }
            public DateTime? RevisedDate { get; set; }
            public DateTime? CompletedDate { get; set; }
            public DateTime? InvoicedDate { get; set; }
            public bool  IsActive {get; set;}

             public DateTime? CreatedDate { get; set; }
        }

    }
}
