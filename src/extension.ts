import * as vscode from 'vscode';
import { AngularComponentAnalyzer } from './analyzer/AngularComponentAnalyzer';
import { UnusedStylesProvider } from './providers/UnusedStylesProvider';

let analyzer: AngularComponentAnalyzer;
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    analyzer = new AngularComponentAnalyzer();
    diagnosticCollection = vscode.languages.createDiagnosticCollection('angular-unused-styles');
    
    const provider = new UnusedStylesProvider(analyzer, diagnosticCollection);
    
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
    
    context.subscriptions.push(
        analyzeCommand,
        onDidChangeTextDocument,
        onDidOpenTextDocument,
        diagnosticCollection
    );
}

function isAngularFile(fileName: string): boolean {
    return fileName.endsWith('.component.ts') || 
           fileName.endsWith('.component.html') || 
           fileName.endsWith('.component.scss') ||
           fileName.endsWith('.component.css');
}

export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}