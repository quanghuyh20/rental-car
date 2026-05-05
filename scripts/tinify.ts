/**
 * CLI script to compress & convert images to webp using sharp (local, no API needed).
 *
 * Usage:
 *   pnpm tinify <file-or-folder> [--quality 80] [--out <output-dir>]
 *
 * Examples:
 *   pnpm tinify src/assets/images/kia-carnival.png
 *   pnpm tinify src/assets/images/ --quality 75
 *   pnpm tinify src/assets/images/ --out src/assets/optimized/
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

function collectFiles(input: string): string[] {
	const stat = fs.statSync(input);
	if (stat.isFile()) {
		if (IMAGE_EXTENSIONS.has(path.extname(input).toLowerCase())) return [input];
		console.warn(`Skipping non-image: ${input}`);
		return [];
	}
	if (stat.isDirectory()) {
		return fs
			.readdirSync(input)
			.filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
			.map((f) => path.join(input, f));
	}
	return [];
}

function parseArgs() {
	const args = process.argv.slice(2);
	let input: string | undefined;
	let quality = 80;
	let outDir: string | undefined;

	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--quality" && args[i + 1]) {
			quality = Number.parseInt(args[++i], 10);
		} else if (args[i] === "--out" && args[i + 1]) {
			outDir = args[++i];
		} else if (!input) {
			input = args[i];
		}
	}

	if (!input) {
		console.error("Usage: pnpm tinify <file-or-folder> [--quality 80] [--out <dir>]");
		process.exit(1);
	}

	return { input: path.resolve(input), quality, outDir: outDir ? path.resolve(outDir) : undefined };
}

async function compressAndConvert(
	filePath: string,
	quality: number,
	outDir?: string,
): Promise<void> {
	const fileName = path.basename(filePath, path.extname(filePath));
	const outputDir = outDir ?? path.dirname(filePath);
	const outputPath = path.join(outputDir, `${fileName}.webp`);

	const originalSize = fs.statSync(filePath).size;

	fs.mkdirSync(outputDir, { recursive: true });

	await sharp(filePath).webp({ quality }).toFile(outputPath);

	const finalSize = fs.statSync(outputPath).size;
	const saved = ((1 - finalSize / originalSize) * 100).toFixed(1);

	console.log(
		`  ${path.basename(filePath)} → ${path.basename(outputPath)}  ${formatBytes(originalSize)} → ${formatBytes(finalSize)}  (-${saved}%)`,
	);
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes}B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
	const { input, quality, outDir } = parseArgs();
	const files = collectFiles(input);

	if (files.length === 0) {
		console.error("No image files found.");
		process.exit(1);
	}

	console.log(`\nCompressing ${files.length} file(s) → webp (quality: ${quality})\n`);

	let success = 0;
	let failed = 0;

	for (const file of files) {
		try {
			await compressAndConvert(file, quality, outDir);
			success++;
		} catch (err) {
			failed++;
			console.error(`  ✗ ${file}: ${err}`);
		}
	}

	console.log(`\nDone: ${success} converted, ${failed} failed.\n`);
}

main();
