using api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/index")]
    [ApiController]
    public class IndexController : ControllerBase
    {
        private readonly DBContext _context;

        public IndexController(DBContext dBContext)
        {
            _context = dBContext;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateIndexes()
        {
            var sql = @"
                CREATE NONCLUSTERED INDEX IX_Users_Id_DisplayName_CreationDate ON Users (Id, DisplayName, CreationDate);
                CREATE NONCLUSTERED INDEX IX_Users_DisplayName ON Users (DisplayName);

                CREATE NONCLUSTERED INDEX IX_Posts_OwnerUserId ON Posts (OwnerUserId);
                CREATE NONCLUSTERED INDEX IX_Posts_Id_Score_ViewCount ON Posts (Id, Score, ViewCount);
                CREATE NONCLUSTERED INDEX IX_Posts_CreationDate_ViewCount ON Posts (CreationDate, ViewCount);

                CREATE NONCLUSTERED INDEX IX_Comments_UserId ON Comments (UserId);
                CREATE NONCLUSTERED INDEX IX_Comments_PostId ON Comments (PostId);
                CREATE NONCLUSTERED INDEX IX_Comments_PostId_Score ON Comments (PostId, Score);
            ";

            await _context.Database.ExecuteSqlRawAsync(sql);
            return Ok("Success.");
        }

        [HttpPost("drop")]
        public async Task<IActionResult> DropIndexes()
        {
            var dropSql = @"
                DROP INDEX IF EXISTS IX_Users_Id_DisplayName_CreationDate ON Users;
                DROP INDEX IF EXISTS IX_Users_DisplayName ON Users;

                DROP INDEX IF EXISTS IX_Posts_OwnerUserId ON Posts;
                DROP INDEX IF EXISTS IX_Posts_Id_Score_ViewCount ON Posts;
                DROP INDEX IF EXISTS IX_Posts_CreationDate_ViewCount ON Posts;

                DROP INDEX IF EXISTS IX_Comments_UserId ON Comments;
                DROP INDEX IF EXISTS IX_Comments_PostId ON Comments;
                DROP INDEX IF EXISTS IX_Comments_PostId_Score ON Comments;
            ";

            await _context.Database.ExecuteSqlRawAsync(dropSql);
            return Ok("Success.");
        }

    }
}
