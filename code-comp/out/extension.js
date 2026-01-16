"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
// FORCE dotenv to load from project root
dotenv.config({
    path: path.resolve(__dirname, "..", ".env")
});
console.log("FORCED ENV CHECK:", process.env.OPENAI_API_KEY ? "FOUND" : "MISSING");
const vscode = __importStar(require("vscode"));
const color_1 = require("./complexity/color");
const openaiFallback_1 = require("./llmfallback/openaiFallback");
let cachedResults = [];
function activate(context) {
    const analyzeCommand = vscode.commands.registerCommand("complexityAnalyzer.analyze", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found");
            return;
        }
        const document = editor.document;
        cachedResults = analyzeDocument(document);
        const terminal = vscode.window.activeTerminal ||
            vscode.window.createTerminal("Time Complexity Analyzer");
        terminal.show();
        for (const r of cachedResults) {
            let complexity = r.complexity;
            // 🔁 LLM FALLBACK
            if (r.confidence === "Low" || complexity === "O(?)") {
                const functionCode = document.getText(document.lineAt(r.line - 1).range);
                complexity = await (0, openaiFallback_1.estimateComplexityWithLLM)(functionCode);
                r.complexity = complexity;
                r.confidence = "LLM";
            }
            const color = (0, color_1.getTerminalColor)(complexity);
            const level = (0, color_1.getComplexityLevel)(complexity);
            terminal.sendText(`${color}[${level}] ${r.name} → ${complexity}\x1b[0m`);
        }
    });
    context.subscriptions.push(analyzeCommand);
}
/**
 * ⚙️ Your existing static analysis logic
 * (keep this exactly as you had it — example below)
 */
function analyzeDocument(document) {
    const results = [];
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
function deactivate() { }
//# sourceMappingURL=extension.js.map