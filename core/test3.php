<script>

    // Get info about "player 1"
    //      HP    ST    DF    SP    LK
    xpl = ['80', '40', '21', '80', '18'];

    //      HP    ST    DF    SP    LK
    // Get info about "player 2"
    xmn = ['70', '38', '18', '80', '19'];

    var pl1 = { hp: xpl[0], st: xpl[1], df: xpl[2], sp: xpl[3], lk: xpl[4] };
    var pl2 = { hp: xmn[0], st: xmn[1], df: xmn[2], sp: xmn[3], lk: xmn[4] };

    function battle(player1, player2) {

        var debug = true;

        var result = [];

        var i = 1;

        while (true) {

            if (debug) console.log('round ' + i + ' fight!');
            if (debug) console.log('PL1: ' + player1.hp + ' | PL2: ' + player2.hp);

            if (player1.hp >= 1) {

                player2.hp = player2.hp - Math.max(0, (player1.st - player2.df));
                if (debug) console.log('PL1 loveste cu ' + player1.st + ' dar PL2 se apara cu ' + player2.df + ' si ramane cu ' + player2.hp);
            }

            if (player2.hp >= 1) {
                player1.hp = player1.hp - Math.max(0, (player2.st - player1.df));
                if (debug) console.log('PL2 loveste cu ' + player2.st + ' dar PL1 se apara cu ' + player1.df + ' si ramane cu ' + player1.hp);
            }

            if (player1.hp <= 0) {
                if (debug) console.log('PL1 no more power');
                result['winner'] = 'p2';
                break
            } else if (player2.hp <= 0) {
                if (debug) console.log('PL2 no more power');
                result['winner'] = 'p1';
                break
            }

            if (debug) console.log('rezultat: ' + player1.hp + " vs. " + player2.hp);
            if (debug) console.log('_______________________________________________')
            i++;
        }

        result['p1'] = player1;
        result['p2'] = player2;

        if (debug) console.log('result: ', result);

        return result;
    };


    var b1 = battle(pl2, pl1);
    console.log(b1['winner']);
    console.log(b1[b1['winner']]);

</script>