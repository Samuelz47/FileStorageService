using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace FileStorageService.API.Services;

public class CloudinaryStorageService : IFileStorageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryStorageService(IConfiguration configuration)
    {
        var account = new Account(
            configuration["Cloudinary:CloudName"],
            configuration["Cloudinary:ApiKey"],
            configuration["Cloudinary:ApiSecret"]
        );
            
        _cloudinary = new Cloudinary(account);
    }
    public async Task<string> UploadFileAsync(IFormFile file)
    {
        //Uso do RawUploudResult() em vez do ImageUploudResult() é pq podemos aceitar arquivos .pdf
        var uploadResult = new RawUploadResult();
        
        //Transforma o arquivo da Web em Stream para enviar pela rede
        //Uso do "using" é para garantir que o stream seja fechado e liberado após o upload
        //Assim evitando que o Garbage Collector não fique cheio podendo derrubar o servidor
        using (var stream = file.OpenReadStream())
        {
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream)
            };
            
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }
        
        if (uploadResult.Error != null) 
            throw new Exception($"Erro ao enviar arquivo para Cloudinary: {uploadResult.Error.Message}");
        
        return uploadResult.SecureUri.ToString();
    }
}