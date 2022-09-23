using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prosares.Wow.Data.Entities;
using Prosares.Wow.Data.Models;
using Prosares.Wow.Data.Services.LeaveRequest;
using System.IO;
using System;
using static Prosares.Wow.Data.Services.LeaveRequest.LeaveRequestMasterService;
using System.Collections.Generic;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using System.Drawing;

namespace Prosares.Wow.Web.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        #region Fields

        private readonly ILeaveRequestMasterService _leaveRequestMasterService;
        #endregion

        #region Constructor
        public LeaveRequestController(ILeaveRequestMasterService leaveRequestMasterService)
        {
            _leaveRequestMasterService = leaveRequestMasterService;
        }

        #endregion

        #region Method

        [HttpPost]
        public JsonResponseModel GetLeaveReqMasterMasterGridData([FromBody] LeaveRequestsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _leaveRequestMasterService.GetLeaveReqMasterMasterGridData(value);//value
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
        public JsonResponseModel GetLeaveRequestMasterById([FromBody] LeaveRequestsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _leaveRequestMasterService.GetLeaveRequestMasterById(value);
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
        public JsonResponseModel insertUpdateLeaveRequestMasterData([FromBody] LeaveRequestsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {
                //validation
                if(value.Id == 0 && value.RequestorId == value.CreatedBy && value.FromDate.Date < DateTime.Now.Date)
                {
                    apiResponse.Status = ApiStatus.Error;
                    apiResponse.Data = null;
                    apiResponse.Message = "Leave Request fail";

                    return apiResponse;
                }
                else { 
                    apiResponse.Status = ApiStatus.OK;
                    apiResponse.Data = _leaveRequestMasterService.InsertUpdateLeaveRequestMasterData(value);
                    apiResponse.Message = "Ok";
                }
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
        public JsonResponseModel getPendingLeavesById([FromBody] LeaveRequestsMaster value)
        {
            JsonResponseModel apiResponse = new JsonResponseModel();
            try
            {

                apiResponse.Status = ApiStatus.OK;
                apiResponse.Data = _leaveRequestMasterService.GetPendingLeavesById(value);
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

        public ActionResult LeaveExportToExcel([FromBody] LeaveRequestsMaster value)
        {
            try
            {
                if (value != null)
                {

                    LeaveRequestsMasterResponse data = _leaveRequestMasterService.GetLeaveReqMasterMasterGridData(value);
                    byte[] bytes;

                    using (var stream = new MemoryStream())
                    {
                        ExportToExcelForLeave(stream, data.leaveRequestsMasterData);
                        bytes = stream.ToArray();

                    }
                    return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8", "LeaveGrid_" + DateTime.Now.ToString() + ".xlsx");

                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [NonAction]
        private void ExportToExcelForLeave(MemoryStream stream, List<LeaveRequestsMaster> leaveRequestsMasterData)
        {
            if (stream == null)
                throw new ArgumentNullException("stream");

            //run the real code of the sample now
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var xlPackage = new ExcelPackage(stream))
            {
                // get handle to the existing worksheet

                var worksheet = xlPackage.Workbook.Worksheets.Add("Leaves");

                //Create Headers and format them+
                var properties = Array.Empty<object>();

                properties = new[]
                {
                        "Approver Name",
                        "Requestor Name",
                        "From Date",
                        "From Date Leave Type",
                        "To Date",
                        "To Date Leave Type",
                        "Leave Days",
                        "Leave Type",
                        "Request Status",
                        "Reason",
                        "Remark",
                        "FYI Users/CC",
                        "Created By",
                        "Created Date"
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

                foreach (var item in leaveRequestsMasterData)
                {
                    int col = 1;

                    //worksheet.Cells[row, col].Value = item.Id;
                    //col++;

                    worksheet.Cells[row, col].Value = item.ApproverName;
                    col++;

                    worksheet.Cells[row, col].Value = item.RequesterName;
                    col++;

                    worksheet.Cells[row, col].Value = (Convert.ToDateTime(item.FromDate)).ToString("dd/MMM/yyyy");
                    col++;

                    if (item.FromDateLeaveType == 1) {
                        worksheet.Cells[row, col].Value = "Full Day";
                        col++;
                    }
                    else
                    {
                        worksheet.Cells[row, col].Value = "Half Day";
                        col++;
                    }
                   

                    worksheet.Cells[row, col].Value = (Convert.ToDateTime(item.ToDate)).ToString("dd/MMM/yyyy");
                    col++;

                    if (item.ToDateLeaveType == 1)
                    {
                        worksheet.Cells[row, col].Value = "Full Day";
                        col++;
                    }
                    else
                    {
                        worksheet.Cells[row, col].Value = "Half Day";
                        col++;
                    }


                    worksheet.Cells[row, col].Value = item.LeaveDays;
                    col++;

                    worksheet.Cells[row, col].Value = item.LeaveTypeName;
                    col++;

                    if (item.RequestStatus == 1)
                    {
                        worksheet.Cells[row, col].Value = "Approved";
                        col++;
                    }
                    else if (item.RequestStatus == 2)
                    {
                        worksheet.Cells[row, col].Value = "Rejected";
                        col++;
                    }
                    else if (item.RequestStatus == 3)
                    {
                        worksheet.Cells[row, col].Value = "Pending";
                        col++;
                    }
                    else
                    {
                        worksheet.Cells[row, col].Value = "Cancelled";
                        col++;
                    }

                    worksheet.Cells[row, col].Value = item.LeavesReson;
                    col++;

                    worksheet.Cells[row, col].Value = item.Remark;
                    col++;

                    worksheet.Cells[row, col].Value = item.FYIUsersNames;
                    col++;

                    worksheet.Cells[row, col].Value = item.CreatedByName;
                    col++;

                    worksheet.Cells[row, col].Value = (Convert.ToDateTime(item.CreatedDate)).ToString("dd/MMM/yyyy");
                    col++;

                    row++;
                }

                worksheet.Cells.AutoFitColumns();

                xlPackage.Save();
            }
            #endregion
        }
    }
}
