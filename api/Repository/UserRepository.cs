using api.Data;
using api.DTO;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class UserRepository : IUserRepository
{
    private readonly DBContext _context;

    public UserRepository(DBContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Complex INSERT
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task<int> CreateUserWithQuestionAndAnswerAsync(User user)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            var post = new Post
            {
                Title = "How to implement transactions with EF Core ?",
                Body = "I'm new to the EF Core. Can you explain how to implement transactions with this tool (also include the best practices).",
                PostTypeId = 1,
                AnswerCount = 2,
                CommentCount = 2,
                CreationDate = DateTime.UtcNow,
                Score = 0,
                Tags = "entity-framework, asp.net-core, web-api, rest-api, sql-server",
                FavoriteCount = 0,
                LastActivityDate = DateTime.UtcNow,
                ViewCount = 30,
                OwnerUserId = user.Id,
                LastEditorDisplayName = user.DisplayName
            };

            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();

            var comments = new List<Comment>
            {
                new()
                {
                    Text = "EF Core supports transactions via Database.BeginTransactionAsync. It's useful when you need to group multiple operations atomically.",
                    CreationDate = DateTime.UtcNow,
                    PostId = post.Id,
                    UserId = user.Id,
                    Score = 3,
                },
                new() {
                    Text = "Remember to call SaveChanges within the transaction scope, otherwise changes won't be committed properly.",
                    CreationDate = DateTime.UtcNow,
                    PostId = post.Id,
                    UserId = user.Id,
                    Score = 3
                }
            };

            await _context.Comments.AddRangeAsync(comments);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return user.Id;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    /// <summary>
    /// Complex DELETE
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public async Task<int> DeleteUserAndHisLowViewPostsAndCommentsAsync(int userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found.");

            var userComments = await _context.Comments
                .Where(c => c.UserId == userId)
                .ToListAsync();
            _context.Comments.RemoveRange(userComments);

            var userPosts = await _context.Posts
                .Where(p => p.OwnerUserId == userId)
                .ToListAsync();

            var commentsForUserPosts = await _context.Comments
                .Where(c => userPosts.Select(p => p.Id).Contains(c.PostId))
                .ToListAsync();

            _context.Comments.RemoveRange(commentsForUserPosts);
            _context.Posts.RemoveRange(userPosts);
            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return userId;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    /// <summary>
    /// Simple SELECT
    /// </summary>
    /// <returns></returns>
    public async Task<List<PopularCommentatorsDTO>> GetPopularComentatorsAsync()
    {
        var topCommenters = await _context.Users
            .Where(u => u.Comments.Any())
            .Select(u => new PopularCommentatorsDTO
            {
                Id = u.Id,
                DisplayName = u.DisplayName,
                CreationDate = u.CreationDate,
                CommentsCount = u.Comments.Count(),
                LastCreationDate = u.Comments
                    .OrderByDescending(c => c.CreationDate)
                    .Select(c => c.CreationDate)
                    .FirstOrDefault()

            })
            .OrderByDescending(u => u.CommentsCount)
            .Take(10)
            .ToListAsync();

        return topCommenters;
    }
}