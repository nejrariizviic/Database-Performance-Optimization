using api.Data;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class PostRepository : IPostRepository
{
    private readonly DBContext dBContext;

    public PostRepository(DBContext dBContext)
    {
        this.dBContext = dBContext;
    }
    public async Task<int> CreatePostAsync(Post post, int userId)
    {
        using var transaction = await dBContext.Database.BeginTransactionAsync();

        try
        {
            var userById = await dBContext.Users.FindAsync(userId);
            if (userById != null)
            {
                post.LastEditorDisplayName = userById.DisplayName;
            }

            await dBContext.Posts.AddAsync(post);
            await dBContext.SaveChangesAsync();

            var comment1 = new Comment
            {
                PostId = post.Id,
                UserId = userId,
                Text = "First comment",
                CreationDate = DateTime.UtcNow
            };

            var comment2 = new Comment
            {
                PostId = post.Id,
                UserId = userId,
                Text = "Second comment",
                CreationDate = DateTime.UtcNow
            };

            await dBContext.Comments.AddRangeAsync(comment1, comment2);
            post.CommentCount = 2;
            await dBContext.SaveChangesAsync();

            await transaction.CommitAsync();

            return post.Id;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task DeletePostWithComments(int postId)
    {
        using var transaction = await dBContext.Database.BeginTransactionAsync();

        try
        {
            var post = await dBContext.Posts.FindAsync(postId);
            if (post == null)
                throw new Exception("Post not found.");

            var comments = dBContext.Comments.Where(c => c.PostId == postId);
            dBContext.Comments.RemoveRange(comments);

            dBContext.Posts.Remove(post);

            await dBContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<int> UpdateViewCountOnPostsWithMoreComments()
    {
        return await dBContext.Posts
                .Where(p => p.Comments.Count > 5 && p.Score > 2 && p.ViewCount > 5)
                .ExecuteUpdateAsync(updates => updates
                    .SetProperty(p => p.ViewCount, p => p.ViewCount + 1)
                    .SetProperty(p => p.LastActivityDate, _ => DateTime.UtcNow));
    }
}
