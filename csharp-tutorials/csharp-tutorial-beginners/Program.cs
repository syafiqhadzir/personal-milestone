using System;

namespace Tutorial
{
    class Program
    {
        static void Main(string[] args)
        {
            // Variables declaration
            string characterName = "Tom";
            int characterAge;

            characterAge = 25;

            Console.WriteLine("There once was a man named " + characterName);
            Console.WriteLine("He was " + characterAge + " years old");

            characterName = "Mike";
            Console.WriteLine("He really liked the name " + characterName);
            Console.WriteLine("But didn't like being " + characterAge);

            Console.ReadLine();

            // Data Types
            string phrase = "Giraffe Academy";
            char grade = 'A';
            int age = 30;
            float money = 1.232F;    // Float - 7 digits (32 bit)
            double calc = 1.2;      // Double - 15-16 digits (64 bit)
            decimal pi = 22.7M;       // Decimal - 28-29 significant digits (128 bit)
            bool isMale = true;

            // Working w/ Strings
            Console.WriteLine(phrase);
            Console.WriteLine(grade);
            Console.WriteLine(age);
            Console.WriteLine(money);
            Console.WriteLine(calc);
            Console.WriteLine(pi);
            Console.WriteLine(isMale);

            Console.WriteLine(phrase.Length);
            Console.WriteLine(phrase.ToUpper());
            Console.WriteLine(phrase.ToLower());
            Console.WriteLine(phrase.Contains("Girrafe")); // Boolean
            Console.WriteLine(phrase.IndexOf("f"));
            Console.WriteLine(phrase[2]);
            Console.WriteLine(phrase.Substring(8, 9));

            Console.ReadLine();
        }
    }
}
