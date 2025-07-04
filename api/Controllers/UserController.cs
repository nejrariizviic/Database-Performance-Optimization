using api.DTO;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository userRepository;

        public UserController(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        [HttpGet("popular-commentators")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPopularCommentatorsAsync()
        {
            var popularUsers = await userRepository.GetPopularComentatorsAsync();
            return Ok(popularUsers);
        }

        [HttpDelete("delete-user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUserWith(int userId)
        {
            if (userId == 0 || userId == -1) throw new Exception("Please provide valid user.");

            try
            {
                var userIdDeleted = await userRepository.DeleteUserAndHisLowViewPostsAndCommentsAsync(userId);
                return Ok(userIdDeleted);
            }
            catch (Exception ex)
            {
                throw new Exception("Please try again later, unexpected error occured. " + ex.Message);
            }
        }

        [HttpPost("insert-with-default-post")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateUserWithDefaultPostAsQuestion([FromBody] CreateUserDTO createUserDTO)
        {
            if (createUserDTO == null) return BadRequest("Please provide valid data.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                User userToCreate = new()
                {
                    DisplayName = createUserDTO.DisplayName,
                    EmailHash = createUserDTO.Email.GetHashCode().ToString(),
                    Location = createUserDTO.Location,
                    AboutMe = createUserDTO.AboutMe,
                    Age = createUserDTO.Age,
                    WebsiteUrl = createUserDTO.WebsiteUrl,
                    Views = 0,
                    CreationDate = DateTime.UtcNow,
                    LastAccessDate = DateTime.UtcNow,
                    Reputation = 0,
                    DownVotes = 0,
                    UpVotes = 0
                };

                var userIdCreated = await userRepository.CreateUserWithQuestionAndAnswerAsync(userToCreate);
                return Ok(userIdCreated);
            }
            catch (Exception ex)
            {
                throw new Exception("Please try again later, unexpected error occured. " + ex.Message);
            }
        }


    }
}