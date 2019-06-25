// GAME PARAMS
const SQUARE_SIZE = 2.3; // Parameters of html element
const BORDER_SIZE = 0.05;
const ALPHABET = "ABCDEFGHIJ";
var SHIPS_GRID // Grid to snap ships on placing stage
var OPPONENT_SHIPS = false; // Show opponent ships
var AUTO_MARK = true; // Show additional marks

// AI PARAMS
var AI_DELAY = true; // Delay between AI shoots
const AI_DELAY_MIN = 1000; 
const AI_DELAY_MAX = 2500;

// GAME VARIABLES
var matrix = Array(2).fill().map(() => Array(10).fill().map(() => Array(10).fill(0)));
var gameOver = 0; // -1 - computer || 1 - player
var Ships = [[],[]];
var ShipsStats = [[4, 3, 2, 1], [4, 3, 2, 1]];
var dragObject = {};

// AI VARIABLES
var aiMaxLengthOfShip = 4;
var aiState = 0; // 0 - find ship mode || 1 - destroy ship mode
var aiResult = 0; // 0 - miss || 1 - hit || 2 - destroyed
var aiOrientationOfShip = 0; // -1 - horizontal || 0 -  not setup || 1 - vectical
var aiSide = 0; // -1 to left(up) || 0 - not setup || 1 - to right(down)
var aiLastTurnCoords = [];
var aiSmartMatrix = [];
var aiFieldMatrix = [];
var aiProbablyCells = [];
var aiFirstHit = [];
var aiPatterns = [
    [
        [[[0, 0], [1, 1], [2, 2], [3, 3]]],
        [[[0, 3], [1, 2], [2, 1], [3, 0]]],
        [[[0, 0], [1, 1], [2, 3], [3, 2]]],
        [[[0, 2], [1, 3], [2, 1], [3, 0]]],
        [[[0, 3], [1, 2], [2, 0], [3, 1]]],
        [[[0, 1], [1, 0], [2, 2], [3, 3]]]
    ],
    [
        [[[0, 0], [1, 1], [2, 2]], 0],
        [[[0, 2], [1, 1], [2, 0]], 0],
        [[[0, 1], [1, 2], [2, 0]], 0],
        [[[0, 1], [1, 0], [2, 2]], 0],
        [[[0, 2], [1, 0], [2, 1]], 0],
        [[[0, 0], [1, 2], [2, 1]], 0]
    ],
    [
        [[[0, 0], [1, 1]], 0],
        [[[0, 1], [1, 0]], 0]
    ]
];

function wrapperShipOnField(x, y, orientation, length, callback) {
    let biasWidth = 1;
    let biasHeight = 1;
    (orientation)?biasHeight = length:biasWidth = length;
    let starti = (x-1 < 0)?0:x-1;
    let startj = (y-1 < 0)?0:y-1;
    let xLoop = (x+biasHeight > 9)?9:x+biasHeight;
    let yLoop = (y+biasWidth > 9)?9:y+biasWidth;  
    for(let i = starti; i <= xLoop; i++)
        for(let j = startj; j <= yLoop; j++) {
            callback(i, j, biasWidth, biasHeight);
        }
    return [biasWidth, biasHeight];
}

function Ship (x, y, orientation, length, hit = 0) {
    this.x = x;
    this.y = y;
    this.orientation = orientation;
    this.length = length;
    this.hit = hit;
}

function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}

function addShip(x, y, orientation, length, field = 0) {
    Ships[field].push(new Ship(x, y, orientation, length)); 
    element = $("[pos-x="+x+"][pos-y="+y+"]").eq(field);
    biases = wrapperShipOnField(x, y, orientation, length, function(i, j, biasWidth, biasHeight) {   
        square = $("[pos-x="+i+"][pos-y="+j+"]").eq(field);
        if(inRange(i, x, x+biasHeight-1) && inRange(j, y, y+biasWidth-1)) {
            if(field == 0 || OPPONENT_SHIPS == 1)
                square.parent().removeClass("c_empty").addClass("c_busy");
            matrix[field][i][j] = 1;
        }
        else {
            matrix[field][i][j] = -1;
        }
    });
    orientation = (orientation)?"v":"h";
    width = (biases[0] != 1)?(SQUARE_SIZE*biases[0])+BORDER_SIZE*(length-1):SQUARE_SIZE;
    height = (biases[1] != 1)?(SQUARE_SIZE*biases[1])+BORDER_SIZE*(length-1):SQUARE_SIZE;
    if(field == 0 || OPPONENT_SHIPS == 1) element.append('<div class="ship" length="'+length
        +'" orientation="'+orientation+'" style="width:'+width+'em; height:'+height+'em"></div>');
    if(!field) {
        $("[pos-x="+x+"][pos-y="+y+"] .ship").draggable({
        containment: '.leftsquare',
        revert: draggableRevert,
        distance: 20,
        start: function() {
            let xShip = parseInt(this.offsetParent.getAttribute("pos-x"));
            let yShip = parseInt(this.offsetParent.getAttribute("pos-y"));
            let index = getShip(xShip, yShip, 0);
            let ship = Ships[0][index];
            Ships[0].splice(index, 1);
            $(this).data({"ship": ship, "xShip": xShip, "yShip": yShip});
            wrapperShipOnField(ship.x, ship.y, ship.orientation, ship.length, function(i, j) {
                if((ship.orientation?(inRange(i, ship.x, ship.x+ship.length-1) && ship.y == j)
                :(inRange(j, ship.y, ship.y+ship.length-1) && ship.x == i)))
                    $("[pos-x="+i+"][pos-y="+j+"]").parent().removeClass("c_busy").addClass("c_empty"); 
                if(!isBlockedByShips(i, j)) matrix[0][i][j] = 0;
            })
            for(let i = 0; i < 10; i++)
                for(let j = 0; j < 10; j++)
                    if(isShipPlaced(i, j, ship.orientation, ship.length, 0))
                        $("[pos-x="+i+"][pos-y="+j+"]").first().droppable("enable")
        },
        stop: function() {
            if($(this).data("revert")) {
                let ship = $(this).data("ship");
                let xShip = $(this).data("xShip");
                let yShip = $(this).data("yShip");
                addShip(xShip, yShip, ship.orientation, ship.length, 0);
            }
            $(".ui-droppable").droppable("disable");
            $(this).remove();
        }});

        $("[pos-x="+x+"][pos-y="+y+"] .ship").click(function() {
            if(!$(this).is(':animated')) {
            let x = parseInt($(this).parent().attr("pos-x"));
            let y = parseInt($(this).parent().attr("pos-y"));
            let orientation = (($(this).attr("orientation") == "v")?1:0);
            let length = parseInt($(this).attr("length"));
            
            Ships[0].splice(getShip(x, y, 0), 1);
            if(isShipPlaced(x, y, !orientation, length, 0, 1)) {
                wrapperShipOnField(x, y, orientation, length, function(i, j) {
                    if((orientation?(inRange(i, x, x+length-1) && y == j):(inRange(j, y, y+length-1) && x == i)))
                    $("[pos-x="+i+"][pos-y="+j+"]").parent().removeClass("c_busy").addClass("c_empty");
                if(!isBlockedByShips(i, j)) matrix[0][i][j] = 0;
                });
                $(this).remove();
                addShip(x, y, ((!orientation)?1:0), length, 0);
            }
            else {
                $(this).addClass("ui-onclick-error");
                $(this).effect("shake", {distance: 3, times: 3}, "normal", function() {
                    $(this).removeClass("ui-onclick-error");
                });
                Ships[0].push(new Ship(x, y, orientation, length)); 
    }}});
}}

function isShipPlaced(x, y, orientation, length, field, mode = 0) {
    let dominantY = (orientation == 0)?y + length - 1 : y;
    let dominantX = (orientation == 1)?x + length - 1 : x;
    if(dominantX > 9 || dominantY > 9) {
        return false;
    }
    for(x, y; (x <= dominantX) && (y <= dominantY); (dominantY == y)?x++:y++)
        if(((mode)?isBlockedByShips(x,y):matrix[field][x][y] != 0)) 
            return false;
    return true;
}

function randomFleetGenerator(field = 0) {
    for(let length = 4; length > 0; length--)
        for(let shipNumber = 0; shipNumber < 5-length; shipNumber++) {
            do {
                orientation = Math.floor(Math.random() * 2);
                x = Math.floor(Math.random() * 10);
                y = Math.floor(Math.random() * 10);
            } while(!isShipPlaced(x, y, orientation, length, field));
            addShip(x, y, orientation, length, field);
        }
}

function aiFire() {
    // If we've destroyed all longest ships generate new matrix
    if (ShipsStats[0][aiMaxLengthOfShip-1] == 0) {
        aiMaxLengthOfShip--;
        aiMatrixGenerate(aiMaxLengthOfShip);
    }

    coords = (aiState)?aiDestroyShip():aiSmartMatrix.pop();
    element = $("[pos-x="+coords[0]+"][pos-y="+coords[1]+"]")[0];
    aiResult = parseInt(fire(0, element)); // 0 - miss || 1 - hit || 2 - destroyed
    if(aiResult) aiLastTurnCoords.push(coords);
    aiNormaliseMatrix(coords);
}

function aiDestroyShip() {
    coords = [];
    coordsSource = aiLastTurnCoords[aiLastTurnCoords.length - 1];
    if(!aiOrientationOfShip) {
        if(!aiResult || (coordsSource[0] == aiFirstHit[0] && coordsSource[1] == aiFirstHit[1])) {
            do {
            coords = aiProbablyCells.pop();
            aiSide = (coords[0] < aiFirstHit[0] || coords[1] < aiFirstHit[1])?-1:1;
            } while (findElement(aiFieldMatrix, coords[0], coords[1]) == -1);
            return coords;
        }
        else {
            aiOrientationOfShip = (coordsSource[0] == aiFirstHit[0])?-1:1;
        }
    }
    if(!aiResult) { 
        aiSide = (aiSide == 1)?-1:1;
        coordsSource = aiFirstHit;
    }

    coords = (aiOrientationOfShip == 1)?[coordsSource[0] + aiSide, coordsSource[1]]:[coordsSource[0], coordsSource[1] + aiSide];
    if(coords[0] < 0 || coords[0] > 9 || coords[1] < 0 || coords[1] > 9 || findElement(aiFieldMatrix, coords[0], coords[1]) == -1) {
        aiSide = (aiSide == 1)?-1:1;
        coords = (aiOrientationOfShip == 1)?[aiFirstHit[0] + aiSide, aiFirstHit[1]]:[aiFirstHit[0], aiFirstHit[1] + aiSide];
    }
    return coords;
}

function aiNormaliseMatrix(coords) {
    spl = aiFieldMatrix.splice(findElement(aiFieldMatrix, coords[0], coords[1]), 1);
    index = findElement(aiSmartMatrix, coords[0], coords[1]);
    if(index != -1) spl = aiSmartMatrix.splice(index, 1);
    
    if(aiMaxLengthOfShip > 2) {
        len = aiMaxLengthOfShip - 1;
        aiPatterns[4 - len].forEach(function(element) {
            if(isPatternCorrect(coords[0], coords[1], len, element[0])) element[1]++;
        });
    }

    if(aiResult) {
        if(!aiState) {
            aiFirstHit = [coords[0], coords[1]];
            if(coords[1]+1 < 10) aiProbablyCells.push([coords[0], coords[1]+1]);
            if(coords[1]-1 >= 0) aiProbablyCells.push([coords[0], coords[1]-1]);
            if(coords[0]+1 < 10) aiProbablyCells.push([coords[0]+1, coords[1]]);
            if(coords[0]-1 >= 0) aiProbablyCells.push([coords[0]-1, coords[1]]);
            aiProbablyCells.sort(randomize);
        }

        indexes = [[coords[0]+1, coords[1]+1], [coords[0]+1, coords[1]-1], 
                   [coords[0]-1, coords[1]+1], [coords[0]-1, coords[1]-1]];
        for(let i = 0; i < 4; i++) {
            index = findElement(aiFieldMatrix, indexes[i][0], indexes[i][1]);
            if(index != -1) { 
                spl = aiFieldMatrix.splice(index, 1);
                if(aiMaxLengthOfShip > 2) {
                    len = aiMaxLengthOfShip - 1;
                    aiPatterns[4 - len].forEach(function(element) {
                        if(isPatternCorrect(indexes[i][0], indexes[i][1], len, element[0])) element[1]++;
                    });
                }
            }
            index = findElement(aiSmartMatrix, indexes[i][0], indexes[i][1]);
            if(index != -1) spl = aiSmartMatrix.splice(index, 1);
        }

        if(aiResult == 1) aiState = 1; 
        else if (aiResult == 2) {
            for(let i = 0; i < aiLastTurnCoords.length; i++) {
                indexes = [[aiLastTurnCoords[i][0] + 1, aiLastTurnCoords[i][1]], [aiLastTurnCoords[i][0]-1,  aiLastTurnCoords[i][1]], [aiLastTurnCoords[i][0],  aiLastTurnCoords[i][1]+1], [aiLastTurnCoords[i][0],  aiLastTurnCoords[i][1] - 1]]
                for(let j = 0; j < 4; j++) {
                    index = findElement(aiFieldMatrix, indexes[j][0], indexes[j][1]);
                    if(index != -1) {
                        spl = aiFieldMatrix.splice(index, 1);
                        if(aiMaxLengthOfShip > 2) {
                            len = aiMaxLengthOfShip - 1;
                            aiPatterns[4 - len].forEach(function(element) {
                                if(isPatternCorrect(indexes[j][0], indexes[j][1], len, element[0])) element[1]++;
                            });
                        }
                    } 
                    index = findElement(aiSmartMatrix, indexes[j][0], indexes[j][1]);
                    if(index != -1) spl = aiSmartMatrix.splice(index, 1);
                }
            }
            aiState = 0;
            aiOrientationOfShip = 0;
            aiFirstHit.length = 0;
            aiProbablyCells.length = 0;
            aiSide = 0;
            aiLastTurnCoords.length = 0;
        } 
    }
}

function randomize(a, b) {
    return Math.random() - 0.5;
}

function isPatternCorrect(x, y, length, arr) {
    for(let i = 0; i < arr.length; i++)
        if(x % length == arr[i][0] && y % length == arr[i][1]) return true;
    return false
}

function aiMatrixGenerate(length) {
    aiSmartMatrix.length = 0;
    indexLength = 4 - length;
    if(indexLength == 3) {
        aiSmartMatrix = Array.from(aiFieldMatrix);
        aiSmartMatrix.sort(randomize); 
        return;
    }
    if(indexLength == 0) patternIndex = Math.floor(Math.random() * aiPatterns[indexLength].length);
    else {
        max = 0;
        maxIndex = 0; 
        for(let i = 0; i < aiPatterns[indexLength].length; i++) {
            if(aiPatterns[indexLength][i][1] > max) {
                max = aiPatterns[indexLength][i][1];
                maxIndex = i;
            }
        }
        patternIndex = maxIndex;
    }    
    for(let x = 0; x < 10; x++)
        for(let y = 0; y < 10; y++)
            if (isPatternCorrect(x, y, length, aiPatterns[indexLength][patternIndex][0]) 
                && findElement(aiFieldMatrix, x, y) != -1) 
                aiSmartMatrix.push([x,y]);
	aiSmartMatrix.sort(randomize);
    
}

function aiFieldMatrixGenerate() {
    for(let i = 0; i < 10; i++)
        for(let j = 0; j < 10; j++)
            aiFieldMatrix.push([i, j]);
}

function fire(field, element)
{
    $(".rightsquare .content").off();
    $(element.parentNode).removeClass("c_empty auto");
    $(((field)?".rightsquare":".leftsquare")+" .last").removeClass("last");
    $(element.parentNode).addClass("last");
    let x = parseInt($(element).attr("pos-x"));
    let y = parseInt($(element).attr("pos-y"));

    // hit
    if(matrix[field][x][y] == 1) {
        $(element.parentNode).addClass("c_hit");
        let positions = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        for(let i = 0; i < 4; i++) {
            let corner = $("[pos-x="+(x+positions[i][0])+"][pos-y="+(y+positions[i][1])+"]").eq(field).parent();
            if(x+positions[i][0] < 10 && y+positions[i][1] >= 0 
                && !$(corner).hasClass("c_miss"))
                    $(corner).removeClass("c_empty").addClass("c_miss auto"+((AUTO_MARK)?" marked":""));
                }
        index = getShip(x, y, field);
        returnOnHit = 1;
        if(++Ships[field][index].hit == Ships[field][index].length) { 
            $(((field)?".right":".left")+" .length"+Ships[field][index].length+" .ship-holder:not(.red)").first().addClass("red");
            ShipDone(index, field); 
            returnOnHit = 2
        }
        if(!gameOver) {
            if (!field) {
                $(".wait-opponent").addClass("none");
                $(".opponent-again").removeClass("none");
                if(AI_DELAY) setTimeout(aiFire, Math.random() * (AI_DELAY_MAX - AI_DELAY_MIN) + AI_DELAY_MIN);
                else setTimeout(aiFire, 10);
            }
            else {
                $(".start-turn, .turn").addClass("none");
                $(".your-again").removeClass("none");
                $(".rightsquare .cell:not(.c_miss:not(.auto)):not(.c_hit) .content").on('click', function () {
                    fire(1, this);
                });
            }
        }
        else {
            $(".container").addClass("wait");
            $(".leftsquare .battlefield, .rightsquare .battlefield, #mark-checkbox, #delay-checkbox").addClass("wait").off();
            $(".turn, .your-again, .wait-opponent, .opponent-again").addClass("none");
            (gameOver == 1)?$(".win").removeClass("none"):$(".lose").removeClass("none");
        }
        return returnOnHit;
    }
    // miss
    else {
        $(element.parentNode).addClass("c_miss marked");
        if (field) {
            $(".start-turn, .turn, .your-again").addClass("none");
            $(".wait-opponent").removeClass("none");
            $(".rightsquare .battlefield").addClass("wait");
            $(".leftsquare .battlefield").removeClass("wait");
            if(AI_DELAY) setTimeout(aiFire, Math.random() * (AI_DELAY_MAX - AI_DELAY_MIN) + AI_DELAY_MIN);
            else setTimeout(aiFire, 10);
        }
        else {
            $(".wait-opponent, .opponent-again").addClass("none");
            $(".turn").removeClass("none");
            $(".leftsquare .battlefield").addClass("wait");
            $(".rightsquare .battlefield").removeClass("wait");
            $(".rightsquare .cell:not(.c_miss:not(.auto)):not(.c_hit) .content").on('click', function () {
                fire(1, this);
            });
        }
        return 0;
    }
}

function getShip(x, y, field) {
    for(let i = 0; i < Ships[field].length; i++)
        if(Ships[field][i].orientation?(inRange(x, Ships[field][i].x, Ships[field][i].x+Ships[field][i].length-1) 
            && Ships[field][i].y == y):(inRange(y, Ships[field][i].y, Ships[field][i].y+Ships[field][i].length-1) 
            && Ships[field][i].x == x))
                return i;
    return -1;
}

function findElement(array, x, y) {
    for(let i = 0; i < array.length; i++)
        if(array[i][0] == x && array[i][1] == y)
            return i;
    return -1;
}

function ShipDone(index, field) {
    ship = Ships[field][index];
    biases = wrapperShipOnField(ship.x, ship.y, ship.orientation, ship.length, function(i, j) {
        element = $('[pos-x='+i+'][pos-y='+j+']').eq(field).parent();
                if(element.hasClass("c_empty")) 
                    element.removeClass("c_empty").addClass("c_miss auto"+((AUTO_MARK)?" marked":""));
    })
    element = $("[pos-x="+ship.x+"][pos-y="+ship.y+"]").eq(field);
    width = (biases[0] != 1)?(SQUARE_SIZE*biases[0])+BORDER_SIZE*(ship.length-1) : SQUARE_SIZE;
    height = (biases[1] != 1)?(SQUARE_SIZE*biases[1])+BORDER_SIZE*(ship.length-1) : SQUARE_SIZE;
    if(OPPONENT_SHIPS || !field) element.children().last().remove();
    element.append('<div class="ship defeat" length='+ship.length+'"orientation="'+ship.orientation
        +'" style="width:'+width+'em; height:'+height+'em"></div>');

    yLoop = (!ship.orientation)?ship.y+ship.length-1:ship.y;
    xLoop = (ship.orientation)?ship.x+ship.length-1:ship.x;
    for(i = ship.x, j = ship.y; (i <= xLoop) && (j <= yLoop); (ship.biasHeightorientation)?i++ : j++)
        $("[pos-x="+i+"][pos-y="+j+"]").eq(field).parent().addClass("done");

    Ships[field].splice(index, 1);
    ShipsStats[field][ship.length-1]--;
    if(!Ships[field].length)
        gameOver = field?1:-1;
}

function generatePage() {
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 10; j++) {
            $((i == 0)?".leftsquare tbody":".rightsquare tbody").append('<tr class="row"></tr>');
            for(let k = 0; k < 10; k++)
                $((i == 0)?".leftsquare tbody .row":".rightsquare tbody .row").last().append(
                    '<td class="cell c_empty"><div class ="content" pos-x='+j
                    +' pos-y='+k+'><span class="dot"></span>'
                    +((k == 0)?'<div class="marker marker_row">'+ (j + 1) +'</div>':'') 
                    +((j == 0)?'<div class="marker marker_col">'+ALPHABET[k]+'</div>':'')+'</div></td>'); 
        }
    }
}

function isBlockedByShips(x, y) {
    for(let i = 0; i < Ships[0].length; i++) {
        let shipX = Ships[0][i].x;
        let shipY = Ships[0][i].y;
        let length = Ships[0][i].length;
        let orientation = Ships[0][i].orientation;
        if(inRange(x, shipX-1, ((orientation)?shipX+length:shipX+1)) && 
            inRange(y, shipY-1, ((orientation)?shipY+1:shipY+length))) return true;
    }
    return false;
}

function calculateGrid() {
    let ships = $(".ship");
    let mode = ($(ships[0]).offset().top != $(ships[1]).offset().top);
    let distance = Math.abs(($(ships[0]).parent().attr("pos-"+((mode)?"x":"y")) - 
        ($(ships[1]).parent().attr("pos-"+((mode)?"x":"y")))));
    SHIPS_GRID = Math.abs(((mode)?$(ships[0]).offset().top:$(ships[0]).offset().left) - 
        ((mode)?$(ships[1]).offset().top:$(ships[1]).offset().left)) / distance;
}

function clearField() {
    for(let i = 0; i < 10; i++) matrix[0][i].fill(0);
    Ships[0].length = 0;
    $(".leftsquare .ship, .line").remove();
    $(".c_busy").removeClass("c_busy").addClass("c_empty");
}

function draggableRevert(isValid) {
    $(this).data("revert", !isValid);
    return !isValid
}

function dropDroppable(ev, ui) {
    ui.draggable.removeClass("ui-draggable-hover");
    ship = $(ui.draggable).data("ship");
    x = parseInt($(this).attr("pos-x"));
    y = parseInt($(this).attr("pos-y"));
    addShip(x, y, ship.orientation, ship.length, 0);
}

function showStats() {
    for(let i = 0; i < 2; i++)
        $(((i)?".leftsquare":".rightsquare")).prepend('<div class="field-stats '+((i)?"left":"right")+'"></div>'); 
    $(".field-stats").append('<div class="ships-container"></div>')
    for(let j = 4; j > 0; j--) {
        $(".ships-container").append('<div class="ships length'+j+'"></div>');
        for(let k = 0; k < (5 - j); k++) {
            $(".length"+j).append('<div class="ship-holder"></div>');
            for(let m = 0; m < j; m++)
                $(".length"+j+" .ship-holder:last-child").append('<div class="ship-part"></div>');
        }
    }
}

// INITIALIZE GAME
generatePage();
randomFleetGenerator();
calculateGrid();
$(".leftsquare [pos-x]").droppable({
    disabled: true,
    tolerance: "custom",
    over: function(ev, ui) {
        $(ui.draggable).offset({top: $(this).offset().top, left: $(this).offset().left})
        ui.draggable.draggable("option", "grid", [SHIPS_GRID, SHIPS_GRID]);
        ui.draggable.addClass("ui-draggable-hover");
    },
    out: function(ev, ui) {
        if($(".ui-droppable-hover").length == 0) {
            ui.draggable.draggable("option", "grid", false); 
            ui.draggable.removeClass("ui-draggable-hover");
        }
    },
    drop: dropDroppable
});

$(".play").click(function() {
    $(".leftsquare .ship").draggable("destroy");
    play();
});

$("#mark-checkbox").click(function() {
    check = parseInt($(this).attr("check"));
    $(this).attr("check", (check)?"0":"1");
    (check)?$(".auto").removeClass("marked"):$(".auto").addClass("marked");
    AUTO_MARK = !check;
});

$("#ships-checkbox, #delay-checkbox").click(function() {
    check = parseInt($(this).attr("check"));
    $(this).attr("check", (check)?"0":"1");
    (($(this).attr("id") == "ships-checkbox")?OPPONENT_SHIPS = !check:AI_DELAY = !check);
});

$("#randomise-button").click(function() {
    clearField();
    randomFleetGenerator();
    $(".rightsquare").removeClass("none");
});

$("#reset-button").click(function() {
    if($(".leftsquare .battlefield .ship").length != 0) {
        clearField();
        $(".leftsquare .placeholder").prepend('<div class="base-container"></div>');
        for(let i = 4; i > 0; i--) {
            $(".leftsquare .base-container").append('<div id="line'+(5 - i)+'" class="line"></div>');
            for(let j = 0; j < 5 - i; j++)
                $("#line"+(5 - i)).append('<div class="base" style="width: '+
                ((SQUARE_SIZE*i)+BORDER_SIZE*(i-1))+'em; height: 2.3em"><div class="ship" length="'+i+
                '" orientation="h" style="width: '+((SQUARE_SIZE*i)+BORDER_SIZE*(i-1))+
                'em; height: 2.3em"></div></div>');
        }
        $(".rightsquare").addClass("none");
    }
    $(".base-container .ship").draggable({
        containment: '.leftsquare',
        revert: draggableRevert,
        distance: 20,
        start: function() {
            length = parseInt($(this).attr("length"));
            for(let i = 0; i < 10; i++) {
                for(let j = 0; j < 10; j++) {
                    if(isShipPlaced(i, j, 0, length, 0)) {
                        $("[pos-x="+i+"][pos-y="+j+"]").first().droppable({
                            disabled: false,
                            drop: function(ev, ui) {
                               ui.draggable.removeClass("ui-draggable-hover");
                               x = parseInt($(this).attr("pos-x"));
                               y = parseInt($(this).attr("pos-y"));
                               addShip(x, y, 0, length, 0);
                        }});
                    }
                }
            }
        },
        stop: function() {
            $(".ui-droppable").droppable({
                disabled: true,
                drop: dropDroppable,
            });
            if(!$(this).data("revert")) $(this).remove();
            if(Ships[0].length == 10) {
                $(".rightsquare").removeClass("none");
                $(".line").remove();
            }
    }});
});

function play() {
    randomFleetGenerator(1);
    aiFieldMatrixGenerate();
    aiMatrixGenerate(4);
    showStats();
    $("#randomise-button, #reset-button, #ships-checkbox").addClass("wait").off();
    $(".start, .info-place, .init, .instruction").addClass("none");
    $(".rightsquare .battlefield").removeClass("wait");
    $(".start-turn").removeClass("none");
    $(".leftsquare .battlefield").addClass("wait");
    $(".rightsquare .content").on('click', function () {
        fire(1, this);
    });
}