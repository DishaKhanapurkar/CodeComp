import * as vscode from "vscode";

export function getTerminalColor(complexity: string): string {
  if (complexity.includes("n^2") || complexity.includes("n^3")) {
    return "\x1b[31m"; // RED → High
  }

  if (complexity.includes("n")) {
    return "\x1b[33m"; // YELLOW → Medium
  }

  return "\x1b[32m"; // GREEN → Low
}

export function getComplexityLevel(complexity: string): string {
  if (complexity.includes("n^2") || complexity.includes("n^3")) {
    return "HIGH";
  }

  if (complexity.includes("n")) {
    return "MEDIUM";
  }

  return "LOW";
}
