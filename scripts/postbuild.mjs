import fs from "node:fs";
import path from "node:path";

const indexPath = path.resolve("dist/index.mjs");
if (fs.existsSync(indexPath)) {
	let content = fs.readFileSync(indexPath, "utf-8");
	if (!content.includes('"adminEntry"')) {
		content = content.replace(
			/"entrypoint":\s*"accessibility-toolkit\/sandbox",/,
			'"entrypoint": "accessibility-toolkit/sandbox",\n\t"adminEntry": "accessibility-toolkit/admin",',
		);
		fs.writeFileSync(indexPath, content, "utf-8");
		console.log("✔ Added adminEntry to dist/index.mjs");
	}
}
