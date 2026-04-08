using FileStorageService.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FileStorageService.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<DocumentRecord> Documents { get; set; }
}