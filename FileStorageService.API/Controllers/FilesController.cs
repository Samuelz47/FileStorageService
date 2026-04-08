using FileStorageService.API.Data;
using FileStorageService.API.Models;
using FileStorageService.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FileStorageService.API.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IFileStorageService _storageService;

    public FilesController(IFileStorageService storageService, AppDbContext context)
    {
        _storageService = storageService;
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFileAsync(IFormFile file)
    {
        if (file is null || file.Length == 0) return BadRequest("Nenhum arquivo encontrado");
        
        var allowedExtensions = new[] { ".jpg", ".png", ".pdf" };
        var extensions = Path.GetExtension(file.FileName).ToLower();
        
        if (!allowedExtensions.Contains(extensions)) return BadRequest("Extensão de arquivo não permitida");
        
        //Aqui enviamos o arquivo para a nuvem e enviaremos apenas o URL para o PostgreSQL
        string cloudUrl = await _storageService.UploadFileAsync(file);

        var documentRecord = new DocumentRecord
        {
            Name = file.FileName,
            Url = cloudUrl,
            Type = file.ContentType,
            Size = file.Length,
            CreatedAt = DateTime.UtcNow
        };
        
        _context.Documents.Add(documentRecord);
        await _context.SaveChangesAsync();
        
        return CreatedAtRoute("GetFile", new {id = documentRecord.Id}, documentRecord);
    }
    
    [HttpGet("{id}", Name = "GetFile")]
    public async Task<IActionResult> GetFileById(Guid id)
    {
        var document = await _context.Documents.FindAsync(id);
        if (document == null) return NotFound();
        return Ok(document);
    }
    
    [HttpGet]
    public IActionResult GetAllFiles()
    {
        var documents = _context.Documents.OrderByDescending(d => d.CreatedAt).ToList();
        return Ok(documents);
    }
}