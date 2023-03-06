using Microsoft.AspNetCore.Mvc;
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

        private readonly InMemItemsRepository repository;

        public ItemsController()
        {
            repository = new InMemItemsRepository();
        }

        // GET: /items
        [HttpGet]
        public IEnumerable<Item> GetItems()
        {
            var items = repository.GetItems();
            return items;
        }

        // GET: /items/{id}
        [HttpGet("{id}")]
        public ActionResult<Item> GetItem(Guid id)
        {
            var item = repository.GetItem(id);

            if (item is null)
            {
                return NotFound();
            }

            return item;
        }
    }
}