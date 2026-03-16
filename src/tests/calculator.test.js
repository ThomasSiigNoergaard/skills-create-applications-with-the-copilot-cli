'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
  calculate,
  parseNumber,
  runCli,
} = require('../calculator');

describe('calculator operation functions', () => {
  test('addition adds the numbers from the example image', () => {
    expect(addition(2, 3)).toBe(5);
  });

  test('subtraction subtracts the numbers from the example image', () => {
    expect(subtraction(10, 4)).toBe(6);
  });

  test('multiplication multiplies the numbers from the example image', () => {
    expect(multiplication(45, 2)).toBe(90);
  });

  test('division divides the numbers from the example image', () => {
    expect(division(20, 5)).toBe(4);
  });

  test('addition handles decimal values', () => {
    expect(addition(1.5, 2.25)).toBeCloseTo(3.75);
  });

  test('subtraction handles negative results', () => {
    expect(subtraction(3, 7)).toBe(-4);
  });

  test('multiplication handles negative factors', () => {
    expect(multiplication(-6, 3)).toBe(-18);
  });

  test('division throws for division by zero', () => {
    expect(() => division(8, 0)).toThrow('Division by zero is not allowed.');
  });

  test('modulo returns the remainder of a division', () => {
    expect(modulo(10, 3)).toBe(1);
  });

  test('modulo matches the extended example image', () => {
    expect(modulo(5, 2)).toBe(1);
  });

  test('modulo throws for division by zero', () => {
    expect(() => modulo(10, 0)).toThrow('Modulo by zero is not allowed.');
  });

  test('power raises a base to an exponent', () => {
    expect(power(2, 4)).toBe(16);
  });

  test('power matches the extended example image', () => {
    expect(power(2, 3)).toBe(8);
  });

  test('squareRoot returns the square root of a positive number', () => {
    expect(squareRoot(81)).toBe(9);
  });

  test('squareRoot matches the extended example image', () => {
    expect(squareRoot(16)).toBe(4);
  });

  test('squareRoot throws for a negative number', () => {
    expect(() => squareRoot(-1)).toThrow('Square root is not defined for negative numbers.');
  });
});

describe('calculate', () => {
  test.each([
    [8, '+', 2, 10],
    [8, '-', 2, 6],
    [8, '*', 2, 16],
    [8, '/', 2, 4],
    [8, '%', 3, 2],
    [5, '%', 2, 1],
    [2, '^', 5, 32],
    [2, '^', 3, 8],
  ])('dispatches %d %s %d correctly', (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test('dispatches square root correctly', () => {
    expect(calculate(25, 'sqrt')).toBe(5);
    expect(calculate(16, 'sqrt')).toBe(4);
    expect(calculate(36, 'squareRoot')).toBe(6);
  });

  test('throws for an unsupported operator', () => {
    expect(() => calculate(8, 'x', 2)).toThrow(
      'Unsupported operation: "x". Use one of: +, -, *, /, %, ^, sqrt, squareRoot.'
    );
  });
});

describe('parseNumber', () => {
  test('parses valid numeric strings', () => {
    expect(parseNumber('42.5', 'test number')).toBe(42.5);
  });

  test('throws for invalid numeric input', () => {
    expect(() => parseNumber('not-a-number', 'test number')).toThrow(
      'Invalid test number: "not-a-number". Please provide a valid number.'
    );
  });
});

describe('runCli', () => {
  test('prints the calculated result for valid CLI arguments', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    expect(() => runCli(['2', '+', '3'])).not.toThrow();
    expect(logSpy).toHaveBeenCalledWith(5);

    logSpy.mockRestore();
  });

  test('prints the calculated result for square root CLI arguments', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    expect(() => runCli(['sqrt', '49'])).not.toThrow();
    expect(logSpy).toHaveBeenCalledWith(7);

    logSpy.mockRestore();
  });

  test('prints the calculated results for the extended image operations', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    expect(() => runCli(['5', '%', '2'])).not.toThrow();
    expect(() => runCli(['2', '^', '3'])).not.toThrow();
    expect(() => runCli(['sqrt', '16'])).not.toThrow();
    expect(logSpy.mock.calls).toEqual([[1], [8], [4]]);

    logSpy.mockRestore();
  });

  test('throws usage guidance when the wrong number of arguments is provided', () => {
    expect(() => runCli(['2', '+'])).toThrow(
      'Usage: node src/calculator.js <number> <operator> <number> or node src/calculator.js sqrt <number>'
    );
  });

  test('throws for invalid CLI number input', () => {
    expect(() => runCli(['abc', '+', '3'])).toThrow(
      'Invalid first number: "abc". Please provide a valid number.'
    );
  });

  test('throws for invalid square root CLI input', () => {
    expect(() => runCli(['sqrt', '-9'])).toThrow('Square root is not defined for negative numbers.');
  });
});

describe('CLI integration', () => {
  const calculatorPath = path.join(__dirname, '..', 'calculator.js');

  test('returns the correct result for a valid command', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '20', '/', '5'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('4');
    expect(result.stderr).toBe('');
  });

  test('returns the correct result for a valid square root command', () => {
    const result = spawnSync(process.execPath, [calculatorPath, 'sqrt', '49'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('7');
    expect(result.stderr).toBe('');
  });

  test('returns the correct results for the extended image commands', () => {
    const moduloResult = spawnSync(process.execPath, [calculatorPath, '5', '%', '2'], {
      encoding: 'utf8',
    });
    const powerResult = spawnSync(process.execPath, [calculatorPath, '2', '^', '3'], {
      encoding: 'utf8',
    });
    const squareRootResult = spawnSync(process.execPath, [calculatorPath, 'sqrt', '16'], {
      encoding: 'utf8',
    });

    expect(moduloResult.status).toBe(0);
    expect(moduloResult.stdout.trim()).toBe('1');
    expect(powerResult.status).toBe(0);
    expect(powerResult.stdout.trim()).toBe('8');
    expect(squareRootResult.status).toBe(0);
    expect(squareRootResult.stdout.trim()).toBe('4');
  });

  test('returns a non-zero exit code and error message for division by zero', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '20', '/', '0'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr.trim()).toBe('Division by zero is not allowed.');
  });

  test('returns a non-zero exit code and error message for negative square root', () => {
    const result = spawnSync(process.execPath, [calculatorPath, 'sqrt', '-9'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr.trim()).toBe('Square root is not defined for negative numbers.');
  });
});
