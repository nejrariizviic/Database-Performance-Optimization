
namespace api.DTO;

public class PopularCommentatorsDTO
{
    public int Id { get; set; }
    public string DisplayName { get; set; }
    public DateTime CreationDate { get; set; }
    public int CommentsCount { get; set; }
    public DateTime LastCreationDate { get; set; }
}
