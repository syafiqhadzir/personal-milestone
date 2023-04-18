using Microsoft.AspNetCore.Mvc.RazorPages;

namespace netcore_razor_pages.Pages.Person
{
    public class CreateModel : PageModel
    {
        public string Name = "";
        private readonly IConfiguration _configuration;

        public CreateModel(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnGet()
        {
            Name = _configuration.GetValue<string>("MyName");
        }

        public void OnPost()
        {
        }
    }
}