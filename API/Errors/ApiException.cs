namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int statusCode, string message, string exceptionDetails)
        {
            StatusCode = statusCode;
            Message = message;
            ExceptionDetails = exceptionDetails;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string ExceptionDetails { get; set; }
    }
}
