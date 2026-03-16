#!/usr/bin/env node

'use strict';

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/).

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

const operations = {
  '+': addition,
  '-': subtraction,
  '*': multiplication,
  '/': division,
};

function parseNumber(value, label) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Invalid ${label}: "${value}". Please provide a valid number.`);
  }

  return parsedValue;
}

function calculate(left, operator, right) {
  const operation = operations[operator];

  if (!operation) {
    throw new Error(
      `Unsupported operation: "${operator}". Use one of: ${Object.keys(operations).join(', ')}.`
    );
  }

  return operation(left, right);
}

function runCli(argv = process.argv.slice(2)) {
  if (argv.length !== 3) {
    throw new Error('Usage: node src/calculator.js <number> <operator> <number>');
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
  calculate,
  parseNumber,
  runCli,
};
