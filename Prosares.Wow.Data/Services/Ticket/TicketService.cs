using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Prosares.Wow.Data.DBContext;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.Ticket
{
    public class TicketService : ITicketService
    {
        #region Prop
        private readonly IRepository<TicketsMaster> _ticket;

        private readonly ILogger<TicketService> _logger;

        private readonly SqlDbContext _context;
        #endregion

        #region Constructor
        public TicketService(IRepository<TicketsMaster> Ticket,
                        ILogger<TicketService> logger, SqlDbContext context)
        {
            _ticket = Ticket;
            _logger = logger;
            _context = context;

        }
        #endregion

        #region Methods
        public long InsertUpdateTicketDetails(TicketsMaster value)
        {
            try
                {
                TicketsMaster data = new TicketsMaster();

                data.Id = value.Id;

                if (value.Id == 0) // Insert in DB
                {
                    //data.NoChargesReason = value.NoChargesReason;-- table master new 

                    //data.ApplicationId = value.ApplicationId; --Engagement-Appid
                    //data.PhaseId = value.PhaseId; --Egagement-PhaseId

                    //data.TaskUid = value.TaskUid;
                    //data.TaskTitle = value.TaskTitle;

                    //data.TicketStatus = value.TicketStatus;-- new table common for task and tkt
                    //data.ResponedDate = value.ResponedDate;

                    //data.HoursAssigned = value.HoursAssigned;-- allocation
                    //data.HoursSpent = value.HoursSpent;-- allocation
                    TicketsMaster response = _ticket.InsertAndGet(value);
                    return response.Id;
                }
                else if (value.Id != 0)
                {
                    _ticket.Update(value);
                    return value.Id;
                }
                return 0;
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

                sqlQuery = "spGetAutoPopulatedEngagementDataForTicket @EngagementId, @FromDate ,@ToDate";

                var Data = _context.AutoPopulateResponseSet.FromSqlRaw(sqlQuery, sqlParameters.ToArray()).ToList();

                return Data[0];
            }
            catch (Exception ex)
            {

                throw;
            }
            return null;

        }
        #endregion
    }
}
