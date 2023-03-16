using netcore_api_tutorial.Dtos;
using netcore_api_tutorial.Entities;

namespace netcore_api_tutorial
{
    public static class Extensions
    {
        public static ItemDto AsDto(this Item item)
        {
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                CreatedDate = item.CreateDate
            };
        }

    }
}
