using api.Models;

namespace api.Repository;

public interface IPostRepository
{
    Task<int> CreatePostAsync(Post post, int userId);
    Task<int> UpdateViewCountOnPostsWithMoreComments();
    Task DeletePostWithComments(int postId);
}
