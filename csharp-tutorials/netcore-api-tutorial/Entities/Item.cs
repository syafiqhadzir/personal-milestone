namespace netcore_api_tutorial.Entities
{
    public record Item
    {
        /*
         * # Note: Record Types
         * - Used for immutable objects
         * - with-expression support
         * - value-based equality support
         */

        public Guid Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public DateTimeOffset CreateDate { get; init; }
    }
}