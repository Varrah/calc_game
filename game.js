let a = 0;
let b = 0;
let problemCounter = 0;
let score = 0;
let errors = 0;
const maxProblems = 10;
let problems = [];

function updateOutputText(event) {
    if (event.keyCode === 13) {
        verifyResponse();
    }
}

function updateTime() {
    document.getElementById('time').innerText = new Date().toLocaleString();
    setTimeout(updateTime, 1000);
}

function getRandom(minimum, maximum) {    
    if (!minimum) {
        minimum = 2;
    }
    if (!maximum) {
        maximum = 10;
    }
    if (minimum == maximum) {
        return minimum;
    }
    
    let x = Math.floor(Math.random() * maximum) + minimum;
    while (x >= maximum) {
      x = Math.floor(Math.random() * maximum) + minimum;
    }
    
    return x;
}

function initGame(){
    let l = problems.length;
    let rnd = Math.random();
    console.log(rnd);
    if (l > 0 && rnd > 0.5) {
        let index = getRandom(1, l) - 1;
        console.log(l, index, problems[index]);
        let selectedProblem = problems[index];
        a = selectedProblem.a;
        b = selectedProblem.b;
        problems.splice(index, index);
    }
    a = getRandom();
    b = getRandom();
    
    $('#problem').text(`${a} x ${b}`);
    $('#score').text(score);
    $('#errors').text(errors);  
    $('#answer').focus();
}

function verifyResponse() {
    let solution = a * b;
    let answer = parseInt($('#answer').val()) || 0;
    $('#answer').val('');
    if (answer == solution) {
        $('#decision').html('Верно! Это действительно ' + solution);
        score++;
    } else {
        $('#decision').html('Неверно! На самом деле это ' + solution + ', а вовсе не ' + answer);
        problems.push({'a': a, 'b': b});
        errors++;
    }
    problemCounter++; 
    $('#score').text(score);
    $('#errors').text(errors);  
    initGame();
}
