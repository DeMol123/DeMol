function createPuzzle(config) {
  const { word, hint, guesser, maxGuesses, message, length, id } = config;
  const upperWord = word.toUpperCase();

  let attemptsUsed = parseInt(localStorage.getItem(`attempts_${id}`) || "0");
  let solved = localStorage.getItem(`solved_${id}`) === "true";
  let attemptsData = JSON.parse(localStorage.getItem(`attemptsData_${id}`) || "[]");

  const guesserEl = document.getElementById('guesser');
  const hintEl = document.getElementById('hint');
  const lengthEl = document.getElementById('length');
  const remainingEl = document.getElementById('remaining');
  const input = document.getElementById('guessInput');
  const grid = document.getElementById('grid');
  const result = document.getElementById('result');

  guesserEl.innerText = `Agent: ${guesser}`;
  hintEl.innerText = `Hint: ${hint}`;
  lengthEl.innerText = `Woordlengte: ${length}`;

  function updateRemaining() {
    remainingEl.innerText = `Resterende pogingen: ${maxGuesses - attemptsUsed}`;
  }

  function updateOverview() {
    const overview = JSON.parse(localStorage.getItem('moleOverview') || '[]');
    const list = document.getElementById('overviewList');
    list.innerHTML = '';
    overview.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.word} → ${item.message}`;
      list.appendChild(li);
    });
  }

  function renderAttempt(guess) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let i = 0; i < length; i++) {
      const cell = document.createElement('div');
      cell.className = 'letter';
      const letter = guess[i];
      cell.textContent = letter;
      if (letter === upperWord[i]) {
        cell.classList.add('correct');
      } else if (upperWord.includes(letter)) {
        cell.classList.add('present');
      } else {
        cell.classList.add('absent');
      }
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }

  // Toon eerdere pogingen opnieuw bij herladen
  attemptsData.forEach(g => renderAttempt(g));

  updateRemaining();
  updateOverview();

  if (solved) {
    result.innerHTML = `🎉 Geheime boodschap vrijgegeven: ${message}`;
  }

  document.getElementById('submitGuess').addEventListener('click', () => {
    if (solved || attemptsUsed >= maxGuesses) return;

    const guess = input.value.toUpperCase();
    if (guess.length !== length) {
      alert(`Je gok moet ${length} letters bevatten.`);
      return;
    }

    attemptsUsed++;
    attemptsData.push(guess);

    localStorage.setItem(`attempts_${id}`, attemptsUsed);
    localStorage.setItem(`attemptsData_${id}`, JSON.stringify(attemptsData));
    updateRemaining();

    renderAttempt(guess);

    if (guess === upperWord) {
      solved = true;
      localStorage.setItem(`solved_${id}`, "true");
      result.innerHTML = `🎉 Geheime boodschap vrijgegeven: ${message}`;

      const overview = JSON.parse(localStorage.getItem('moleOverview') || '[]');
      if (!overview.some(item => item.word === word)) {
        overview.push({ word, message });
        localStorage.setItem('moleOverview', JSON.stringify(overview));
      }
      updateOverview();
    } else if (attemptsUsed >= maxGuesses) {
      result.innerHTML = `❌ Geen pogingen meer!.`;
    }

    input.value = '';
  });
}
