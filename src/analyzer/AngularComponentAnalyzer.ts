import * as vscode from 'vscode';
import { CSSAnalyzer } from './CSSAnalyzer';
import { HTMLAnalyzer } from './HTMLAnalyzer';
import { TypeScriptAnalyzer } from './TypeScriptAnalyzer';
import { ComponentFiles, UnusedStyle } from '../types/ComponentInterfaces';
import { FileResolver } from '../utils/FileResolver';
import { UnusedStyleFinder } from '../utils/UnusedStyleFinder';

export class AngularComponentAnalyzer {
    private cssAnalyzer = new CSSAnalyzer();
    private htmlAnalyzer = new HTMLAnalyzer();
    private tsAnalyzer = new TypeScriptAnalyzer();
    private fileResolver = new FileResolver();
    private unusedStyleFinder = new UnusedStyleFinder();
    
    async analyzeComponent(componentFiles: ComponentFiles): Promise<UnusedStyle[]> {
        if (!componentFiles.styles) {
            return [];
        }
        
        const cssSelectors = this.cssAnalyzer.extractSelectors(componentFiles.styles);
        const htmlUsedSelectors: Set<string> = componentFiles.html ? 
            this.htmlAnalyzer.extractUsedSelectors(componentFiles.html) : new Set<string>();
        const tsUsedSelectors: Set<string> = componentFiles.typescript ? 
            this.tsAnalyzer.extractDynamicSelectors(componentFiles.typescript) : new Set<string>();
        
        const allUsedSelectors = new Set<string>([...htmlUsedSelectors, ...tsUsedSelectors]);
        
        return this.unusedStyleFinder.findUnusedStyles(cssSelectors, allUsedSelectors, componentFiles.styles);
    }
    
    async getComponentFiles(document: vscode.TextDocument): Promise<ComponentFiles> {
        return this.fileResolver.getComponentFiles(document);
    }
}