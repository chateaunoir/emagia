<script>

    var h1 = 91;
    var h2 = 78;

    var st1 = 22;
    var st2 = 18;

    var df1 = 8;
    var df2 = 30;

    var i = 1;

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
</script>