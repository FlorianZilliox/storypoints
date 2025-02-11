const fibonacci = [1, 2, 3, 5, 8, 13, 21, 34];

let selections = {
    knowledge: null,
    dependencies: null,
    risk: null,
    duration: null
};

function selectOption(dimension, value) {
    selections[dimension] = value;
    
    const buttons = document.querySelectorAll(`#${dimension} button`);
    buttons.forEach((btn) => {
        const btnValue = parseInt(btn.onclick.toString().match(/\d+/g).pop());
        btn.classList.toggle('selected', btnValue === value);
    });
    
    // Check for SPIKE immediately when Knowledge is unclear
    if (dimension === 'knowledge' && value === 3) {
        document.querySelector('.result-label').textContent = 'SPIKE NEEDED';
        document.querySelector('.result-value').textContent = '';
        document.getElementById('result').classList.add('spike');
        return;
    }
    
    calculatePoints();
}

function findClosestFibonacci(num) {
    return fibonacci.reduce((prev, curr) => {
        return (Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
    });
}

function calculatePoints() {
    if (Object.values(selections).some(v => v === null)) {
        document.querySelector('.result-label').textContent = 'Story Points';
        document.querySelector('.result-value').textContent = '--';
        document.getElementById('result').classList.remove('spike');
        return;
    }

    if (selections.knowledge === 3) {
        document.querySelector('.result-label').textContent = 'SPIKE NEEDED';
        document.querySelector('.result-value').textContent = '';
        document.getElementById('result').classList.add('spike');
        return;
    }

    let baseScore = selections.duration;
    let multiplier = 1;
    
    // Knowledge impact
    if (selections.knowledge === 2) multiplier += 0.6;      // Partly Clear
    if (selections.knowledge === 1) multiplier += 0;        // Very Clear
    
    // Dependencies impact
    if (selections.dependencies === 3) multiplier += 1.2;   // Many dependencies
    if (selections.dependencies === 2) multiplier += 0.6;   // Few dependencies
    if (selections.dependencies === 1) multiplier += 0;     // No dependencies
    
    // Risk/Testing impact
    if (selections.risk === 3) multiplier += 1.2;          // High risk
    if (selections.risk === 2) multiplier += 0.6;          // Medium risk
    if (selections.risk === 1) multiplier += 0;            // Low risk
    
    let finalScore = baseScore * multiplier;
    
    // Special rules for small tasks with unfavorable factors
    if (baseScore <= 2) {
        let badFactors = 0;
        if (selections.knowledge === 2) badFactors++;       // Partly Clear compte comme facteur défavorable pour les petites tâches
        if (selections.dependencies === 3) badFactors++;
        if (selections.risk === 3) badFactors++;
        
        if (badFactors >= 2) {
            finalScore = Math.max(finalScore, 5);
        } else if (badFactors === 1) {
            finalScore = Math.max(finalScore, 3);
        }
    }
    
    const points = findClosestFibonacci(finalScore);
    
    document.querySelector('.result-label').textContent = 'Story Points';
    document.querySelector('.result-value').textContent = points;
    document.getElementById('result').classList.remove('spike');
}
