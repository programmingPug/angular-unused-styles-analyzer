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
exports.UnusedStylesProvider = void 0;
const vscode = __importStar(require("vscode"));
class UnusedStylesProvider {
    constructor(analyzer, diagnosticCollection) {
        this.analyzer = analyzer;
        this.diagnosticCollection = diagnosticCollection;
    }
    async analyzeDocument(document) {
        if (!this.isAngularStyleFile(document.fileName)) {
            return;
        }
        const componentFiles = await this.analyzer.getComponentFiles(document);
        const unusedStyles = await this.analyzer.analyzeComponent(componentFiles);
        this.updateDiagnostics(document, unusedStyles);
    }
    async analyzeCurrentWorkspace() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            return;
        }
        for (const folder of workspaceFolders) {
            const pattern = new vscode.RelativePattern(folder, '**/*.component.{scss,css}');
            const files = await vscode.workspace.findFiles(pattern);
            for (const file of files) {
                const document = await vscode.workspace.openTextDocument(file);
                await this.analyzeDocument(document);
            }
        }
        vscode.window.showInformationMessage('Angular unused styles analysis completed!');
    }
    updateDiagnostics(document, unusedStyles) {
        const diagnostics = unusedStyles.map(unused => {
            const range = new vscode.Range(unused.line, unused.character, unused.line, unused.character + unused.length);
            const diagnostic = new vscode.Diagnostic(range, unused.reason, vscode.DiagnosticSeverity.Warning);
            diagnostic.source = 'Angular Unused Styles';
            diagnostic.code = 'unused-style';
            return diagnostic;
        });
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    isAngularStyleFile(fileName) {
        return fileName.endsWith('.component.scss') || fileName.endsWith('.component.css');
    }
}
exports.UnusedStylesProvider = UnusedStylesProvider;
//# sourceMappingURL=UnusedStylesProvider.js.map