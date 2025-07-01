using api.Data;
using api.DTO;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class UserRepository : IUserRepository
{
    private readonly DBContext _context;

    public UserRepository(DBContext context)
    {
        _context = context;
    }

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
