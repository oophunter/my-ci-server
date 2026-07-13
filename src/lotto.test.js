import { generateRandomLottoTicket, runLottoSimulation, generate5RecommendedSets } from './lotto.js';

describe('Lotto Generator Core Logic', () => {
  
  describe('generateRandomLottoTicket', () => {
    test('should return an array of 6 numbers', () => {
      const ticket = generateRandomLottoTicket();
      expect(Array.isArray(ticket)).toBe(true);
      expect(ticket.length).toBe(6);
    });

    test('should contain numbers strictly between 1 and 45', () => {
      const ticket = generateRandomLottoTicket();
      ticket.forEach(num => {
        expect(Number.isInteger(num)).toBe(true);
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(45);
      });
    });

    test('should contain unique numbers', () => {
      const ticket = generateRandomLottoTicket();
      const uniqueSet = new Set(ticket);
      expect(uniqueSet.size).toBe(6);
    });

    test('should be sorted in ascending numerical order', () => {
      const ticket = generateRandomLottoTicket();
      const sorted = [...ticket].sort((a, b) => a - b);
      expect(ticket).toEqual(sorted);
    });
  });

  describe('runLottoSimulation', () => {
    test('should generate a set of 6 numbers and a frequency map', () => {
      const result = runLottoSimulation(100);
      expect(result).toHaveProperty('set');
      expect(result).toHaveProperty('frequencies');
      
      expect(result.set.length).toBe(6);
      expect(Object.keys(result.frequencies).length).toBe(45);
    });

    test('should have frequency counts sum up to 6 * simulationCount', () => {
      const simulationCount = 50;
      const result = runLottoSimulation(simulationCount);
      
      let sum = 0;
      for (let i = 1; i <= 45; i++) {
        sum += result.frequencies[i];
      }
      expect(sum).toBe(6 * simulationCount);
    });

    test('should pick numbers with highest frequencies (no unselected number should have strictly greater frequency than any selected number)', () => {
      const result = runLottoSimulation(100);
      const selected = result.set;
      const frequencies = result.frequencies;
      
      // Determine the minimum frequency of the selected numbers
      const minSelectedFreq = Math.min(...selected.map(num => frequencies[num]));
      
      // Determine the unselected numbers
      const unselected = [];
      for (let i = 1; i <= 45; i++) {
        if (!selected.includes(i)) {
          unselected.push(i);
        }
      }
      
      // Find the maximum frequency of the unselected numbers
      const maxUnselectedFreq = unselected.length > 0 
        ? Math.max(...unselected.map(num => frequencies[num]))
        : 0;
      
      // The min frequency among selected numbers must be >= the max frequency of any unselected numbers.
      // This validates that the selection algorithm correctly prioritized high-frequency items.
      expect(minSelectedFreq).toBeGreaterThanOrEqual(maxUnselectedFreq);
    });
  });

  describe('generate5RecommendedSets', () => {
    test('should return 5 recommended sets', () => {
      const results = generate5RecommendedSets();
      expect(results.length).toBe(5);
      
      results.forEach((item, index) => {
        expect(item.id).toBe(index + 1);
        expect(item.set.length).toBe(6);
        expect(Object.keys(item.frequencies).length).toBe(45);
      });
    });
  });
});
