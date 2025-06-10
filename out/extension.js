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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const AngularComponentAnalyzer_1 = require("./analyzer/AngularComponentAnalyzer");
const UnusedStylesProvider_1 = require("./providers/UnusedStylesProvider");
let analyzer;
let diagnosticCollection;
function activate(context) {
    analyzer = new AngularComponentAnalyzer_1.AngularComponentAnalyzer();
    diagnosticCollection = vscode.languages.createDiagnosticCollection('angular-unused-styles');
    const provider = new UnusedStylesProvider_1.UnusedStylesProvider(analyzer, diagnosticCollection);
    // Register command
    const analyzeCommand = vscode.commands.registerCommand('angular-unused-styles.analyze', () => {
        provider.analyzeCurrentWorkspace();
    });
    // Register document change handlers
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => {
        if (isAngularFile(event.document.fileName)) {
            provider.analyzeDocument(event.document);
        }
    });
    const onDidOpenTextDocument = vscode.workspace.onDidOpenTextDocument(document => {
        if (isAngularFile(document.fileName)) {
            provider.analyzeDocument(document);
        }
    });
    context.subscriptions.push(analyzeCommand, onDidChangeTextDocument, onDidOpenTextDocument, diagnosticCollection);
}
exports.activate = activate;
function isAngularFile(fileName) {
    return fileName.endsWith('.component.ts') ||
        fileName.endsWith('.component.html') ||
        fileName.endsWith('.component.scss') ||
        fileName.endsWith('.component.css');
}
function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map