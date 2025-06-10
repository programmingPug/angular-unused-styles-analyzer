import * as vscode from 'vscode';
import { AngularComponentAnalyzer } from '../analyzer/AngularComponentAnalyzer';
import { UnusedStyle } from '../types/ComponentInterfaces';

export class UnusedStylesProvider {
    constructor(
        private analyzer: AngularComponentAnalyzer,
        private diagnosticCollection: vscode.DiagnosticCollection
    ) {}
    
    async analyzeDocument(document: vscode.TextDocument) {
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
    
    private updateDiagnostics(document: vscode.TextDocument, unusedStyles: UnusedStyle[]) {
        const diagnostics: vscode.Diagnostic[] = unusedStyles.map(unused => {
            const range = new vscode.Range(
                unused.line,
                unused.character,
                unused.line,
                unused.character + unused.length
            );
            
            const diagnostic = new vscode.Diagnostic(
                range,
                unused.reason,
                vscode.DiagnosticSeverity.Warning
            );
            
            diagnostic.source = 'Angular Unused Styles';
            diagnostic.code = 'unused-style';
            
            return diagnostic;
        });
        
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    
    private isAngularStyleFile(fileName: string): boolean {
        return fileName.endsWith('.component.scss') || fileName.endsWith('.component.css');
    }
}