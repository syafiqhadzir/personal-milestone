using OpenQA.Selenium;

namespace RunGroopWebApp.Scraper.Interfaces
{
    internal interface IAtraScraper
    {
        IReadOnlyCollection<IWebElement> GetElements();

        void IterateOverRaceElements();

        void Run();
    }
}