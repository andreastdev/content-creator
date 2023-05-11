import * as vscode from "vscode";
import { TextDecoder, TextEncoder } from "util";

import { Command } from "../abstractions";
import { ContentCell, ContentCellCollection } from "../notebooks/content/types";
import { JsonObject, fileExists, tryCatch, yamlToJson } from "../utilities";

export class ExportCommand implements Command {
    public readonly id = "creator.content.export";
    public readonly type = "command";

    @tryCatch()
    async handleRegistration?(data: {
        notebookEditor: {
            notebookUri: vscode.Uri;
        };
        ui: boolean;
    }): Promise<void> {
        const notebookUri = data.notebookEditor.notebookUri;

        const fileData = await this.readFileData(notebookUri);

        const metadata = this.generateMetadata(fileData);
        const content = this.generateContent(fileData);

        const output: JsonObject = {
            title: metadata.title ?? "Untitled",
            slug: metadata.slug ?? "untitled",
            description: metadata.description ?? "No description",
            imageUrl: metadata.imageUrl ?? "",
            createdDate: new Date().toISOString(),
            filters: metadata.filters ?? [],
            metadata: { ...metadata },
            content
        };

        const outputUri = vscode.Uri.file(
            notebookUri.fsPath.replace(/.[^.]*$/, ".json")
        );

        const result = await this.createOrUpdateJsonFile(outputUri, output);
        if (!result) {
            return;
        }

        const show = await vscode.window.showInformationMessage(
            `File has been ${result === "update" ? "updated" : "created"}.`,
            "Show File"
        );

        if (show === "Show File") {
            const document = await vscode.workspace.openTextDocument(outputUri);
            await vscode.window.showTextDocument(document);
        }
    }

    private async readFileData(
        notebookUri: vscode.Uri
    ): Promise<ContentCellCollection> {
        const fileData = await vscode.workspace.fs.readFile(notebookUri);
        const fileDataDecoded = new TextDecoder().decode(fileData);

        return <ContentCellCollection>JSON.parse(fileDataDecoded);
    }

    private async createOrUpdateJsonFile(
        uri: vscode.Uri,
        content: JsonObject
    ): Promise<"create" | "update" | undefined> {
        let output: "create" | "update" = "create";
        if (fileExists(uri.fsPath)) {
            const answer = await vscode.window.showWarningMessage(
                "The file already exists. Overwrite?",
                "Ok",
                "Cancel"
            );

            if (answer !== "Ok") {
                return;
            }

            output = "update";
        }

        const wsedit = new vscode.WorkspaceEdit();
        wsedit.createFile(uri, {
            overwrite: true,
            contents: new TextEncoder().encode(JSON.stringify(content, null, 4))
        });

        const editResult = await vscode.workspace.applyEdit(wsedit);

        return editResult ? output : undefined;
    }

    private generateMetadata(collection: ContentCellCollection): JsonObject {
        const metadataCells = collection.cells.filter(
            (cell) => cell.flag === "metadata"
        );

        return yamlToJson(metadataCells.map((cell) => cell.value).join("\r\n"));
    }

    private generateContent(collection: ContentCellCollection): string {
        return collection.cells.reduce((acc, cell) => {
            switch (cell.flag) {
                case "metadata":
                    return acc;
                case "code":
                    return !acc
                        ? acc + this.codeAsContent(cell)
                        : acc + "\r\n\r\n" + this.codeAsContent(cell);
                case "content":
                    return !acc
                        ? acc + cell.value
                        : acc + "\r\n\r\n" + cell.value;
                default:
                    throw Error(`Unhandled cell flag: ${cell.flag}`);
            }
        }, "");
    }

    private codeAsContent(cell: ContentCell): string {
        return `\`\`\`${cell.language}\r\n${cell.value}\r\n\`\`\``;
    }
}
