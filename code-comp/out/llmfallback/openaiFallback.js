"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateComplexityWithLLM = estimateComplexityWithLLM;
const openai_1 = __importDefault(require("openai"));
let client = null;
function getClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is missing at runtime");
    }
    if (!client) {
        client = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return client;
}
async function estimateComplexityWithLLM(functionCode) {
    const openai = getClient();
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: `Return ONLY the Big-O time complexity of this function:\n\n${functionCode}`
            }
        ],
        temperature: 0
    });
    return response.choices[0].message.content?.trim() || "O(?)";
}
//# sourceMappingURL=openaiFallback.js.map