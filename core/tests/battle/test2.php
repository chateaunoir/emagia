<script>

    // Get info about "player 1"
    //      HP    ST    DF    SP    LK
    xpl = ['90', '80', '43', '80', '18'];

    //      HP    ST    DF    SP    LK
    // Get info about "player 2"
    xmn = ['87', '78', '43', '40', '19'];

    var pl1 = { hp: xpl[0], st: xpl[1], df: xpl[2], sp: xpl[3], lk: xpl[4] };
    var pl2 = { hp: xmn[0], st: xmn[1], df: xmn[2], sp: xmn[3], lk: xmn[4] };

    function battle(player1, player2) {
        var i = 1;


        var h1 = player1.hp;
        var h2 = player2.hp;

        var st1 = player1.st;
        var st2 = player2.st;

        var df1 = player1.df;
        var df2 = player2.df;

        while (true) {

            console.log('round ' + i + ' fight!');
            console.log('PL1: ' + h1 + ' | PL2: ' + h2);

            if (h1 >= 1) {

                h2 = h2 - Math.max(0, (st1 - df2));
                console.log('PL1 loveste cu ' + st1 + ' dar PL2 se apara cu ' + df2 + ' si ramane cu ' + h2);
            }

            if (h2 >= 1) {
                h1 = h1 - Math.max(0, (st2 - df1));
                console.log('PL2 loveste cu ' + st2 + ' dar PL1 se apara cu ' + df1 + ' si ramane cu ' + h1);
            }

            if (h1 <= 0) {
                console.log('PL1 no more power');
                break
            } else if (h2 <= 0) {
                console.log('PL2 no more power');
                break
            }


            console.log('rezultat: ' + h1 + " vs. " + h2);
            console.log('_______________________________________________')
            i++;
        }
    };


    battle(pl1, pl2);
</script>