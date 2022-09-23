using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Helpers;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.LeavesReson
{
    public class LeavesResonService : ILeavesResonService
    {
        #region Prop
        private readonly IRepository<LeavesResonMaster> _leaveReson;
        private readonly ILogger<LeavesResonService> _logger;
        #endregion

        #region Constructor
        public LeavesResonService(IRepository<LeavesResonMaster> LeavesReson, ILogger<LeavesResonService> logger)
        {
            _leaveReson = LeavesReson;
            _logger = logger;
        }
        #endregion

        #region Method

        public LeavesResonResponse GetLeaveResonMasterGridData(LeavesResonMaster value)
        {
            var data = new LeavesResonResponse();

            Expression<Func<Entities.LeavesResonMaster, bool>> InitialCondition;
            Expression<Func<Entities.LeavesResonMaster, bool>> SearchText;

            InitialCondition = k => k.Id != 0;

            if (value.searchText != null)
            {

                SearchText = k => k.LeavesReson.Contains(value.searchText);

            }
            else
            {
                SearchText = k => k.LeavesReson != "";
            }

            if (value.sortColumn == "" || value.sortDirection == "")
            {

                data.count = _leaveReson.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.leaveResonData = _leaveReson.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending("createdDate")).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "desc")
            {
                data.count = _leaveReson.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.leaveResonData = _leaveReson.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByPropertyDescending(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }
            else if (value.sortDirection == "asc")
            {
                data.count = _leaveReson.GetAll(b => b.Where(InitialCondition).Where(SearchText)).ToList().Count();
                data.leaveResonData = _leaveReson.GetAll(b => b.Where(InitialCondition).Where(SearchText).OrderByProperty(value.sortColumn)).Skip(value.start).Take(value.pageSize).ToList();
            }

            return data;
        }

        public dynamic InsertUpdateLeaveResonMasterData(Entities.LeavesResonMaster value)
        {
            LeavesResonMaster data = new LeavesResonMaster();

            data.Id = value.Id;

            if (data.Id == 0) // Insert in DB
            {
                data.LeavesReson = value.LeavesReson;
                //data.Abbreviation = value.Abbreviation;
                data.IsActive = value.IsActive;
                LeavesResonMaster response = _leaveReson.InsertAndGet(data);
                return response.Id;
            }

            // Update in DB
            var leaveReson = _leaveReson.GetById(value.Id);
            leaveReson.LeavesReson = value.LeavesReson;
            // customer.Abbreviation = value.Abbreviation;
            leaveReson.IsActive = value.IsActive;
            leaveReson.ModifiedDate = DateTime.UtcNow;
            _leaveReson.Update(leaveReson);
            return leaveReson.Id;

        }

        public LeavesResonMaster GetLeaveResonById(LeavesResonMaster value)
        {
            var LeavesReson = _leaveReson.GetById(value.Id);

            return LeavesReson;
        }


        //public dynamic DeleteLeaveResonData(Entities.LeavesResonMaster value)
        //{
        //    LeavesResonMaster data = new LeavesResonMaster();
           
        //    var leaveResonData = _leaveReson.GetById(value.Id);
        //    leaveResonData.IsActive = false;
        //    leaveResonData.ModifiedDate = DateTime.UtcNow;
        //    _leaveReson.Update(leaveResonData);
        //    return leaveResonData.Id;

        //}

        //public void DeleteLeaveReson(long id)
        //{
        //    var leavesReson = _leaveReson.GetById(id);
        //    if (leavesReson == null)
        //    {
        //        _leaveReson.Update(leavesReson);
        //    }
        //}

        #endregion

        #region Models

        public class LeavesResonResponse
        {
            public int count { get; set; }
            public List<Entities.LeavesResonMaster> leaveResonData { get; set; }
        }
        #endregion

    }
}
