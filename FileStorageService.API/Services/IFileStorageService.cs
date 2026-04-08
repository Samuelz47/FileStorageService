namespace FileStorageService.API.Services;

public interface IFileStorageService
{
    Task<string> UploadFileAsync(IFormFile file);
}