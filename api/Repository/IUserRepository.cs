using api.DTO;
using api.Models;

namespace api.Repository;

public interface IUserRepository
{
    Task<List<PopularCommentatorsDTO>> GetPopularComentatorsAsync();
    Task<int> CreateUserWithQuestionAndAnswerAsync(User user);
    Task<int> DeleteUserAndHisLowViewPostsAndCommentsAsync(int userId);
}