import * as vscode from 'vscode';
import { ComponentFiles } from '../types/ComponentInterfaces';

export class FileResolver {
    async getComponentFiles(document: vscode.TextDocument): Promise<ComponentFiles> {
        const basePath = this.getBasePath(document.fileName);
        const componentFiles: ComponentFiles = {};
        
        if (document.fileName.endsWith('.component.ts')) {
            componentFiles.typescript = document;
        } else if (document.fileName.endsWith('.component.html')) {
            componentFiles.html = document;
        } else if (document.fileName.endsWith('.component.scss') || document.fileName.endsWith('.component.css')) {
            componentFiles.styles = document;
        }
        
        // Try to find related files
        try {
            if (!componentFiles.typescript) {
                const tsFile = await vscode.workspace.openTextDocument(basePath + '.component.ts');
                componentFiles.typescript = tsFile;
            }
            if (!componentFiles.html) {
                const htmlFile = await vscode.workspace.openTextDocument(basePath + '.component.html');
                componentFiles.html = htmlFile;
            }
            if (!componentFiles.styles) {
                try {
                    const scssFile = await vscode.workspace.openTextDocument(basePath + '.component.scss');
                    componentFiles.styles = scssFile;
                } catch {
                    try {
                        const cssFile = await vscode.workspace.openTextDocument(basePath + '.component.css');
                        componentFiles.styles = cssFile;
                    } catch {
                        // No styles file found
                    }
                }
            }
        } catch (error) {
            // Some files might not exist, which is fine
        }
        
        return componentFiles;
    }
    
    private getBasePath(fileName: string): string {
        return fileName.replace(/\.(component\.(ts|html|scss|css))$/, '');
    }
}