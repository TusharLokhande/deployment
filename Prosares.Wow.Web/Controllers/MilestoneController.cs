using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.Milestone;
using System;
using System.Drawing;
using System.IO;
using static Prosares.Wow.Data.Services.Milestone.MilestoneService;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class MilestoneController : ControllerBase
    {
        #region Fields

        private readonly IMilestoneService _milestoneService;
        #endregion

        #region Constructor
        public MilestoneController(IMilestoneService milestoneService)
        {
            _milestoneService = milestoneService;

        }

        #endregion

        #region Methods

        [HttpPost]
        public JsonResponseModel getMilestoneData([FromBody] MileStone value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _milestoneService.GetMilestoneData(value);
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
        public JsonResponseModel CheckIfMilestoneExists([FromBody] MileStone value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _milestoneService.CheckIfMilestoneExists(value.MileStones);
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
        public JsonResponseModel insertUpdateMilestoneData([FromBody] MileStone value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                _milestoneService.InsertUpdateMilestoneData(value);
                apiResponse.Data = "Ok";
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
        public JsonResponseModel getMilestoneDataById([FromBody] MileStone value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _milestoneService.GetMilestoneById(value);
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


        public dynamic ExportToExcel([FromBody] MileStone value)
        {
            var data = _milestoneService.ExportToExcel(value);
            byte[] dataBytes;
            MemoryStream ms = new MemoryStream();
            if (data == null)
            {
                throw new ArgumentNullException("stream");
            }
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var xlPackage = new ExcelPackage(ms))
            {
                var worksheet = xlPackage.Workbook.Worksheets.Add("Milestone");

                var properties = Array.Empty<object>();
                properties = new[]
                    {

                        "MileStone",
                        "Engagement_Name",
                        "Amount",
                        "PlannedDate",
                        "RevisedDate",
                        "CompletedDate",
                        "InvoiceDate",
                        "IsActive"
                    };

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
                foreach (var item in data)
                {
                    int col = 1;
                    worksheet.Cells[row, col].Value = item.MileStones;
                    col++;
                    worksheet.Cells[row, col].Value = item.Engagement_Name;
                    col++;
                    worksheet.Cells[row, col].Value = item.Amount;
                    col++;

                    worksheet.Cells[row, col].Value = item.PlannedDate != null ? (Convert.ToDateTime(item.PlannedDate)).ToString("dd/MMM/yyyy") : " ";
                    col++;

                    worksheet.Cells[row, col].Value = item.RevisedDate != null ? (Convert.ToDateTime(item.RevisedDate)).ToString("dd/MMM/yyyy") : " ";
                    col++;

                    worksheet.Cells[row, col].Value = item.CompletedDate != null ? (Convert.ToDateTime(item.CompletedDate)).ToString("dd/MMM/yyyy") : " ";
                    col++;

                    worksheet.Cells[row, col].Value = item.InvoicedDate != null ? (Convert.ToDateTime(item.InvoicedDate)).ToString("dd/MMM/yyyy") : " ";
                    col++;

                    worksheet.Cells[row, col].Value = item.IsActive;

                    if (item.IsActive)
                    {
                        worksheet.Cells[row, col].Value = "Yes";
                        col++;
                    }
                    else
                    {
                        worksheet.Cells[row, col].Value = "No";
                        col++;
                    }
                    row++;
                }
                worksheet.Cells.AutoFitColumns();

                xlPackage.Save();
                dataBytes = ms.ToArray();
            }
            return File(dataBytes, "text/xls", "" + "" + "" + DateTime.Now.ToString() + ".xlsx");
        }
        #endregion
    }
}
