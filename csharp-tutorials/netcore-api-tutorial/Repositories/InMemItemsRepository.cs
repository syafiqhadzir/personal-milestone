using netcore_api_tutorial.Entities;

namespace netcore_api_tutorial.Repositories
{

    public class InMemItemsRepository : IItemsRepository
    {
        private readonly List<Item> items = new()
        {
            new Item { Id=Guid.NewGuid(), Name="Potion", Price=9, CreateDate=DateTimeOffset.UtcNow },
            new Item { Id=Guid.NewGuid(), Name="Iron Sword", Price=20, CreateDate=DateTimeOffset.UtcNow },
            new Item { Id=Guid.NewGuid(), Name="Bronze Shield", Price=18, CreateDate=DateTimeOffset.UtcNow }
        };

        public IEnumerable<Item> GetItems()
        {
            return items;
        }

        public Item GetItem(Guid id)
        {
            return items.SingleOrDefault(item => item.Id == id);

            /* # Simplified LINQ Expression
             * example:-
             *    return items.SingleOrDefault(item => item.Id == id);
             * original:-
             *    items.Where(item => item.Id == id).SingleOrDefault();
             */
        }
    }
}