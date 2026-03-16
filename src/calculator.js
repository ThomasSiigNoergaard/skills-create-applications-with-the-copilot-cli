#!/usr/bin/env node

'use strict';

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), power (^), and squareRoot (sqrt).

function addition(left, right) {
  return left + right;
}

function subtraction(left, right) {
  return left - right;
}

function multiplication(left, right) {
  return left * right;
}

function division(left, right) {
  if (right === 0) {
    throw new Error('Division by zero is not allowed.');
  }

  return left / right;
}

function modulo(left, right) {
  if (right === 0) {
    throw new Error('Modulo by zero is not allowed.');
  }

  return left % right;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(value) {
  if (value < 0) {
    throw new Error('Square root is not defined for negative numbers.');
  }

  return Math.sqrt(value);
}

const binaryOperations = {
  '+': addition,
  '-': subtraction,
  '*': multiplication,
  '/': division,
  '%': modulo,
  '^': power,
};

const unaryOperations = {
  sqrt: squareRoot,
  squareRoot,
};

function parseNumber(value, label) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Invalid ${label}: "${value}". Please provide a valid number.`);
  }

  return parsedValue;
}

function calculate(left, operator, right) {
  const binaryOperation = binaryOperations[operator];

  if (binaryOperation) {
    return binaryOperation(left, right);
  }

  const unaryOperation = unaryOperations[operator];

  if (unaryOperation) {
    return unaryOperation(left);
  }

  throw new Error(
    `Unsupported operation: "${operator}". Use one of: ${[
      ...Object.keys(binaryOperations),
      ...Object.keys(unaryOperations),
    ].join(', ')}.`
  );
}

function runCli(argv = process.argv.slice(2)) {
  if (argv.length === 2) {
    const [operator, valueInput] = argv;

    if (!unaryOperations[operator]) {
      throw new Error(
        'Usage: node src/calculator.js <number> <operator> <number> or node src/calculator.js sqrt <number>'
      );
    }

    const value = parseNumber(valueInput, 'number');
    const result = calculate(value, operator);

    console.log(result);
    return;
  }

  if (argv.length !== 3) {
    throw new Error(
      'Usage: node src/calculator.js <number> <operator> <number> or node src/calculator.js sqrt <number>'
    );
  }

  const [leftInput, operator, rightInput] = argv;
  const left = parseNumber(leftInput, 'first number');
  const right = parseNumber(rightInput, 'second number');
  const result = calculate(left, operator, right);

  console.log(result);
}

if (require.main === module) {
  try {
    runCli();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
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
};
