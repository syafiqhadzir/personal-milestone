using Microsoft.AspNetCore.Mvc;
using netcore_api_tutorial.Dtos;
using netcore_api_tutorial.Entities;
using netcore_api_tutorial.Repositories;
using System.Data;

namespace netcore_api_tutorial.Controllers
{
    // GET: /items

    [ApiController]
    [Route("items")] //[controller]
    public class ItemsController : ControllerBase
    {
        /* # Controlelr vs ControllerBase
         * - Controller is a higher-level class that inherits from ControllerBase.
         * - The Controller class includes additional functionality such as "render views, JSON helpers, and action filters".
         * - The ControllerBase class provides the basic functionality for handling HTTP requests such as "access to underlying HTTP context, request, response and URL".
         */

        private readonly IItemsRepository repository;

        public ItemsController(IItemsRepository repository) => this.repository = repository;

        // GET: /items
        [HttpGet]
        public IEnumerable<ItemDto> GetItems()
        {
            var items = repository.GetItems().Select(item => item.AsDto());

            return items;
        }

        // GET: /items/{id}
        [HttpGet("{id}")]
        public ActionResult<ItemDto> GetItem(Guid id)
        {
            var item = repository.GetItem(id);

            if (item is null)
            {
                return NotFound();
            }

            return item.AsDto();
        }

        // POST /items
        [HttpPost]
        public ActionResult<ItemDto> CreateItem(CreateItemDto itemDto)
        {
            Item item = new()
            {
                Id = Guid.NewGuid(),
                Name = itemDto.Name,
                Price = itemDto.Price,
                CreateDate = DateTimeOffset.UtcNow
            };
            repository.CreateItem(item);

            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, item.AsDto());
        }

        // PUT /items/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateItem(Guid id, UpdateItemDto itemDto)
        {
            var existingItem = repository.GetItem(id);

            if (existingItem is null)
            {
                return NotFound();
            }

            Item updatedItem = existingItem with
            {
                Name = itemDto.Name,
                Price = itemDto.Price
            };
            repository.UpdateItem(updatedItem);

            return NoContent();
        }

        // DELETE /items/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteItem(Guid id)
        {
            var existingItem = repository.GetItem(id);

            if (existingItem is null)
            {
                return NotFound();
            }

            repository.DeleteItem(id);

            return NoContent();
        }
    }
}