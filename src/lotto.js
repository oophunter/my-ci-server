/**
 * Generates a single lotto ticket with 6 unique random numbers between 1 and 45.
 * @returns {number[]} Array of 6 sorted unique integers.
 */
export function generateRandomLottoTicket() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    numbers.add(num);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Runs a simulation of 100 drawings, counts frequencies, and recommends the top 6 numbers.
 * Resolves frequency ties fairly by randomly choosing among tied candidates at the cutoff border.
 * 
 * @param {number} simulationCount Number of random drawings to simulate.
 * @returns {{ set: number[], frequencies: Object }} Recommended set and frequency mapping.
 */
export function runLottoSimulation(simulationCount = 100) {
  // Initialize frequencies for numbers 1 to 45
  const frequencies = {};
  for (let i = 1; i <= 45; i++) {
    frequencies[i] = 0;
  }

  // Generate 100 drawings and increment frequencies
  for (let i = 0; i < simulationCount; i++) {
    const ticket = generateRandomLottoTicket();
    for (const num of ticket) {
      frequencies[num]++;
    }
  }

  // Group numbers by frequency to handle ties fairly
  const countGroups = {};
  for (let num = 1; num <= 45; num++) {
    const count = frequencies[num];
    if (!countGroups[count]) {
      countGroups[count] = [];
    }
    countGroups[count].push(num);
  }

  // Sort frequencies descending
  const sortedCounts = Object.keys(countGroups)
    .map(Number)
    .sort((a, b) => b - a);

  const selectedNumbers = [];
  
  for (const count of sortedCounts) {
    const numbersInGroup = countGroups[count];
    const needed = 6 - selectedNumbers.length;

    if (needed <= 0) break;

    if (numbersInGroup.length <= needed) {
      // If we can fit the whole group, add them all
      selectedNumbers.push(...numbersInGroup);
    } else {
      // If adding the whole group exceeds 6, randomly choose 'needed' numbers from this group
      const shuffledGroup = [...numbersInGroup].sort(() => Math.random() - 0.5);
      selectedNumbers.push(...shuffledGroup.slice(0, needed));
    }
  }

  // Sort final recommended set ascending
  const recommendedSet = selectedNumbers.sort((a, b) => a - b);

  return {
    set: recommendedSet,
    frequencies
  };
}

/**
 * Generates 5 recommended lotto sets by running the simulation 5 independent times.
 * @returns {Array<{ id: number, set: number[], frequencies: Object }>}
 */
export function generate5RecommendedSets() {
  const results = [];
  for (let i = 0; i < 5; i++) {
    const simulationResult = runLottoSimulation(100);
    results.push({
      id: i + 1,
      set: simulationResult.set,
      frequencies: simulationResult.frequencies
    });
  }
  return results;
}
