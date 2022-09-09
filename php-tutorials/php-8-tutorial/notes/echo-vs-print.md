**Echo vs Print**

<kbd>echo</kbd> and <kbd>print</kbd> are more or less the same. They are both used to output data to the screen.

The differences are small: <kbd>echo</kbd> has no return value while <kbd>print</kbd> has a return value of 1 so it can be used in expressions. <kbd>echo</kbd> can take multiple parameters (although such usage is rare) while <kbd>print</kbd> can take one argument. <kbd>echo</kbd> is marginally faster than <kbd>print</kbd>.

The <kbd>echo</kbd> statement can be used with or without parentheses: <kbd>echo</kbd> or <kbd>echo()</kbd>.

    ```php
    <?php

    echo "<h2>PHP is Fun!</h2>";
    echo "Hello world!<br>";
    echo "I'm about to learn PHP!<br>";
    echo "This ", "string ", "was ", "made ", "with multiple parameters.";
    ```
    ```php
    <!DOCTYPE html>

    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PHP in HTML</title>
    </head>
    <body>
        <?php
            // Comment 1
            # Comment 2
            /*
                Multi line
            */

            $x = 10;
            $y = 5;

            echo '<p>' . $x . ', ' . $y . '</p>';
        ?>
        <h1><?= 'Hello World!' ?></h1>
        <p>Testing</p>
    </body>
    </html>
    ```
