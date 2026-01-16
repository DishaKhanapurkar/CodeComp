"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCode = parseCode;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
function parseCode(code) {
    return (0, typescript_estree_1.parse)(code, {
        loc: true,
        range: true,
        comment: false,
    });
}
//# sourceMappingURL=parser.js.map