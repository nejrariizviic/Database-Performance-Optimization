using api.DTO;

namespace api.Repository;

public interface IUserRepository
{
    Task<List<PopularCommentatorsDTO>> GetPopularComentatorsAsync();
}
