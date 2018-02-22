import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vscode from 'vscode';

import {transform as combineImports} from './combineimports';
import {combineReplacements, doReplacements, Replacement} from './common/replace';
import {transform as replaceVars} from './novars';
import {transform as missingSemicolons} from './semicolon';

export function getLucidEdits(document: vscode.TextDocument, name: string): string {
    const contents = document.getText();
    const sourceFile = ts.createSourceFile(name, contents, ts.ScriptTarget.Latest, true);
    const transformFunctions = [
        missingSemicolons,
        replaceVars,
        combineImports,
    ];
    let replacements: Replacement[] = [];
    transformFunctions.forEach(f => replacements.push(...f(sourceFile)));
    replacements = combineReplacements(replacements);

    return doReplacements(contents, replacements);
}