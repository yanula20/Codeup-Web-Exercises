<!DOCTYPE html>
<html>
<head>
    <title>Defuse the BOM</title>
    
</head>
<body>
    <h2 id="message">This BOM will self destruct in <span id="timer">5</span> seconds...</h2>

    <button id="defuser">Defuse the BOM</button>
    <img src="/gif/explosion.gif" style="display: none">
    <script>
        var detonationTimer = 5;
        var interval = 1000;

        // TODO: This function needs to be called once every second
        function updateTimer()
        {
            if (detonationTimer == 0) {

                document.getElementsByTagName("img")[0].style.display = "block";

                // the [0] above is because JS will place any getElement"s" into an
                // an array behind the scenes!!!
            } else if (detonationTimer > 0) {
                document.getElementById('timer').innerHTML = detonationTimer;

            }

            detonationTimer--;
        }
         var intervalId = setInterval(updateTimer,interval);
        // TODO: When this function runs, it needs to
        // cancel the interval/timeout for updateTimer()
        function defuseTheBOM()
        {
            clearInterval(intervalId);
            alert("You are safe!")
        }

        // Don't modify anything below this line!
        //
        // This causes the defuseTheBOM() function to be called
        // when the "defuser" button is clicked.
        // We will learn about events in the DOM lessons
        var defuser = document.getElementById('defuser');
        defuser.addEventListener('click', defuseTheBOM, false);
    </script>
</body>
</html>
