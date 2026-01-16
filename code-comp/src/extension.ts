import * as path from "path";
import * as dotenv from "dotenv";

// FORCE dotenv to load from project root
dotenv.config({
  path: path.resolve(__dirname, "..", ".env")
});

console.log(
  "FORCED ENV CHECK:",
  process.env.OPENAI_API_KEY ? "FOUND" : "MISSING"
);


import * as vscode from "vscode";
import { getTerminalColor, getComplexityLevel } from "./complexity/color";
import { estimateComplexityWithLLM } from "./llmfallback/openaiFallback";

interface ComplexityResult {
  name: string;
  complexity: string;
  confidence: "High" | "Low" | "LLM";
  line: number;
}

let cachedResults: ComplexityResult[] = [];

export function activate(context: vscode.ExtensionContext) {
  const analyzeCommand = vscode.commands.registerCommand(
    "complexityAnalyzer.analyze",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found");
        return;
      }

      const document = editor.document;
      cachedResults = analyzeDocument(document);

      const terminal =
        vscode.window.activeTerminal ||
        vscode.window.createTerminal("Time Complexity Analyzer");

      terminal.show();

      for (const r of cachedResults) {
        let complexity = r.complexity;

        // 🔁 LLM FALLBACK
        if (r.confidence === "Low" || complexity === "O(?)") {
          const functionCode = document.getText(
            document.lineAt(r.line - 1).range
          );

          complexity = await estimateComplexityWithLLM(functionCode);
          r.complexity = complexity;
          r.confidence = "LLM";
        }

        const color = getTerminalColor(complexity);
        const level = getComplexityLevel(complexity);

        terminal.sendText(
          `${color}[${level}] ${r.name} → ${complexity}\x1b[0m`
        );
      }
    }
  );

  context.subscriptions.push(analyzeCommand);
}

/**
 * ⚙️ Your existing static analysis logic
 * (keep this exactly as you had it — example below)
 */
function analyzeDocument(
  document: vscode.TextDocument
): ComplexityResult[] {
  const results: ComplexityResult[] = [];

  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i).text;

    if (line.includes("function")) {
      results.push({
        name: line.trim(),
        complexity: "O(?)",
        confidence: "Low",
        line: i + 1,
      });
    }
  }

  return results;
}

export function deactivate() {}
