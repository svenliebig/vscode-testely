
import * as vscode from 'vscode';
import { GeneratorError } from '../generators/Generator';
import { getGeneratorByLanguageId } from "../generators/getGeneratorByLanguageId";

export async function createTestCommand(document: vscode.TextDocument) {
	if (document.isUntitled) {
		vscode.window.showErrorMessage("Can't create a test from an untitled file.");
		return;
	}

	if (document.uri.scheme !== "file") {
		vscode.window.showErrorMessage(`File scheme ${document.uri.scheme} is not supported.`);
		return;
	}

	const generator = getGeneratorByLanguageId(document);

	try {
		const filePath = await generator.generate();
		const testFileUri = vscode.Uri.file(filePath);
		
		// refactor: fn open doc by fileName
		const doc = await vscode.workspace.openTextDocument(testFileUri);
		vscode.window.showTextDocument(doc, 1, false);
	} catch(e) {
		if (e instanceof GeneratorError) {
			vscode.window.showErrorMessage(e.message);
		}
	}
}