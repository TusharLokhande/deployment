using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.ResourceCapacity;
using System.IO;
using System;
using System.Collections.Generic;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq;
using Prosares.Wow.Data.Entities;

namespace Prosares.Wow.Web.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]

    public class ResourceCapacityController : ControllerBase
    {
        private readonly IResourceCapacity _ResourceReport;


        public  ResourceCapacityController(IResourceCapacity Resource)
            {
            _ResourceReport = Resource;
            }

        [HttpPost]

        public JsonResponseModel GetResourceCapacity([FromBody] ResourceCapacityModel value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _ResourceReport.GetResourceCapacity(value);
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


        public dynamic ExportToExcel([FromBody] ResourceCapacityModel value)
        {
            ResourceCapacityResponse res = _ResourceReport.GetResourceCapacity(value);
            var data = res.data;
            
            byte[] dataBytes;
            MemoryStream ms = new MemoryStream();
            if (data == null)
            {
                throw new ArgumentNullException("stream");
            }
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var xlPackage = new ExcelPackage(ms))
            {
                var worksheet = xlPackage.Workbook.Worksheets.Add("Report");
                var properties = Array.Empty<object>();
             
                 properties = new[]
                    {
                      "T&M", "AMC","Project", "Product", "Internal","Spare", "Total",
                        "T&M", "AMC","Project", "Product", "Internal","Non-Chargeable","Leaves","Spare", "Total",
                    };

                var map = new Dictionary<string, string>();
                map.Add("A1", "A2");
                map.Add("B1", "h1");
                map.Add("I1", "Q1");

                worksheet.Cells[$"A1:A2"].Value = "Resource";
                worksheet.Cells[$"B1:H1"].Value = "Planned Days";
                worksheet.Cells["I1:Q1"].Value = "Actual Mandays";

                foreach (var item in map)
                {
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Merge = true;
                    //Bold Text
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Font.Bold = true;

                    //Border
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    //Border Color
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Top.Color.SetColor(Color.Black);
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Bottom.Color.SetColor(Color.Black);
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Right.Color.SetColor(Color.Black);
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Border.Left.Color.SetColor(Color.Black);

                    //center alignment of text
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    //Set Font Size
                    worksheet.Cells[$"{item.Key}:{item.Value}"].Style.Font.Size = 12;
                }

                int c = 2;
                foreach (var i in properties)
                {
                    worksheet.Cells[2, c].Value = i;
                    //Bold Text
                    worksheet.Cells[2,c].Style.Font.Bold = true;

                    //Border
                    worksheet.Cells[2,c].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[2,c].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[2,c].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    worksheet.Cells[2,c].Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    //Border Color
                    worksheet.Cells[2,c].Style.Border.Top.Color.SetColor(Color.Black);
                    worksheet.Cells[2,c].Style.Border.Bottom.Color.SetColor(Color.Black);
                    worksheet.Cells[2,c].Style.Border.Right.Color.SetColor(Color.Black);
                    worksheet.Cells[2,c].Style.Border.Left.Color.SetColor(Color.Black);

                    //center alignment of text
                    worksheet.Cells[2,c].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    worksheet.Cells[2,c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                    //Set Font Size
                    worksheet.Cells[2,c].Style.Font.Size = 12;
                    c++;
                }

                int row = 3;
                foreach (ResourceCapacityModel item in data)
                {
                    int col = 1;
                    worksheet.Cells[row, col].Value = item.Name;
                    col++;
                    worksheet.Cells[row, col].Value = item.PlannedTM; col++;
                    worksheet.Cells[row, col].Value = item.PlannedAMC; col++;
                    worksheet.Cells[row, col].Value = item.PlannedProject; col++;
                    worksheet.Cells[row, col].Value = item.PlannedProduct; col++;
                    worksheet.Cells[row, col].Value = item.PlannedInternal; col++;
                    worksheet.Cells[row, col].Value = item.Spare; col++;
                    worksheet.Cells[row, col].Value = item.PlannedTotal; col++;
                    worksheet.Cells[row, col].Value = item.ActualTM; col++;
                    worksheet.Cells[row, col].Value = item.ActualAMC; col++;
                    worksheet.Cells[row, col].Value = item.ActualProject; col++;
                    worksheet.Cells[row, col].Value = item.ActualProduct; col++;
                    worksheet.Cells[row, col].Value = item.ActualInternal; col++;
                    worksheet.Cells[row, col].Value = item.NonChargeable; col++;
                    worksheet.Cells[row, col].Value = item.Leaves; col++;
                    worksheet.Cells[row, col].Value = item.ActualSpare; col++;
                    worksheet.Cells[row, col].Value = item.ActualTotal; col++;
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
