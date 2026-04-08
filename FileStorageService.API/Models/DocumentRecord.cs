namespace FileStorageService.API.Models;

public class DocumentRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public long Size { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}