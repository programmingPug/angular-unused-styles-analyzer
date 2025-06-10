"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorMatcher = void 0;
class SelectorMatcher {
    isSelectorUsed(cssSelector, usedSelectors) {
        // Clean the CSS selector for comparison
        const cleanSelector = this.cleanCSSSelector(cssSelector);
        // Check for exact matches
        if (usedSelectors.has(cleanSelector)) {
            return true;
        }
        // Check for partial matches (class and ID selectors)
        for (const used of usedSelectors) {
            if (this.selectorsMatch(cleanSelector, used)) {
                return true;
            }
        }
        return false;
    }
    shouldIgnoreSelector(selector, ignoredSelectors) {
        return ignoredSelectors.some(ignored => selector.includes(ignored) ||
            selector.match(new RegExp(ignored.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
    }
    cleanCSSSelector(selector) {
        // Remove pseudo-classes, pseudo-elements, and complex selectors
        return selector
            .replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '') // Remove pseudo-classes/elements
            .replace(/\s*[>+~]\s*/g, ' ') // Simplify combinators
            .replace(/\[.*?\]/g, '') // Remove attribute selectors
            .trim();
    }
    selectorsMatch(cssSelector, usedSelector) {
        // Extract class names and IDs
        const cssClasses = cssSelector.match(/\.[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];
        const cssIds = cssSelector.match(/#[a-zA-Z_-][a-zA-Z0-9_-]*/g) || [];
        return [...cssClasses, ...cssIds].some(sel => usedSelector.includes(sel.substring(1)) // Remove . or # prefix
        );
    }
}
exports.SelectorMatcher = SelectorMatcher;
//# sourceMappingURL=SelectorMatcher.js.map