"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularComponentAnalyzer = void 0;
const CSSAnalyzer_1 = require("./CSSAnalyzer");
const HTMLAnalyzer_1 = require("./HTMLAnalyzer");
const TypeScriptAnalyzer_1 = require("./TypeScriptAnalyzer");
const FileResolver_1 = require("../utils/FileResolver");
const UnusedStyleFinder_1 = require("../utils/UnusedStyleFinder");
class AngularComponentAnalyzer {
    constructor() {
        this.cssAnalyzer = new CSSAnalyzer_1.CSSAnalyzer();
        this.htmlAnalyzer = new HTMLAnalyzer_1.HTMLAnalyzer();
        this.tsAnalyzer = new TypeScriptAnalyzer_1.TypeScriptAnalyzer();
        this.fileResolver = new FileResolver_1.FileResolver();
        this.unusedStyleFinder = new UnusedStyleFinder_1.UnusedStyleFinder();
    }
    async analyzeComponent(componentFiles) {
        if (!componentFiles.styles) {
            return [];
        }
        const cssSelectors = this.cssAnalyzer.extractSelectors(componentFiles.styles);
        const htmlUsedSelectors = componentFiles.html ?
            this.htmlAnalyzer.extractUsedSelectors(componentFiles.html) : new Set();
        const tsUsedSelectors = componentFiles.typescript ?
            this.tsAnalyzer.extractDynamicSelectors(componentFiles.typescript) : new Set();
        const allUsedSelectors = new Set([...htmlUsedSelectors, ...tsUsedSelectors]);
        return this.unusedStyleFinder.findUnusedStyles(cssSelectors, allUsedSelectors, componentFiles.styles);
    }
    async getComponentFiles(document) {
        return this.fileResolver.getComponentFiles(document);
    }
}
exports.AngularComponentAnalyzer = AngularComponentAnalyzer;
//# sourceMappingURL=AngularComponentAnalyzer.js.map