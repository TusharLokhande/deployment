using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Milestone;
using Prosares.Wow.Data.Services.MilestoneReport;
using Prosares.Wow.Data.Services.ResourceCapacity;
using System.IO;
using System;
using DocumentFormat.OpenXml.Spreadsheet;
using OfficeOpenXml.Style;
using System.Drawing;
using Color = System.Drawing.Color;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class MilestoneReportController : ControllerBase
    {

        private readonly IMileStoneReport _milestone;

       

        public MilestoneReportController(IMileStoneReport mileStone)
        {
            _milestone = mileStone;
        }

        [HttpPost]
        public dynamic GetMileStoneReportData([FromBody] MilestoneReportEntity value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _milestone.MilestoneDashboardData(value);
                apiResponse.Message = "Ok";
            }
            catch (System.Exception ex)
            {
                apiResponse.Status = ApiStatus.Error;
                apiResponse.Data = null;
                apiResponse.Message = ex.Message;

            }
            return apiResponse;
        }

        [HttpPost]
        public dynamic ExportToExcel([FromBody] MilestoneReportEntity value)
        {
            
            var data = _milestone.MilestoneDashboardData(value);

            byte[] dataBytes;
            MemoryStream ms = new MemoryStream();
            if (data == null)
            {
                throw new ArgumentNullException("stream");
            }
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var xlPackage = new ExcelPackage(ms))
            {
                var worksheet = xlPackage.Workbook.Worksheets.Add("Milestone Report");
                var properties = Array.Empty<object>();
                properties = new [] { "Engagement", "Engagement Type", "PO Value"," Milestone","Amount", 
                    "Planned Date", "Actual Date", "Invoice Date"};
                for (int i = 0; i < properties.Length; i++)
                {

                    worksheet.Cells[1, i + 1].Value = properties[i];

                    //Bold Text
                    worksheet.Cells[1, i + 1].Style.Font.Bold = true;

                    //Border
                    worksheet.Cells[1, i + 1].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[1, i + 1].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[1, i + 1].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[1, i + 1].Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    //Border Color

                    worksheet.Cells[1, i + 1].Style.Border.Top.Color.SetColor(Color.Black);
                    worksheet.Cells[1, i + 1].Style.Border.Bottom.Color.SetColor(Color.Black);
                    worksheet.Cells[1, i + 1].Style.Border.Right.Color.SetColor(Color.Black);
                    worksheet.Cells[1, i + 1].Style.Border.Left.Color.SetColor(Color.Black);

                    //center alignment of text
                    worksheet.Cells[1, i + 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    worksheet.Cells[1, i + 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    //Set Font Size
                    worksheet.Cells[1, i + 1].Style.Font.Size = 12;
                }

                int row = 2;
                foreach (MilestoneReportEntity item in data)
                {
                    int col = 1;
                    worksheet.Cells[row, col].Value = item.Engagement; col++;
                    worksheet.Cells[row, col].Value = item.EngagementType; col++;
                    worksheet.Cells[row, col].Value = item.POValue; col++;
                    worksheet.Cells[row, col].Value = item.MileStone; col++;
                    worksheet.Cells[row, col].Value = item.Amount; col++;
                    worksheet.Cells[row, col].Value = item.PlannedDate !=null ? item.PlannedDate : ""; col++;
                    worksheet.Cells[row, col].Value = item.RevisedDate != null? item.RevisedDate :""; col++;
                    worksheet.Cells[row, col].Value = item.InvoicedDate != null ? item.InvoicedDate : "" ; col++;
                    row++;
                }

                worksheet.Cells.AutoFitColumns();

                xlPackage.Save();
                dataBytes = ms.ToArray();

            }
            return File(dataBytes, "text/xls", "" + "" + "" + DateTime.Now.ToString() + ".xlsx");
        }
    }
}
