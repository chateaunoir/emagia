(function ($) {

    // Don't mess with this variable.

    var knight;

    // Environment variables:

    var step = 100; // the size of a step that a character can make
    var knight_types = ["red", "blue", "green", "yellow"];
    var world_h = 0;
    var world_w = 0;

    // Load environment

    var play_level = "dbs/level1.txt";
    var kni_character = 'blue';

    // Start the business:

    function getData(level_file) {

        $.getJSON(level_file, function (result) {


            // Check to see if the level has a name and display it
            if (result.NAME != null) {

                // Check the size of the environment
                if (result.SIZE.length != '') {

                    $.each(result.SIZE, function (key, val) {
                        world_w = val.width * step;
                        world_h = val.height * step;

                        document.getElementById('environment').style.width = world_w + 'px';
                        document.getElementById('environment').style.height = world_h + 'px';

                        setView(300, 200); // we will later point the screen in this direction
                    });

                } else {
                    alert('Captain! The level does not have a size set');
                }


                if (result.COMP.length != '') {

                    $.each(result.COMP, function (key_a, val_a) {
                        var k_start = val_a.start;
                        var k_finish = val_a.finish;
                        var e_blocks = val_a.blocks;
                        var e_monsters = val_a.monsters;
                        var e_items = val_a.items;

                        $.each(k_start, function (key_b, val_b) {
                            createElem('div', 'environment', 'knight', 'knight');
                            place_component('knight', val_b.X, val_b.Y);

                            knight = document.getElementById('knight');
                        });

                        $.each(k_finish, function (key_b, val_b) {
                            createElem('div', 'environment', 'finish', 'finish');
                            place_component('finish', val_b.X, val_b.Y);
                        });

                        $.each(e_monsters, function (key_b, val_b) {
                            var m_type = val_b.type;
                            var m_ID = 'ghost_' + val_b.id;

                            createElem('div', 'environment', m_ID, m_type);

                            var m_position = val_b.position;

                            $.each(m_position, function (key_c, val_c) {
                                place_component(m_ID, val_c.X, val_c.Y);
                            });

                        });

                        $.each(e_blocks, function (key_b, val_b) {
                            var b_type = val_b.type;
                            var b_ID = 'block_' + val_b.id;

                            createElem('div', 'environment', b_ID, b_type);

                            var b_position = val_b.position;

                            $.each(b_position, function (key_c, val_c) {
                                place_component(b_ID, val_c.X, val_c.Y);
                            });

                        });

                        $.each(e_items, function (key_b, val_b) {
                            var i_type = val_b.type;
                            var i_ID = 'item_' + val_b.id;

                            createElem('div', 'environment', i_ID, i_type);

                            var i_position = val_b.position;

                            $.each(i_position, function (key_c, val_c) {
                                place_component(i_ID, val_c.X, val_c.Y);
                            });

                        });
                    });

                }

            } else {


            }
        })

        // what happens after the world has been loaded
        .done(function () {

            // Show the knight on screen
            kni_type(kni_character);
            //Power up the tools of the environment
            loadTools();

        })
        // what happens if the world isn't loaded;
        .fail(function () {
            alert("Captain, it appears we have a problem loading the world!")
        });
    }

    //Power up the environment

    getData(play_level);


    // Environment variables

    var place_component = function (item, x, y) { // Place each component of the map;
        component = document.getElementById(item);
        component.style.left = x + 'px';
        component.style.top = y + 'px';

    };

    var kni_type = function (type) {

        if (type != null || knight_types.indexOf(str) >= 0) {
            knight.classList.add(type + '_knight');
        } else {
            console.log('Type not set');
        }
    }

    // Creates elements and puts them on screen
    function createElem(createWhatType, putitWhereID, giveitanID, giveitaClass) {
        var new_elem = document.createElement(createWhatType);
        new_elem.setAttribute("id", giveitanID);
        new_elem.setAttribute("class", giveitaClass);
        document.getElementById(putitWhereID).appendChild(new_elem);
    };



    // Tools that need to be loaded after the environment finished loading
    function loadTools() {

        // Scrolls the screen after the player
        function centrateScreen(indicator) {
            var view_h = window.innerHeight;
            var view_w = window.innerWidth;

            var world = document.getElementById('environment');

            //get the position of the knight

            if (view_h < world_h && view_w < world_w) {

                // check the offset of the knight, relative to the screen;

                var k_pos_top = $(knight).offset().top;
                var k_pos_left = $(knight).offset().left;

                var k_pos_right = $(knight).offset().left + step;
                var k_pos_bottom = $(knight).offset().top + step;


                if (indicator == 'left') {
                    if (k_pos_left < 200) {
                        var xx = parseInt(world.style.left);

                        if (xx > -100) {
                            world.style.left = 0 + 'px';
                            return
                        } else {
                            world.style.left = xx + step + 'px';
                        }
                    }
                }
                else if (indicator == 'right') {
                    if (k_pos_right > view_w - 200) {

                        var yy = world_w - view_w;
                        var xx = parseInt(world.style.left);

                        if (xx < yy * -1 + 100) {
                            world.style.left = yy * -1 + 'px';
                            return
                        } else {
                            world.style.left = xx - step + 'px';
                        }
                    }
                }
                else if (indicator == 'up') {
                    if (k_pos_top < 200) {
                        var xx = parseInt(world.style.top);

                        if (xx > -100) {
                            world.style.top = 0 + 'px';
                            return
                        } else {
                            world.style.top = xx + step + 'px';
                        }
                    }
                }
                else if (indicator == 'down') {
                    if (k_pos_bottom > view_h - 200) {
                        var xx = parseInt(world.style.top);

                        var yy = world_h - view_h;

                        if (xx < yy * -1 + 100) {
                            world.style.top = yy * -1 + 'px';
                            return
                        } else {
                            world.style.top = xx - step + 'px';
                        }
                    }
                }

            }
        }

        // Movement processing
        document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
                // up arrow
                console.log('up');
                moveUp();
                centrateScreen('up');
            }
            else if (e.keyCode == '40') {
                // down arrow
                console.log('down');
                moveDown();
                centrateScreen('down');
            }
            else if (e.keyCode == '37') {
                // left arrow
                console.log('left');
                moveLeft();
                centrateScreen('left');
            }
            else if (e.keyCode == '39') {
                // right arrow
                console.log('right');
                moveRight();
                centrateScreen('right');
            }
            else if (e.keyCode == '32') {
                // space bar
                console.log('space');

            }
            else if (e.keyCode == '27') {
                // esc button
                console.log('esc');

            }
            else if (e.keyCode == '65') {
                // the letter "A"
                console.log('A');

            }
            else if (e.keyCode == '83') {
                // the letter "S"
                console.log('S');

            }
            else if (e.keyCode == '72') {
                // the letter H
                console.log('H');

            }

        }

        //A function for the combat scenario
        //checkPlayers();
        startCombat(kni_character, 'ghost');
    }


    // Sets where the screen is positioned, given the starting point of the knight

    function setView(X, Y) {
        var view_h = window.innerHeight;
        var view_w = window.innerWidth;

        var world = document.getElementById('environment');

        if (view_h < world_h && view_w < world_w) {

            world.style.top = 0;
            world.style.left = 0;

        } else {

            if (view_h > world_h) {
                world.style.top = 50 + "%";
                world.classList.add('align-vtc');
            }

            if (view_w > world_w) {
                world.style.left = 50 + "%";
                world.classList.add('align-hrz');
            }

            if (view_h > world_h && view_w > world_w) {

                world.classList.add('align-all');

            }
        }

    }


    // Knight movement

    function moveRight() {

        var styling = parseFloat(knight.style.left.replace('px', ''));
        var x = styling + step;

        if (x > world_w - step) { x = world_w - step; }

        knight.style.left = x + 'px';

        knight.classList.remove('up'); knight.classList.remove('left');
        knight.classList.add('right');

        //check environment
    }
    function moveLeft() {

        var styling = parseFloat(knight.style.left.replace('px', ''));
        var x = styling - step;

        if (x < 100) { x = 0; }

        knight.style.left = x + 'px';
        knight.classList.remove('up'); knight.classList.remove('right');
        knight.classList.add('left');

        //check environment
    }
    function moveUp() {

        var styling = parseFloat(knight.style.top.replace('px', ''));
        var x = styling - step;

        if (x < 100) { x = 0; }

        knight.style.top = x + 'px';
        knight.classList.add('up');

        //check environment
    }
    function moveDown() {

        var styling = parseFloat(knight.style.top.replace('px', ''));
        var x = styling + step;

        if (x > world_h - step) { x = world_h - step; }

        knight.style.top = x + 'px';
        knight.classList.remove('up');

        //check environment
    }


    // Combat scenarios:

    function startCombat(player1, player2) {

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
        xpl = ['1000', '40', '21', '50', '21']; var pl1_skill_atk = 20; var pl1_skill_def = 20;

        //      HP    ST    DF    SP    LK
        // Get info about "player 2"
        xmn = ['1000', '38', '18', '71', '16']; var pl2_skill_atk = 20; var pl2_skill_def = 20;

        var pl1 = { hp: xpl[0], st: xpl[1], df: xpl[2], sp: xpl[3], lk: xpl[4] };
        var pl2 = { hp: xmn[0], st: xmn[1], df: xmn[2], sp: xmn[3], lk: xmn[4] };


        if (pl1.sp > pl2.sp) {
            console.log('The knight will start the battle!');

            var k_vs_m = battle(pl1, pl2);

            if (k_vs_m['winner'] == 'p1') {
                console.log('The knight won!');
                //alert('Knight won');
            } else {
                console.log('The monster won!');
                knight.classList.add('dead');
            }
            //console.log(k_vs_m['winner']);
            //console.log(k_vs_m[k_vs_m['winner']]);

        }
        else if (pl1.sp < pl2.sp) {
            console.log('The monster challenges the knight to a battle!');

            var m_vs_k = battle(pl1, pl2);

            if (m_vs_k['winner'] == 'p1') {
                console.log('The knight won!');
                //alert('Knight won');
            } else {
                console.log('The monster won!');
                knight.classList.add('dead');
            }

        }
        else {
            if (pl1.lk > pl2.lk) {
                console.log('The knight is luckyer this time');

            } else {
                console.log('The monster is luckyer this time');

            }
        }


        function battle(player1, player2) {

            var result = [];

            var i = 1;

            var kungfu = true;

            while (kungfu) {

                customDebug('ROUND ' + i + ' FIGHT!');
                customDebug('PL1: ' + player1.hp + ' | PL2: ' + player2.hp);

                if (hasLife(player1.hp)) {
                    customDebug("________________ Player one's turn ___________________");
                    var p1_attack = attack(pl1_skill_atk, luck(player2.lk, player1.st));
                    var p2_defense = defense(pl2_skill_def, player2.df);

                    player2.hp = player2.hp - Math.max(0, (p1_attack - p2_defense));
                    customDebug('PL2 hits with ' + p1_attack + ' strength. PL1 defends himself with ' + p2_defense + ' defence and is left with ' + player2.hp + ' health.');
                }

                if (hasLife(player2.hp)) {
                    customDebug("________________ Player two's turn ___________________");
                    var p2_attack = attack(pl2_skill_atk, luck(player1.lk, player2.st));
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

    }


    var knightStats = []    // for temporary storage - Knights Stats;
    var levelMonsters = []  // for temporary storage - Monsters and their stats

    // This function is a dependancy of checkPlayers();
    function randomPick(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // This function checks all the players loaded in this environment
    function checkPlayers(player, level) {


        if (knight_types != null || knight_types.indexOf(str) >= 0) {

            var pl1 = player + '_knight';

            // Get data from the Knights JSON 
            $.getJSON('dbs/heroes.txt', function (result) {

                // Check to see if the hero file has anything in it

                if (result.KNIGHTS != null || result.KNIGHTS != '') {

                    $.each(result.KNIGHTS, function (key, val) {

                        var knight_type = val.TYPE;

                        // Check the size of the environment

                        if (knight_type == pl1) {
                            var knight_stats = val.STATS;

                            $.each(knight_stats, function (key_b, val_b) {

                                var knight_HP = val_b.HP;
                                var knight_ST = val_b.ST;
                                var knight_DF = val_b.DF;
                                var knight_SP = val_b.SP;
                                var knight_LK = val_b.LK;

                                $.each(knight_HP, function (key_c, val_c) {
                                    var xx = parseInt(val_c.min);
                                    var yy = parseInt(val_c.max);
                                    //console.log(xx + " < " + yy);
                                    //console.log("Lucky number: " + randomPick(xx, yy));
                                });

                            });

                        } else {
                            return
                        }
                    });
                }

            })

            // what happens after data has been obtained
            .done(function () {
                // push to knightStats array

            })
            // what happens if the world isn't loaded;
            .fail(function () {
                alert("Captain, it appears that we cannot find any of our heroes!")
            });

            // Find out what monsters live in the level JSON file
            $.getJSON(level, function (result) {

                // Check if the level has anything in it

                if (result.COMP != null || result.COMP != '') {

                    $.each(result.COMP, function (key, val) {

                        var lvl_monsters = val.monsters;

                        // Check the size of the environment

                        $.each(lvl_monsters, function (key_b, val_b) {

                            var monsters = new Object;
                            var monster_stats = val.STATS;

                            //$.each(monster_stats, function (key_b, val_b) {

                            //    var monster_HP = val_b.HP;
                            //    var monster_ST = val_b.ST;
                            //    var monster_DF = val_b.DF;
                            //    var monster_SP = val_b.SP;
                            //    var monster_LK = val_b.LK;

                            //});

                        });

                    });
                }

            })

            // what happens after data has been obtained
            .done(function () {
                //push to monsterStats array

            })
            // what happens if the world isn't loaded;
            .fail(function () {
                alert("Captain, it appears that we cannot find the world that you've mentioned!")
            });

        }
    }
    checkPlayers(kni_character, play_level);


    ///*** LEAVE THIS AT THE BOTTOM ***/

    $(document).ready(function () {
        $(window).load(function () { // site preloader
            $('#preloader').fadeOut('slow', function () { $(this).remove(); });
        });
    });

})(jQuery);