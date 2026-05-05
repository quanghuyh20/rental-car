import { useState } from "react";
import { CarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CarData = {
	name: string;
	model: string;
	seats: number;
	transmission: "automatic" | "manual";
	fuel: "gasoline" | "diesel" | "electric";
	pricePerDay: number;
	pricePerMonth: number;
	available: boolean;
	images: string[];
};

type Car = {
	id: string;
	data: CarData;
	detailUrl: string;
};

type T = {
	seats: string;
	automatic: string;
	manual: string;
	gasoline: string;
	diesel: string;
	electric: string;
	available: string;
	unavailable: string;
	perDay: string;
	perMonth: string;
	bookNow: string;
	askPrice: string;
	viewDetails: string;
	allCars: string;
	filter4Seats: string;
	filter7Seats: string;
	filter16Plus: string;
};

function formatPrice(n: number) {
	return n.toLocaleString("vi-VN") + "đ";
}

type FilterKey = "all" | "filter4Seats" | "filter7Seats" | "filter16Plus";

const FILTERS: { key: FilterKey; label: keyof T; match: (seats: number) => boolean }[] = [
	{ key: "all", label: "allCars", match: () => true },
	{ key: "filter4Seats", label: "filter4Seats", match: (s) => s <= 5 },
	{ key: "filter7Seats", label: "filter7Seats", match: (s) => s === 7 },
	{ key: "filter16Plus", label: "filter16Plus", match: (s) => s >= 16 },
];

export function CarGrid({ cars, t }: { cars: Car[]; t: T }) {
	const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

	const currentFilter = FILTERS.find((f) => f.key === activeFilter)!;
	const filtered = cars.filter((c) => currentFilter.match(c.data.seats));

	return (
		<div>
			{/* Filter tabs */}
			<div className="flex gap-2 mb-8">
				{FILTERS.map(({ key, label }) => (
					<button
						key={key}
						onClick={() => setActiveFilter(key)}
						className={cn(
							"px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
							activeFilter === key
								? "bg-primary text-primary-foreground border-primary"
								: "border-border text-muted-foreground hover:text-foreground hover:border-foreground",
						)}
					>
						{t[label]}
					</button>
				))}
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{filtered.map((car) => (
					<a
						key={car.id}
						href={car.detailUrl}
						className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors flex flex-col group"
					>
						{/* Image */}
						<div className="aspect-[16/10] bg-muted/30 flex items-center justify-center p-4">
							{car.data.images.length > 0 ? (
								<img
									src={car.data.images[0]}
									alt={`Thuê xe ${car.data.name} ${car.data.seats} ${t.seats} tại TP.HCM`}
									className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
									loading="lazy"
									decoding="async"
									width={600}
									height={338}
								/>
							) : (
								<CarIcon
									size={48}
									className="text-muted-foreground/30"
									strokeWidth={1}
								/>
							)}
						</div>

						{/* Info */}
						<div className="p-5 flex flex-col flex-1">
							<div className="flex items-start justify-between mb-3">
								<div>
									<h3 className="font-semibold text-base">{car.data.name}</h3>
									<p className="text-sm text-muted-foreground mt-0.5">
										{car.data.seats} {t.seats} · {t[car.data.transmission]} ·{" "}
										{t[car.data.fuel]}
									</p>
								</div>
								<span
									className={cn(
										"text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
										car.data.available
											? "bg-primary/10 text-primary"
											: "bg-muted text-muted-foreground",
									)}
								>
									{car.data.available ? t.available : t.unavailable}
								</span>
							</div>

							{/* Pricing */}
							<div className="flex gap-4 text-sm py-3 border-y border-border">
								<div className="flex-1">
									<div className="text-muted-foreground text-xs mb-0.5">
										{t.perDay}
									</div>
									<div className="font-bold text-primary text-base">
										{formatPrice(car.data.pricePerDay)}
									</div>
								</div>
								<div className="w-px bg-border" />
								<div className="flex-1">
									<div className="text-muted-foreground text-xs mb-0.5">
										{t.perMonth}
									</div>
									<div className="font-bold text-base">
										{formatPrice(car.data.pricePerMonth)}
									</div>
								</div>
							</div>

							{/* CTA */}
							<span className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg group-hover:bg-primary/90 transition-colors">
								{t.viewDetails}
							</span>
						</div>
					</a>
				))}
			</div>
		</div>
	);
}
