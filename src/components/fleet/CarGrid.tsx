import { useState } from "react";
import { CarIcon, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";

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
	allCars: string;
	filter4Seats: string;
	filter7Seats: string;
};

function formatPrice(n: number) {
	return n.toLocaleString("vi-VN") + "đ";
}

const FILTERS = [
	{ key: "all", seats: 0 },
	{ key: "filter4Seats", seats: 4 },
	{ key: "filter7Seats", seats: 7 },
] as const;

export function CarGrid({ cars, t }: { cars: Car[]; t: T }) {
	const [activeFilter, setActiveFilter] = useState<0 | 4 | 7>(0);

	const filtered =
		activeFilter === 0
			? cars
			: cars.filter((c) => c.data.seats === activeFilter);

	return (
		<div>
			{/* Filter tabs */}
			<div className="flex gap-2 mb-8">
				{FILTERS.map(({ key, seats }) => (
					<button
						key={key}
						onClick={() => setActiveFilter(seats as 0 | 4 | 7)}
						className={cn(
							"px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
							activeFilter === seats
								? "bg-primary text-primary-foreground border-primary"
								: "border-border text-muted-foreground hover:text-foreground hover:border-foreground",
						)}
					>
						{
							t[
								key === "all"
									? "allCars"
									: key === "filter4Seats"
										? "filter4Seats"
										: "filter7Seats"
							]
						}
					</button>
				))}
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{filtered.map((car) => (
					<div
						key={car.id}
						className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
					>
						{/* Image */}
						<div className="aspect-video bg-muted/50 flex items-center justify-center">
							{car.data.images.length > 0 ? (
								<img
									src={car.data.images[0]}
									alt={car.data.name}
									className="w-full h-full object-cover"
									loading="lazy"
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
							<a
								href={CONTACT.ZALO_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-4 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
							>
								<MessageCircle size={16} />
								{car.data.available ? t.bookNow : t.askPrice}
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
