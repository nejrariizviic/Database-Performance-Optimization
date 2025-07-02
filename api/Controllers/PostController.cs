using api.Repository;
using Microsoft.AspNetCore.Mvc;
using api.DTO;
using api.Models;

namespace api.Controllers
{
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {

        private readonly IPostRepository postRepository;

        public PostController(IPostRepository postRepository)
        {
            this.postRepository = postRepository;
        }

        [HttpGet("popular-posts-by-year")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPopularCommentatorsAsync()
        {
            var popularUsers = await postRepository.GetMostPopularPostsByYear();
            return Ok(popularUsers);
        }

        [HttpPut("update-posts-based-on-score")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePostsScoreBasedOnCommentsScore()
        {
            try
            {
                await postRepository.UpdatePostsScoreBasedOnComments();
                return Ok("Posts successfully updated.");
            }
            catch (Exception ex)
            {
                throw new Exception("Please try again later, unexpected error occured. " + ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDTO createPostDTO, int userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Post post = new()
            {
                Title = createPostDTO.Title,
                Body = createPostDTO.Body,
                PostTypeId = createPostDTO.PostTypeId,
                CreationDate = DateTime.UtcNow,
                LastEditDate = DateTime.UtcNow,
                AnswerCount = 0,
                CommentCount = 0,
                FavoriteCount = 0,
                OwnerUserId = userId,
                LastEditorUserId = userId,
                LastActivityDate = DateTime.UtcNow,
                Score = 0,
                ViewCount = 0
            };

            try
            {
                var postIdCreated = await postRepository.CreatePostAsync(post, userId);
                return Ok(postIdCreated);
            }
            catch (Exception ex)
            {
                throw new Exception("Please try again later, unexpected error occured. " + ex.Message);
            }
        }

        [HttpPut("update-views-on-posts-with-comments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateViewCountOnPosts()
        {
            try
            {
                var updatedPosts = await postRepository.UpdateViewCountOnPostsWithMoreComments();
                return Ok($"Number of updated posts: {updatedPosts}");
            }
            catch (Exception ex)
            {
                throw new Exception("Please try again later, unexpected error occured. " + ex.Message);
            }
        }

        [HttpDelete("delete-post/{postId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeletePost(int postId)
        {
            try
            {
                await postRepository.DeletePostWithComments(postId);
                return Ok("Post successfully deleted!");
            }
            catch (Exception ex)
            {
                throw new Exception("Please try again later, unexpected error occured. " + ex.Message);
            }
        }
    }
}