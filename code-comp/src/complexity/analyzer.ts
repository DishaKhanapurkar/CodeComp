import { FunctionComplexity } from "./types";
import { BigO } from './types';
import { Confidence } from './types';


export function analyzeAST(ast: any): FunctionComplexity[] {
  const results: FunctionComplexity[] = [];

  function visit(node: any) {
    if (!node) return;

    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      const name = node.id?.name || '(anonymous)';
      const line = node.loc.start.line;

      const analysis = analyzeFunctionBody(node.body);

      results.push({
        name,
        line,
        complexity: analysis.complexity,
        confidence: analysis.confidence,
      });
    }

    for (const key in node) {
      const value = node[key];
      if (Array.isArray(value)) value.forEach(visit);
      else if (typeof value === 'object') visit(value);
    }
  }

  visit(ast);
  return results;
}
function analyzeFunctionBody(body: any): {
  complexity: BigO;
  confidence: Confidence;
} {

  let loopDepth = 0;
  let maxDepth = 0;
  let hasSqrt = false;

  function walk(node: any) {
    if (!node) return;

    if (
      node.type === 'ForStatement' ||
      node.type === 'WhileStatement'
    ) {
      loopDepth++;
      maxDepth = Math.max(maxDepth, loopDepth);

      if (isSqrtLoop(node.test)) {
        hasSqrt = true;
      }

      walk(node.body);
      loopDepth--;
    }

    for (const key in node) {
      const value = node[key];
      if (Array.isArray(value)) value.forEach(walk);
      else if (typeof value === 'object') walk(value);
    }
  }

  walk(body);

  if (hasSqrt) {
    return { complexity: 'O(√n)', confidence: 'High' };
  }

  if (maxDepth === 0) return { complexity: 'O(1)', confidence: 'High' };
  if (maxDepth === 1) return { complexity: 'O(n)', confidence: 'High' };
  if (maxDepth === 2) return { complexity: 'O(n^2)', confidence: 'High' };

  return { complexity: 'O(?)', confidence: 'Low' };
  
}

function isSqrtLoop(test: any): boolean {
  if (!test) return false;

  // i * i <= n
  if (
    test.type === 'BinaryExpression' &&
    test.left?.type === 'BinaryExpression' &&
    test.left.operator === '*'
  ) {
    return true;
  }

  // i <= Math.sqrt(n)
  if (
    test.right?.callee?.object?.name === 'Math' &&
    test.right?.callee?.property?.name === 'sqrt'
  ) {
    return true;
  }

  return false;
}
