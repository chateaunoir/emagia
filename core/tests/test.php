<?php

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <h1>Collision detection</h1>
        <div id="dashboard">
            <p id="health">-</p>
            <p id="strength">-</p>
            <p id="defence">-</p>
            <p id="speed">-</p>
            <p id="luck">-</p>
        </div>
        
        <script>
            var knightStats = []    // for temporary storage - Knights Stats;

            // This function builds the objects in both the knightStats and levelMonsters arrays;
            function player_matrix(id, type, health, strength, defence, speed, luck) 
            {
                this.ID = id;
                this.TP = type;
                this.STATS = new player_stats(health, strength, defence, speed, luck)
            }

            function player_stats(health, strength, defence, speed, luck)
            {
                this.HP = health;
                this.ST = strength;
                this.DF = defence;
                this.SP = speed;
                this.LK = luck;
            }
                        
            // *** WRITE IN ARRAY *********************************

            knightStats.push(new player_matrix(1, 'red_knight', 100, 90, 80, 70, 60));

            console.log(knightStats[0].STATS);

            // *** WRITE TO SCREEN *********************************

            function displayStats(whosStats){
                if(whosStats != undefined || whosStats != null || whosStats != '')
                {
                    document.getElementById("health").innerHTML = "HP: "+whosStats.HP;
                    document.getElementById("strength").innerHTML = "ST: "+whosStats.ST;
                    document.getElementById("defence").innerHTML = "DF: "+whosStats.DF;
                    document.getElementById("speed").innerHTML = "SP: "+whosStats.SP;
                    document.getElementById("luck").innerHTML = "LK: "+whosStats.LK;
                } else 
                {
                    console.log("There's been an error reading the stats")    
                    console.log(whosStats)    
                }
                
            }

            displayStats(knightStats[0].STATS);

            knightStats[0].STATS.HP = 10; 
            
            console.log(knightStats[0].STATS);

            displayStats(knightStats[0].STATS);
        </script>
    </body>
</html>
