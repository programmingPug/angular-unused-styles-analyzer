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
exports.FileResolver = void 0;
const vscode = __importStar(require("vscode"));
class FileResolver {
    async getComponentFiles(document) {
        const basePath = this.getBasePath(document.fileName);
        const componentFiles = {};
        if (document.fileName.endsWith('.component.ts')) {
            componentFiles.typescript = document;
        }
        else if (document.fileName.endsWith('.component.html')) {
            componentFiles.html = document;
        }
        else if (document.fileName.endsWith('.component.scss') || document.fileName.endsWith('.component.css')) {
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
                }
                catch {
                    try {
                        const cssFile = await vscode.workspace.openTextDocument(basePath + '.component.css');
                        componentFiles.styles = cssFile;
                    }
                    catch {
                        // No styles file found
                    }
                }
            }
        }
        catch (error) {
            // Some files might not exist, which is fine
        }
        return componentFiles;
    }
    getBasePath(fileName) {
        return fileName.replace(/\.(component\.(ts|html|scss|css))$/, '');
    }
}
exports.FileResolver = FileResolver;
//# sourceMappingURL=FileResolver.js.map