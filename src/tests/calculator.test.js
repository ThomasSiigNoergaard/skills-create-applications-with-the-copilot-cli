'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const {
  addition,
  subtraction,
  multiplication,
  division,
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
});

describe('calculate', () => {
  test.each([
    [8, '+', 2, 10],
    [8, '-', 2, 6],
    [8, '*', 2, 16],
    [8, '/', 2, 4],
  ])('dispatches %d %s %d correctly', (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test('throws for an unsupported operator', () => {
    expect(() => calculate(8, 'x', 2)).toThrow('Unsupported operation: "x". Use one of: +, -, *, /.');
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

  test('throws usage guidance when the wrong number of arguments is provided', () => {
    expect(() => runCli(['2', '+'])).toThrow('Usage: node src/calculator.js <number> <operator> <number>');
  });

  test('throws for invalid CLI number input', () => {
    expect(() => runCli(['abc', '+', '3'])).toThrow(
      'Invalid first number: "abc". Please provide a valid number.'
    );
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

  test('returns a non-zero exit code and error message for division by zero', () => {
    const result = spawnSync(process.execPath, [calculatorPath, '20', '/', '0'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(1);
    expect(result.stderr.trim()).toBe('Division by zero is not allowed.');
  });
});
