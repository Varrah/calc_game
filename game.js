let a = 0;
let b = 0;
let index = 0;
let score = 0;
let errors = 0;
const maxProblems = 10;
const maxMultiplication = 10;
const maxDivision = 10;
const maxAddition = 100;
const maxSubtraction = 100;
let problems = [];
let heapMap = {
    multiplication: [],
    division: [],
    addition: [],
    subtraction: [],
    maxMultiplicationAvgTime: 0,
    maxDivisionAvgTime: 0,
    maxAdditionAvgTime: 0,
    maxSubtractionAvgTime: 0,
};
const initialErrorsCount = 0;
const maxErrorsOnHeatMap = 5;
let startTime = 0;
let overallAvgTime = 0;

function initHeapMap(actionType = 'multiplication') {
    let maxOperand =
        actionType === 'multiplication'
            ? maxMultiplication
            : actionType === 'division'
                ? maxDivision
                : actionType === 'addition'
                    ? maxAddition
                    : maxSubtraction;
    // Using 3 as initial number of errors, if user is able to make three correct answers, then the problem is treated as learned
    for (let i = 2; i <= maxOperand; i++) {
        for (let j = 2; j <= maxOperand; j++) {
            heapMap.multiplication.push({a: i, b: j, errors: initialErrorsCount, lastTime: 0});
            heapMap.division.push({a: i, b: j, errors: initialErrorsCount, lastTime: 0});
            heapMap.addition.push({a: i, b: j, errors: initialErrorsCount, lastTime: 0});
            heapMap.subtraction.push({a: i, b: j, errors: initialErrorsCount, lastTime: 0});
        }
    }
}

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
    if (minimum === maximum) {
        return minimum;
    }
    
    let x = Math.floor(Math.random() * maximum) + minimum;
    while (x >= maximum) {
      x = Math.floor(Math.random() * maximum) + minimum;
    }
    
    return x;
}

function initGame(){
    loadHeatMap();
    displayHeatMap();
    confirm('Готовы начать?');
    nextMove();
}

function nextMove(actionType = 'multiplication') {
    displayHeatMap(actionType);
    problems = [];
    //make a set of problems based on the actionType and the heapMap
    for (let i = 0; i < heapMap[actionType].length; i++) {
        let problem = heapMap[actionType][i];
        for (let j = 0; j < problem.errors + 1; j++) {
            problems.push(problem);
        }
    }

    let l = problems.length;
    let index = getRandom(1, l) - 1;
    let selectedProblem = problems[index];
    a = selectedProblem.a;
    b = selectedProblem.b;

    actionSign = actionType === 'multiplication' ? 'x' : actionType === 'division' ? '/' : actionType === 'addition' ? '+' : '-';

    $('#problem').text(`${a} ${actionSign} ${b}`);
    $('#score').text(score);
    $('#errors').text(errors);  
    $('#answer').focus();
    startTime = new Date().getTime();
}

function updateHeatMap(actionType, lastTime, isCorrect = true) {
    let index = 0;
    while (heapMap[actionType][index].a !== a || heapMap[actionType][index].b !== b) {
        index++;
    }
    if (isCorrect) {
        heapMap[actionType][index].errors = Math.max(0, heapMap[actionType][index].errors - 1);
    } else {
        heapMap[actionType][index].errors++;
    }
    heapMap[actionType][index].lastTime = lastTime;
}

function verifyResponse(actionType = 'multiplication') {
    let endTime = new Date().getTime();
    let lastTime = endTime - startTime;
    let solution = a * b;
    let answer = parseInt($('#answer').val()) || 0;
    $('#answer').val('');
    if (answer == solution) {
        $('#decision').html('Верно! Это действительно ' + solution);
        updateHeatMap(actionType, lastTime, true);
        score++;
    } else {
        $('#decision').html('Неверно! На самом деле это ' + solution + ', а вовсе не ' + answer);
        updateHeatMap(actionType, lastTime, false);
        errors++;
    }
    $('#score').text(score);
    $('#errors').text(errors);
    // avgTime has to be formatted to mm:ss.ms
    $('#avg-time').text(new Date(overallAvgTime).toISOString().substr(14, 5) + '.' + overallAvgTime.toString().substr(-3));
    $('#time').text(new Date(lastTime).toISOString().substr(14, 5) + '.' + lastTime.toString().substr(-3))
    storeHeatMap();
    nextMove();
}

function displayHeatMap(actionType = 'multiplication') {
    // Heatmap would be a table with rows for a and columns for b
    // Each cell would be more red if the number of errors is higher or more green if the number of errors is lower
    let maxOperand =
        actionType === 'multiplication'
            ? maxMultiplication
            : actionType === 'division'
                ? maxDivision
                : actionType === 'addition'
                    ? maxAddition
                    : maxSubtraction;

    let actionSign =
        actionType === 'multiplication'
            ? 'x'
            : actionType === 'division'
                ? '/'
                : actionType === 'addition'
                    ? '+'
                    : '-';

    $('#heatmap').html('');
    let table = $('<table>');
    let row = $('<tr>');
    let cell = $('<th>');
    cell.text('x');
    row.append(cell);
    for (let i = 2; i <= maxOperand; i++) {
        cell = $('<th colspan="2">');
        cell.text(i);
        row.append(cell);
    }
    table.append(row);

    let avgSum = 0;
    let avgTimecounter = 0;
    let index = 0;
    for (let i = 2; i <= maxOperand; i++) {
        row = $('<tr>');
        cell = $('<th>');
        cell.text(i);
        row.append(cell);
        for (let j = 2; j <= maxOperand; j++) {
            if (heapMap[actionType][index].lastTime) {
                avgSum += heapMap[actionType][index].lastTime;
            }
            let cell = $('<td>');
            let errors = Math.min(heapMap[actionType][index].errors, maxErrorsOnHeatMap);
            // maxErrorsOnHeatMap/errors=255/errorColor => errorColor = 255 / (maxErrorsOnHeatMap * errors)
            let errorColor = 255 / (maxErrorsOnHeatMap * errors);
            let transparency = heapMap[actionType][index].lastTime / overallAvgTime;
            cell.css('background-color', `rgba(${255 - errorColor}, ${errorColor}, 0, ${transparency})`);
            row.append(cell);
            // if the last time is as quick as the average time or less, the number should be higher than the others
            // if the last time is slower than the average time, the number should be lower than the others
            // but number should be in the range of 0-255
            // hence
            let avgTimeColor = Math.round(255 * (heapMap[actionType][index].lastTime / overallAvgTime));
            cell = $('<td>');
            cell.css('background-color', `rgb(${avgTimeColor},${avgTimeColor},${avgTimeColor})`);
            // cell.text(`${heapMap[actionType][index].a}${actionSign}${heapMap[actionType][index].b}: ${errors}`);
            row.append(cell);
            index++;
        }
        table.append(row);
    }
    overallAvgTime = avgSum / index;
    $('#heatmap').append(table);
}

function storeHeatMap() {
        localStorage.setItem('heapMap', JSON.stringify(heapMap));
}

function loadHeatMap() {
    let storedHeatMap = localStorage.getItem('heapMap');
    if (storedHeatMap) {
        heapMap = JSON.parse(storedHeatMap);
    } else {
        initHeapMap();
    }
}
