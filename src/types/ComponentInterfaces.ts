import * as vscode from 'vscode';

export interface ComponentFiles {
    typescript?: vscode.TextDocument;
    html?: vscode.TextDocument;
    styles?: vscode.TextDocument;
}

export interface UnusedStyle {
    selector: string;
    line: number;
    character: number;
    length: number;
    reason: string;
}

export interface SelectorPosition {
    line: number;
    character: number;
    length: number;
}