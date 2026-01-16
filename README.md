AI-Assisted Time Complexity Analyzer (VS Code Extension)

A VS Code extension that analyzes the time complexity (Big-O) of functions using static code analysis with an AI fallback for complex cases such as recursion and exponential branching.

Designed to help developers reason about algorithmic performance early, directly inside the editor.

✨ Features

📐 Static Time Complexity Analysis

Detects common patterns such as:

Linear, quadratic, and cubic loops (O(n), O(n²), O(n³))

Logarithmic patterns (O(log n))

Divide-and-conquer recursion

🤖 AI (LLM) Fallback for Complex Logic

Automatically invokes an LLM when static analysis confidence is low

Handles:

Recursive algorithms

Exponential growth (O(2ⁿ))

Factorial complexity (O(n!))


Output displayed in the VS Code terminal
![WhatsApp Image 2026-01-16 at 18 11 48](https://github.com/user-attachments/assets/f0337e5d-a44d-4e5a-9f36-576456a433f2)


⚡ Cost-Aware & Secure

AI is used only when necessary

API keys are handled securely via environment configuration

🧩 Extensible Architecture

Full static analysis for TypeScript / Angular

AI-based analysis for other languages (e.g., Java)
