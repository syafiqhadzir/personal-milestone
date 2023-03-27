using netcore_api_tutorial.Entities;

namespace netcore_api_tutorial.Repositories
{
    public interface IItemsRepository
    {
        Item GetItem(Guid id);

        IEnumerable<Item> GetItems();

        void CreateItem(Item item);

        void UpdateItem(Item item);

        void DeleteItem(Guid id);
    }
}