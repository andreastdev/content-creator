import * as fs from "fs";

export function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}
