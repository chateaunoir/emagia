(function ($) {

    // Don't mess with this variable.

    var knight;

    // Environment variables:

    var step = 100; // the size of a step that a character can make
    var knight_types = ["red", "blue", "green", "yellow"];
    var world_h = 0;
    var world_w = 0;
    var world_matrix = []; // for temporary storage - All of the elements in the level;
    var levelMonsters = []  // for temporary storage - Monsters and their stats;
    var knightStats = []    // for temporary storage - Knights Stats;

    // This function builds the objects in the world_matrix array;
    function x_matrix(comp, ID, TY, X, Y) 
    {
        this.component = comp;
        this.id = ID;
        this.type = TY;
        this.x = X;
        this.y = Y;
    }

    // These functions build the objects in both the knightStats and levelMonsters arrays;
    function player_matrix(id, type, health, strength, defence, speed, luck) 
    {
        this.ID = id;
        this.TP = type;
        this.STATS = new player_stats(health, strength, defence, speed, luck);
        //this.ATK_SKL = new player_skills(a_skl,a_pro);
        //this.DFS_SKL = new player_skills(d_skl,d_pro);
    }

    function player_stats(health, strength, defence, speed, luck)
    {
        this.HP = health;
        this.ST = strength;
        this.DF = defence;
        this.SP = speed;
        this.LK = luck;
    }

    function player_skills(skl,pro)
    {
        this.skill = skl;
        this.probability = pro;
    }

    // Load environment

    var play_level = "dbs/level1.txt";
    var kni_character = 'red';

    // Start the business:

    function getData(level_file) {

        $.getJSON(level_file, function (result) {

            // Check to see if the level has a name and display it
            if (result.NAME != null) {
                document.getElementById('current_level').innerHTML = result.NAME; // Displays the name of the level in the dashboard title

                // Check the size of the environment
                if (result.SIZE.length != '') 
                {
                    $.each(result.SIZE, function (key, val) 
                    {
                        world_w = val.width * step;
                        world_h = val.height * step;

                        document.getElementById('environment').style.width = world_w + 'px';
                        document.getElementById('environment').style.height = world_h + 'px';

                        setView(300, 200); // we will later point the screen in this direction
                    });
                } else {
                    alert('Captain! The level does not have a size set');
                }

                // Check all of the components of the environment
                if (result.COMP.length != '') 
                {
                    $.each(result.COMP, function (key_a, val_a) {
                        var k_start = val_a.start;
                        var k_finish = val_a.finish;
                        var e_map = val_a.map;
                        var e_blocks = val_a.blocks;
                        var e_monsters = val_a.monsters;
                        var e_items = val_a.items;

                         // This is the position where the knight starts the level
                        $.each(e_map, function (key_b, val_b) 
                        {
                            document.getElementById('environment').style.backgroundImage = "url("+val_b.background+")";
                        });

                        // This is the position where the knight starts the level
                        $.each(k_start, function (key_b, val_b) 
                        {
                            createElem('div', 'environment', 'knight', 'knight'); // Creates the knight on the map
                            createElem('div', 'knight', 'stats_knight_'+val_b.id, 'player-stats'); // Creates the little stats bubble over the knight
                            place_component('knight', val_b.X, val_b.Y);

                            knight = document.getElementById('knight');
                        });

                        // This function creates the actual finish tile and updates the position where it is
                        $.each(k_finish, function (key_b, val_b) 
                        {
                            createElem('div', 'environment', 'finish', 'finish');
                            place_component('finish', val_b.X, val_b.Y);

                            world_matrix.push(new x_matrix('finish', val_b.id, 'finish', val_b.X, val_b.Y));
                        });

                        // This function brings the environment components from the level's JSON file (except for monsters and items)
                        $.each(e_blocks, function (key_b, val_b) 
                        {
                            var b_type = val_b.type;
                            var b_ID = 'block_' + val_b.id;

                            createElem('div', 'environment', b_ID, b_type); // Creates the map element

                            var b_position = val_b.position;

                            $.each(b_position, function (key_c, val_c) {
                                place_component(b_ID, val_c.X, val_c.Y); // Puts

                                // Update world array
                                world_matrix.push(new x_matrix('solid', val_b.id, b_type, val_c.X, val_c.Y));
                            });


                        });

                        // This function brings the environment monsters and their stats from the level's JSON file
                        $.each(e_monsters, function (key_b, val_b) 
                        {
                            var m_type = val_b.type;
                            var m_ID = 'ghost_' + val_b.id;

                            createElem('div', 'environment', m_ID, m_type); // Creates the monster on the map
                            createElem('div', m_ID, 'stats_' + m_ID, 'player-stats'); // Creates the little stats bubble over the monster

                            var m_position = val_b.position;
                            var m_stats = val_b.stats;

                            $.each(m_position, function (key_c, val_c) {
                                place_component(m_ID, val_c.X, val_c.Y);

                                // Update world array
                                world_matrix.push(new x_matrix('monster', val_b.id, m_type, val_c.X, val_c.Y));
                            });

                            $.each(m_stats, function (key_c, val_c) {

                                // Update level monsters array
                                levelMonsters.push(new player_matrix(val_b.id, m_type, val_c.HP, val_c.ST, val_c.DF, val_c.SP, val_c.LK));
                                document.getElementById('stats_' + m_ID).innerHTML = '<span><strong class="text-danger"><small>'+val_c.HP+'</small></strong> <strong class="text-warning"><small>'+val_c.ST+'</small></strong> <strong class="text-info"><small>'+val_c.DF+'</small></strong> <strong class="text-primary"><small>'+val_c.SP+'</small></strong> <strong class="text-success"><small>'+val_c.LK+'</small></strong></span>'; 
                            });

                        });

                        // This function brings the environment items from the level's JSON file 
                        $.each(e_items, function (key_b, val_b) 
                        {
                            var i_type = val_b.type;
                            var i_ID = 'item_' + val_b.id;

                            createElem('div', 'environment', i_ID, i_type);

                            var i_position = val_b.position;

                            $.each(i_position, function (key_c, val_c) {
                                place_component(i_ID, val_c.X, val_c.Y);

                                // Update world array
                                world_matrix.push(new x_matrix('fluid', val_b.id, i_type, val_c.X, val_c.Y));
                            });

                        });
                    });
                }
            } 
        })

        // what happens after all of the map elements have been loaded
        .done(function () {

            if (knight_types != null || knight_types.indexOf(str) >= 0) {

                var pl1 = kni_character + '_knight';

                // Get data from the Knights JSON 
                $.getJSON('dbs/heroes.txt', function (result) {

                    // Check to see if the hero file has anything in it

                    if (result.KNIGHTS != null || result.KNIGHTS != '') {

                        $.each(result.KNIGHTS, function (key, val) 
                        {

                            var character_type = val.TYPE;

                            // Check the size of the environment

                            if (character_type == pl1) {
                                document.getElementById('knight_name').innerHTML = val.HERO;

                                var knight_stats = val.STATS;
                                var knight_skills = val.SKILLS;
                                var knight_id = val.ID;
                                var knight_type = knight_type;
                                $.each(knight_stats, function (key_b, val_b) {

                                    knightStats.push(new player_matrix(1, knight_type, val_b.HP, val_b.ST, val_b.DF, val_b.SP, val_b.LK));
                                    document.getElementById('stats_knight_' + 1).innerHTML = '<span><strong class="text-danger"><small>'+val_b.HP+'</small></strong> <strong class="text-warning"><small>'+val_b.ST+'</small></strong> <strong class="text-info"><small>'+val_b.DF+'</small></strong> <strong class="text-primary"><small>'+val_b.SP+'</small></strong> <strong class="text-success"><small>'+val_b.LK+'</small></strong></span>'; 
                                });                      
                            } 
                        });
                    };
                })

                // what happens after the knightStats array has been loaded;
                .done(function()
                {
                    // write Knight stats to Viewport dashboard
                    displayStats(knightStats[0].STATS.HP,'#dashboard .kn-hp');
                    displayStats(knightStats[0].STATS.ST,'#dashboard .kn-st'); 
                    displayStats(knightStats[0].STATS.DF,'#dashboard .kn-df'); 
                    displayStats(knightStats[0].STATS.SP,'#dashboard .kn-sp'); 
                    displayStats(knightStats[0].STATS.LK,'#dashboard .kn-lk');  

                    //Enable the controls for the knight:
                    enableControls();  
                                 
                });
            }

            // Show the knight on screen
            kni_type(kni_character);
            
        })
        // what happens if the world isn't loaded;
        .fail(function () {
            alert("Captain, it appears we have a problem loading the world!")
        });

        
    }


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

    // This function removes items from the world_matrix object array;
    function eraseFromWorldMatrix(whatComponent,whatId) {
        for(i = 0; i < world_matrix.length; i++)
        {
            if(world_matrix[i].component == whatComponent)
            {
                if(world_matrix[i].id == whatId) 
                {
                    world_matrix.splice(i, 1);
                }                        
            }
        }
                    
    }

    // This function displays the knight's stats on the viewport dashboard 
    function displayStats(whosStats,updateDOMelem){
        if(whosStats != undefined || whosStats != null || whosStats != '')
        {
            $(updateDOMelem).text(whosStats);

        } else 
        {
            console.log("There's been an error reading the stats");    
            console.log(whosStats);    
        }
                
    }

    // Tools that need to be loaded after the environment finished loading
    function enableControls() {               

        // Movement processing
        document.onkeydown = checkKey;
        function checkKey(e) {

            e = e || window.event;

            // up arrow
            if (e.keyCode == '38') {
                if (checkCoord('up') != 0) {
                    moveUp();
                };
                centrateScreen('up');
            }
            // down arrow
            else if (e.keyCode == '40') {
                if (checkCoord('down') != 0) {
                    moveDown();
                };
                centrateScreen('down');
            }
            // left arrow
            else if (e.keyCode == '37') {
                if (checkCoord('left') != 0) {
                    moveLeft();
                };
                centrateScreen('left');
            }
            // right arrow
            else if (e.keyCode == '39') {
                if (checkCoord('right') != 0) {
                    moveRight();
                };
                centrateScreen('right');
            }
            // space bar
            else if (e.keyCode == '32') {
                console.log('space');
            }
            // escape button
            else if (e.keyCode == '27') {
                console.log('esc');
                $('#viewport #pause-menu').toggleClass('active');
            }
            // the letter "A"
            else if (e.keyCode == '65') {
                console.log('A');
            }
            // the letter "S"
            else if (e.keyCode == '83') {
                console.log('S');
            }
            // the letter H
            else if (e.keyCode == '72') {
                console.log('H');
            }

        }

        //A function for the combat scenario
                
    }

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

            if (indicator == 'left') 
            {
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
            else if (indicator == 'right') 
            {
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
            else if (indicator == 'up') 
            {
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
            else if (indicator == 'down') 
            {
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

    var checkCoord = function (direction) {

        var debug = true;
        function customDebug(message) {
            if (debug) console.log(message);
        }

        var knipos_y = parseFloat(knight.style.top.replace('px', ''));
        var knipos_x = parseFloat(knight.style.left.replace('px', ''));

        var compCheck = world_matrix.length;

        // /////// ////
        // checkresponse()
        // This is the function that controls what happens when the knight bumps into something
        // Usage -- Put "return 0" at the end of each "else if" for the knight to stop before going over the component or leave empty to proceed   
        // /////// ////      
                                                                   
        var checkResponse = function(WM,KX,KY)
        {
            if (WM.component == "solid") {
                customDebug("Knight is at: top: " + KY + " left: " + KX);
                customDebug("Block is at: top: " + WM.y + " left: " + WM.x);
                customDebug('BAD DIRECTION ' + WM.x);
                customDebug('Component is solid ');
                return 0;
            }
            else if (WM.component == "monster") {
                customDebug("OH NO!!! There's a ghost in town !!!");
                startCombat(knightStats[0], levelMonsters[WM.id]);
                return 0;
            }
            else if (WM.component == "fluid") {
                customDebug("HORRAAY!!! You've found an item !!!");
                if(WM.type == "health") 
                {
                    knightStats[0].STATS.HP = 100;
                    displayStats(knightStats[0].STATS.HP,'#dashboard .kn-hp');
                    displayStats(knightStats[0].STATS.HP,'#knight #stats_knight_1 .text-danger small');
                    eraseFromWorldMatrix(WM.component,WM.id);
                    document.getElementById('item_'+WM.id).remove();
                }
                if(WM.type == "key") 
                {
                    eraseFromWorldMatrix(WM.component,WM.id);
                    document.getElementById('item_'+WM.id).remove();
                }
            } else if (WM.component == "finish") {
                alert("You've finally finished the level! Congrats!");
            }
        }

        // Directional processing
        // DON'T MESS AROUND WITH IT!

        if (direction == 'right') {
            customDebug('******** Movement Right ********');
            for (i = 0; i < compCheck; i++) {
                if (knipos_y == parseInt(world_matrix[i].y)) {
                    if (parseInt(world_matrix[i].x) == knipos_x + step) {
                        return checkResponse(world_matrix[i],knipos_x,knipos_y);
                    }
                }
            }
        }
        if (direction == 'left') {
            customDebug('******** Movement Left ********');
            for (i = 0; i < compCheck; i++) {
                if (knipos_y == parseInt(world_matrix[i].y)) {
                    if (parseInt(world_matrix[i].x) == knipos_x - step) {
                        return checkResponse(world_matrix[i],knipos_x,knipos_y);
                    }
                }
            }
        }
        if (direction == 'up') {
            customDebug('******** Movement Up ********');
            for (i = 0; i < compCheck; i++) {
                if (knipos_x == parseInt(world_matrix[i].x)) {
                    if (parseInt(world_matrix[i].y) == knipos_y - step) {
                        return checkResponse(world_matrix[i],knipos_x,knipos_y);
                    }
                }
            }
        }
        if (direction == 'down') {
            customDebug('******** Movement Down ********');
            for (i = 0; i < compCheck; i++) {
                if (knipos_x == parseInt(world_matrix[i].x)) {
                    if (parseInt(world_matrix[i].y) == knipos_y + step) {
                       return checkResponse(world_matrix[i],knipos_x,knipos_y);
                    }
                }
            }
        }
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

    // Combat function:
    // The challenger is the one starting the fight (maybe the hero ran into a ghost?);
    // This function requires two arrays as 
    //startCombat(knightStats[0].stats,levelMonsters[0].stats);
    
    function startCombat(xpl1, xpl2) {        
        
        var debug = true;
        function customDebug(message) {
            if (debug) console.log(message);
        }

        var probability = function (n) {
            n = n / 100;
            return !!n && Math.random() <= n;
        };

        function luck(value, result) {
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
        };

        // Get info about both players:
        var pl1_skill_atk = 0; var pl1_skill_def = 0;        
        var pl2_skill_atk = 0; var pl2_skill_def = 0;

        var pl1 = { hp: xpl1.STATS.HP, st: xpl1.STATS.ST, df: xpl1.STATS.DF, sp: xpl1.STATS.SP, lk: xpl1.STATS.LK };
        var pl2 = { hp: xpl2.STATS.HP, st: xpl2.STATS.ST, df: xpl2.STATS.DF, sp: xpl2.STATS.SP, lk: xpl2.STATS.LK };

        //Below is where it's decided who starts the fight
             if (pl1.sp > pl2.sp) 
        {
            console.log('The knight will start the battle!');

            var k_vs_m = battle(pl1, pl2);
            console.log(world_matrix);
            if (k_vs_m['winner'] == 'p1') {
                console.log('The knight won!');

                knightStats[0].STATS.HP = Math.max(0, k_vs_m[k_vs_m['winner']].hp);
                displayStats(knightStats[0].STATS.HP,'#dashboard .kn-hp');
                displayStats(knightStats[0].STATS.HP,'#knight #stats_knight_1 .text-danger small');

                eraseFromWorldMatrix("monster",xpl2.ID);                
                document.getElementById('ghost_'+xpl2.ID).remove();
                
            } else {
                console.log('The monster won!');
                knight.classList.add('dead');
            
                knightStats[0].STATS.HP = Math.max(0, k_vs_m[k_vs_m['loser']].hp);
                displayStats(knightStats[0].STATS.HP,'#dashboard .kn-hp');
                displayStats(knightStats[0].STATS.HP,'#knight #stats_knight_1 .text-danger small'); 
            }

        }
        else if (pl1.sp < pl2.sp) 
        {
            console.log('The monster challenges the knight to a battle!');

            var m_vs_k = battle(pl2,pl1);

            if (m_vs_k['winner'] == 'p1') {
                console.log('The knight won!');

                knightStats[0].STATS.HP = Math.max(0, m_vs_k[m_vs_k['winner']].hp);
                displayStats(knightStats[0].STATS.HP,'#dashboard .kn-hp');
                displayStats(knightStats[0].STATS.HP,'#knight #stats_knight_1 .text-danger small');

                eraseFromWorldMatrix("monster",xpl2.ID);                
                document.getElementById('ghost_'+xpl2.ID).remove();

            } else {
                console.log('The monster won!');
                
                knight.classList.add('dead');
            
                knightStats[0].STATS.HP = Math.max(0, m_vs_k[m_vs_k['loser']].hp);
                displayStats(knightStats[0].STATS.HP,'#dashboard .kn-hp');
                displayStats(knightStats[0].STATS.HP,'#knight #stats_knight_1 .text-danger small'); 
            }

        }
        else 
        {
            if (pl1.lk > pl2.lk) 
            {
                console.log('The knight is luckyer this time');

            } else 
            {
                console.log('The monster is luckyer this time');

                var m_vs_k = battle(pl1, pl2);

                if (m_vs_k['winner'] == 'p1') {
                    console.log('The knight won!');
                    //alert('Knight won');
                } else {
                    console.log('The monster won!');
                    knight.classList.add('dead');
                }
            }
        }

        //Player 1 is the one with better speed and/or luck
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
                    customDebug('PL1 hits with ' + p1_attack + ' strength. PL2 defends himself with ' + p2_defense + ' defence and is left with ' + player2.hp + ' health.');
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
                    result['loser'] = 'p1';
                    kungfu = false;
                } else if (!hasLife(player2.hp)) {
                    customDebug('PL2 no more power');
                    result['winner'] = 'p1';
                    result['loser'] = 'p2';
                    kungfu = false;
                }

                customDebug('RESULT: ' + player1.hp + " vs. " + player2.hp);
                customDebug('******************************************************');
                customDebug('******************************************************');

                if (i == 20) {
                    if (player1.hp > player2.hp) {
                        result['winner'] = 'p1';
                        result['loser'] = 'p2';
                    } else if (player1.hp < player2.hp) {
                        result['winner'] = 'p2';
                        result['loser'] = 'p1';
                    } else {
                        result['winner'] = 'none';
                        result['loser'] = 'none';
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

    function checkLevels() {
        var levels = new Object();
         $.getJSON('dbs/levels.txt', function (result) {
            
            for(var i=1; i<result.LEVELS.length; i++) {
                levels[i] = result.LEVELS[i].LVL;                    
            }   
            
        }).done(function()
        {
            console.log(levels);            
        });
        
    }
    checkLevels();


    ///*** HERE IS WHERE WE POWER UP THE ENVIRONMENT ***/


    //getData(play_level);

    function gamePlay()
    {
        // Set game variables and prerequisites

        $('#start_game').on('click', function()
        {   
            
            $('#viewport #game-menu').toggleClass('active');

            // Load level 1 environment
            createElem('div', 'game_wrapper', 'environment', 'level-map');

            
            getData('dbs/level4.txt');            
            // Load level 1 dependencies 
            
            // If player reaches the finish load next level. If the player dies or restarts, reload level 1
            // Erase everything in the environment
            
            // Load level 2 environment        
        });
    }

    ///*** LEAVE THIS AT THE BOTTOM ***/

    $(document).ready(function () {
        $(window).load(function () { // site preloader
            $('#preloader').fadeOut('slow', function () { $(this).remove(); });
        });
        gamePlay();
    });

})(jQuery);