namespace Lockena.Application.Common
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T? Value { get; set; }
        public string[]? Errors { get; set; }
        public int Status { get; set; }

        public static Result<T> Success(T value) =>
                new() { IsSuccess = true, Value = value, Status = 200 };

        public static Result<T> Failure(int status = 400, params string[]? errors) =>
                new() { IsSuccess = false, Errors = errors, Status = status };
    }
}
