using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Prosares.Wow.Data.Helpers.ExportToExcel
{
    public interface IExcelExportService
    {
        public void ExportDataSet(DataSet ds, string destination);
    }
}
