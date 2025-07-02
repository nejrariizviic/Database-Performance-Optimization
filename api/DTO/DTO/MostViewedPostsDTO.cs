
namespace api.DTO;

public class MostViewedPostsDTO
{
    public int Id { get; set; }
    public int ViewCount { get; set; }
    public DateTime CreationDate { get; set; }
    public DateTime? LastEditDate { get; set; }
    public string DisplayNameAttribute { get; set; }
}
