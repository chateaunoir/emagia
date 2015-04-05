<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title></title>
    </head>
    <body>
        <h1>Test 6</h1>
        <p>Hit F12 to watch the console</p>
        <script>
            var debug = true;
            function customDebug(message) {
                if (debug) console.log(message);
            }

            var probability = function (n) {
                n = n / 100;
                return !!n && Math.random() <= n;
            };

            var luck = function (value, result) {
                if (probability(value)) {
                    customDebug('Missed!');
                    return 0;
                } else {
                    return result;
                }
            };

            function attack(value, result) {
                if (probability(value)) {
                    customDebug('Double attack!');
                    return result * 2;
                } else {
                    return result;
                }
            };

            function defense(value, result) {
                if (probability(value)) {
                    customDebug('Double defence!');
                    return result * 2;
                } else {
                    return result;
                }
            };

            var hasLife = function (value) {
                return (value >= 0 ? true : false);
            }



            // Get info about "player 1"
            //      HP    ST    DF    SP    LK
            xpl = ['1000', '40', '21', '80', '21']; var pl1_skill_atk = 20; var pl1_skill_def = 20;

            //      HP    ST    DF    SP    LK
            // Get info about "player 2"
            xmn = ['1000', '38', '18', '71', '16']; var pl2_skill_atk = 20; var pl2_skill_def = 20;

            var pl1 = { hp: xpl[0], st: xpl[1], df: xpl[2], sp: xpl[3], lk: xpl[4] };
            var pl2 = { hp: xmn[0], st: xmn[1], df: xmn[2], sp: xmn[3], lk: xmn[4] };

            function battle(player1, player2) {

                var result = [];

                var i = 1;

                var kungfu = true;

                while (kungfu) {

                    customDebug('ROUND ' + i + ' FIGHT!');
                    customDebug('PL1: ' + player1.hp + ' | PL2: ' + player2.hp);

                    if (hasLife(player1.hp)) {
                        customDebug("________________ Player one's turn ___________________");
                        var p1_attack = attack(pl1_skill_atk, luck(player2.lk,player1.st));
                        var p2_defense = defense(pl2_skill_def, player2.df);

                        player2.hp = player2.hp - Math.max(0, (p1_attack - p2_defense));
                        customDebug('PL2 hits with ' + p1_attack + ' strength. PL1 defends himself with ' + p2_defense + ' defence and is left with ' + player2.hp + ' health.');
                    }

                    if (hasLife(player2.hp)) {
                        customDebug("________________ Player two's turn ___________________");
                        var p2_attack = attack(pl2_skill_atk, luck(player1.lk,player2.st));
                        var p1_defense = defense(pl1_skill_def, player1.df);

                        player1.hp = player1.hp - Math.max(0, (p2_attack - p1_defense));
                        customDebug('PL2 hits with ' + p2_attack + ' strength. PL1 defends himself with ' + p1_defense + ' defence and is left with ' + player1.hp + ' health.');
                    }

                    if (!hasLife(player1.hp)) {
                        customDebug('PL1 no more power');
                        result['winner'] = 'p2';
                        kungfu = false;
                    } else if (!hasLife(player2.hp)) {
                        customDebug('PL2 no more power');
                        result['winner'] = 'p1';
                        kungfu = false;
                    }

                    customDebug('RESULT: ' + player1.hp + " vs. " + player2.hp);
                    customDebug('******************************************************');
                    customDebug('******************************************************');

                    if (i == 20) {
                        if (player1.hp > player2.hp) {
                            result['winner'] = 'p1';
                        } else if (player1.hp < player2.hp) {
                            result['winner'] = 'p2';
                        } else {
                            result['winner'] = 'none';
                            customDebug("I DON'T BELIEVE IT... IT'S A DRAW!");
                        }
                        customDebug('THAT WAS THE FINAL ROUND!');
                        kungfu = false;
                    }

                    i++;
                }

                result['p1'] = player1;
                result['p2'] = player2;

                customDebug('(Array) - FIGHT RESULT: ', result);

                return result;
            };


            var b1 = battle(pl2, pl1);
            console.log('AND THE WINNER IS: ' + b1['winner']);
            console.log(b1[b1['winner']]);

        </script>    
    </body>
</html>
