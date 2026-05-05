/**
 * Normalize all car images to a consistent size.
 * Resizes to fit within 800x500, centered on transparent background.
 *
 * Usage: pnpm normalize-cars
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const CARS_DIR = path.resolve(import.meta.dirname, "../src/assets/cars");
const TARGET_W = 800;
const TARGET_H = 500;

async function main() {
	const files = fs
		.readdirSync(CARS_DIR)
		.filter((f) => /\.(webp|png|jpg|avif)$/i.test(f));

	console.log(`\nNormalizing ${files.length} car images to ${TARGET_W}x${TARGET_H}\n`);

	for (const file of files) {
		const filePath = path.join(CARS_DIR, file);
		const outPath = path.join(CARS_DIR, file.replace(/\.[^.]+$/, ".webp"));

		await sharp(filePath)
			.resize(TARGET_W, TARGET_H, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 },
			})
			.webp({ quality: 85 })
			.toFile(outPath + ".tmp");

		fs.renameSync(outPath + ".tmp", outPath);

		// Remove original if different extension
		if (outPath !== filePath && fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}

		const size = fs.statSync(outPath).size;
		console.log(`  ${file} → ${path.basename(outPath)}  ${(size / 1024).toFixed(1)}KB`);
	}

	console.log("\nDone.\n");
}

main();
