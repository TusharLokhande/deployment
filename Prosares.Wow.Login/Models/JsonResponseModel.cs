namespace WowLoginModule.Models
{
    public class JsonResponseModel
    {
        public ApiStatus Status { get; set; }

        public string Message { get; set; }

        public object Data { get; set; }
    }

    public enum ApiStatus
    {
        OK,
        Error,
        OutOfTime
    }
}
