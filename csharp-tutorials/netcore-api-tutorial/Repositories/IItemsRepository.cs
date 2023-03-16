using netcore_api_tutorial.Entities;

namespace netcore_api_tutorial.Repositories
{
    public interface IItemsRepository
    {
        Item GetItem(Guid id);
        IEnumerable<Item> GetItems();
    }
}
