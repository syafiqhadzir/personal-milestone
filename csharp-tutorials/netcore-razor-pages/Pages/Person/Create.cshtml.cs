using Microsoft.AspNetCore.Mvc.RazorPages;

namespace netcore_razor_pages.Pages.Person
{
    public class CreateModel : PageModel
    {
        public string Name = "";

        public void OnGet()
        {
            Name = "John Doe";
        }

        public void OnPost()
        {
        }
    }
}