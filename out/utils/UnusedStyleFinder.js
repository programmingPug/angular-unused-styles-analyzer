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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnusedStyleFinder = void 0;
const vscode = __importStar(require("vscode"));
const SelectorMatcher_1 = require("./SelectorMatcher");
class UnusedStyleFinder {
    constructor() {
        this.selectorMatcher = new SelectorMatcher_1.SelectorMatcher();
    }
    findUnusedStyles(cssSelectors, usedSelectors, styleDocument) {
        const unused = [];
        const config = vscode.workspace.getConfiguration('angularUnusedStyles');
        const ignoredSelectors = config.get('ignoredSelectors', []);
        for (const [selector, position] of cssSelectors.entries()) {
            if (this.selectorMatcher.shouldIgnoreSelector(selector, ignoredSelectors)) {
                continue;
            }
            if (!this.selectorMatcher.isSelectorUsed(selector, usedSelectors)) {
                unused.push({
                    selector,
                    line: position.line,
                    character: position.character,
                    length: position.length,
                    reason: `Style '${selector}' appears to be unused`
                });
            }
        }
        return unused;
    }
}
exports.UnusedStyleFinder = UnusedStyleFinder;
//# sourceMappingURL=UnusedStyleFinder.js.map