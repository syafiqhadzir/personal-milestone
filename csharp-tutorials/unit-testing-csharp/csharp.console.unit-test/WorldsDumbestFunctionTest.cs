namespace csharp.console.unit_test.Tests
{
    public static class WorldsDumbestFunctionTest
    {
        // Naming Convention - ClassName_MethodName_ExpectedResult
        public static void WorldsDumbestFunction_ReturnsPikachuIfZero_ReturnsString()
        {
            try
            {
                // Arrange - Go get your variabes, whatever you need, your classes, functions etc.
                int num = 0;
                WorldsDumbestFunction worldsDumbest = new WorldsDumbestFunction();

                // Act - Execute this function
                string result = worldsDumbest.ReturnsPikachuIfZero(num);

                // Assert - Whatever ever is returned is it what you need
                if (result == "PIKACHU")
                    Console.WriteLine("PASSED: WorldsDumbestFunction_ReturnsPikachuIfZero_ReturnsString");
                else
                    Console.WriteLine("FAILED: WorldsDumbestFunction_ReturnsPikachuIfZero_ReturnsString");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
    }
}