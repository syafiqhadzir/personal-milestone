using Microsoft.AspNetCore.Mvc;
using netcore_api_tutorial.Dtos;
using netcore_api_tutorial.Entities;
using netcore_api_tutorial.Repositories;

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
    }
}