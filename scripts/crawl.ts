/**
 * One-time crawl script for namthanhcar.com
 * Usage: pnpm crawl
 *
 * Sources:
 *   /pages/dieu-khoan-dich-vu       — daily pricing table
 *   /pages/bang-bao-gia-thue-xe-thang — monthly pricing table
 *
 * Outputs:
 *   src/content/cars/*.md        — car fleet entries
 *   scripts/crawl-output/        — contact & about raw data
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { load } from 'cheerio';

const BASE_URL = 'https://namthanhcar.com';
const OUTPUT_CARS = path.resolve('src/content/cars');
const OUTPUT_DATA = path.resolve('scripts/crawl-output');

async function fetchPage(url: string): Promise<string> {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'Mozilla/5.0 (compatible; crawler/1.0)' },
	});
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
	return res.text();
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function parsePrice(text: string): number {
	return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

function parseSeats(text: string): number {
	const m = text.match(/(\d+)/);
	return m ? parseInt(m[1], 10) : 4;
}

function normalizeName(name: string): string {
	// "KIASEDONA" → "KIA SEDONA", "MAZDA3" → "MAZDA 3"
	return name
		.replace(/KIA(?=[A-Z])/g, 'KIA ')
		.replace(/MAZDA(?=\d)/g, 'MAZDA ')
		.replace(/\s+/g, ' ')
		.trim();
}

function parseModel(raw: string): { seats: number; name: string; model: string } {
	// e.g. "07-SEAT TOYOTA INNOVA" or "04-SEAT MAZDA 3"
	const clean = raw.replace(/&nbsp;/g, '').trim();
	const seats = parseSeats(clean);
	// Remove the "07-SEAT " prefix
	const modelName = normalizeName(clean.replace(/^\d+-SEAT\s*/i, '').trim());
	return { seats, name: modelName, model: modelName };
}

interface CarEntry {
	name: string;
	model: string;
	seats: number;
	transmission: 'automatic' | 'manual';
	fuel: 'gasoline' | 'diesel' | 'electric';
	pricePerDay: number;
	pricePerMonth: number;
	available: boolean;
	images: string[];
}

async function crawlPricingTables(): Promise<CarEntry[]> {
	console.log('Fetching daily pricing…');
	const dayHtml = await fetchPage(`${BASE_URL}/pages/dieu-khoan-dich-vu`);
	const $day = load(dayHtml);

	console.log('Fetching monthly pricing…');
	const monthHtml = await fetchPage(`${BASE_URL}/pages/bang-bao-gia-thue-xe-thang`);
	const $month = load(monthHtml);

	// Build monthly price map keyed by model name
	const monthlyPrices = new Map<string, number>();
	$month('table tr').each((_, row) => {
		const cells = $month(row)
			.find('td')
			.map((_, c) => $month(c).text().replace(/&nbsp;/g, '').trim())
			.get();
		if (cells.length < 3) return;
		const { name } = parseModel(cells[1]);
		const price = parsePrice(cells[2]);
		if (name && price) monthlyPrices.set(name, price);
	});

	// Parse daily pricing table as primary source
	const cars: CarEntry[] = [];
	$day('table tr').each((_, row) => {
		const cells = $day(row)
			.find('td')
			.map((_, c) => $day(c).text().replace(/&nbsp;/g, '').trim())
			.get();

		if (cells.length < 3) return;

		// Skip header row
		const firstCell = cells[0].replace(/\D/g, '');
		if (!firstCell || Number.isNaN(parseInt(firstCell, 10))) return;

		const { seats, name, model } = parseModel(cells[1]);
		const pricePerDay = parsePrice(cells[2]);
		if (!name || !pricePerDay) return;

		const pricePerMonth = monthlyPrices.get(name) ?? 0;

		// Guess fuel from model name
		const fuel: CarEntry['fuel'] =
			/electric|ev/i.test(name) ? 'electric'
			: /fortuner|innova/i.test(name) ? 'gasoline'
			: 'gasoline';

		cars.push({
			name,
			model,
			seats,
			transmission: 'automatic',
			fuel,
			pricePerDay,
			pricePerMonth,
			available: true,
			images: [],
		});
	});

	return cars;
}

async function crawlStaticPages() {
	const pages = [
		{ key: 'about', url: '/pages/about-us' },
		{ key: 'contact', url: '/pages/lien-he' },
	];

	const results: Record<string, string> = {};
	for (const { key, url } of pages) {
		console.log(`Fetching ${key}…`);
		try {
			const html = await fetchPage(`${BASE_URL}${url}`);
			const $ = load(html);
			results[key] = $('.page-content, .rte, .content-page, main article')
				.first()
				.text()
				.trim();
		} catch {
			results[key] = '(fetch failed)';
		}
	}
	return results;
}

function writeCarMarkdown(car: CarEntry): void {
	const slug = slugify(car.name);
	const content = [
		'---',
		`name: "${car.name}"`,
		`model: "${car.model}"`,
		`seats: ${car.seats}`,
		`transmission: ${car.transmission}`,
		`fuel: ${car.fuel}`,
		`pricePerDay: ${car.pricePerDay}`,
		`pricePerMonth: ${car.pricePerMonth}`,
		`available: ${car.available}`,
		`images: []`,
		'---',
		'',
		`${car.name} — cập nhật mô tả và hình ảnh sau.`,
	].join('\n');

	fs.writeFileSync(path.join(OUTPUT_CARS, `${slug}.md`), content, 'utf-8');
	console.log(
		`  ✔ ${car.name} — ${car.pricePerDay.toLocaleString('vi-VN')}đ/ngày, ${car.pricePerMonth.toLocaleString('vi-VN')}đ/tháng`,
	);
}

async function main() {
	fs.mkdirSync(OUTPUT_CARS, { recursive: true });
	fs.mkdirSync(OUTPUT_DATA, { recursive: true });

	// Clear existing entries to avoid stale files
	for (const f of fs.readdirSync(OUTPUT_CARS).filter((f) => f.endsWith('.md'))) {
		fs.unlinkSync(path.join(OUTPUT_CARS, f));
	}

	const cars = await crawlPricingTables();
	console.log(`\nWriting ${cars.length} car entries…`);
	for (const car of cars) writeCarMarkdown(car);

	const pages = await crawlStaticPages();
	const contactData = {
		phone: '0938 881 891',
		zalo: '0934127502',
		email: 'Carnamthanh@gmail.com',
		address: 'E8/221/A20 QL50, Bình Hưng, Hồ Chí Minh, Việt Nam',
		facebook: 'https://www.facebook.com/carnamthanh',
		maps: 'https://maps.app.goo.gl/hwb7G7R8wxmGdWJy5',
	};

	fs.writeFileSync(
		path.join(OUTPUT_DATA, 'contact.json'),
		JSON.stringify(contactData, null, 2),
		'utf-8',
	);
	for (const [key, content] of Object.entries(pages)) {
		fs.writeFileSync(path.join(OUTPUT_DATA, `${key}.txt`), content, 'utf-8');
	}

	console.log('\n✅ Crawl complete!');
	console.log(`   ${cars.length} cars → src/content/cars/`);
	console.log('   Contact & about → scripts/crawl-output/');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
