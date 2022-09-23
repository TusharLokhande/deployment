using Prosares.Wow.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Services.PunchInOut
{
    public class PunchInOutService:IPunchInOutService
    {
        private readonly IRepository<Entities.PunchInOut> _punchInOutRepository;
        public PunchInOutService(IRepository<Entities.PunchInOut> punchInOutRepository)
        {
            _punchInOutRepository = punchInOutRepository;
        }

        public void InsertIntoPunchInOut(Entities.PunchInOut value)
        {
            try
            {
               _punchInOutRepository.Insert(value);

            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}
