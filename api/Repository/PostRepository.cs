using api.Data;
using api.DTO;
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

    /// <summary>
    /// Simple INSERT
    /// </summary>
    /// <param name="post"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
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


    /// <summary>
    /// Simple DELETE
    /// </summary>
    /// <param name="postId"></param>
    /// <returns></returns>
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

    /// <summary>
    /// Simple UPDATE
    /// </summary>
    /// <returns></returns>
    public async Task<int> UpdateViewCountOnPostsWithMoreComments()
    {
        return await dBContext.Posts
                .Where(p => p.Comments.Count > 5 && p.Score > 2 && p.ViewCount > 5)
                .ExecuteUpdateAsync(updates => updates
                    .SetProperty(p => p.ViewCount, p => p.ViewCount + 30)
                    .SetProperty(p => p.LastActivityDate, _ => DateTime.UtcNow));
    }

    public async Task<List<MostViewedPostsDTO>> GetMostPopularPostsByYear()
    {
        var posts = await dBContext.Posts
            .Include(p => p.OwnerUser)
            .Select(p => new
            {
                p.Id,
                p.ViewCount,
                Year = p.CreationDate.Year,
                p.CreationDate,
                p.LastEditDate,
                AuthorName = p.OwnerUser.DisplayName
            })
            .OrderByDescending(p => p.ViewCount)
            .ToListAsync();

        var top5PerYear = posts
        .GroupBy(p => p.Year)
        .SelectMany(g => g.Take(5))
        .Select(p => new MostViewedPostsDTO
        {
            Id = p.Id,
            ViewCount = p.ViewCount,
            CreationDate = p.CreationDate,
            LastEditDate = p.LastEditDate,
            DisplayNameAttribute = p.AuthorName
        })
        .ToList();

        return top5PerYear;
    }

    public async Task UpdatePostsScoreBasedOnComments()
    {
        var postsWithAvgScore = await dBContext.Posts
            .Where(p => p.Comments.Count > 50)
            .Select(p => new
            {
                p.Id,
                AverageCommentScore = p.Comments.Average(c => (double?)c.Score) ?? 0
            })
            .ToListAsync();

        var postIds = postsWithAvgScore.Select(x => x.Id).ToList();

        var posts = await dBContext.Posts
            .Where(p => postIds.Contains(p.Id))
            .ToListAsync();

        foreach (var post in posts)
        {
            var avg = postsWithAvgScore.First(x => x.Id == post.Id).AverageCommentScore;
            post.Score += (int)avg;
        }

        await dBContext.SaveChangesAsync();
    }
}