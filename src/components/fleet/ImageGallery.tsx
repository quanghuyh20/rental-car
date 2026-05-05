import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
	images: string[];
	alt: string;
	firstLarge?: boolean;
}

export function ImageGallery({ images, alt, firstLarge = true }: Props) {
	const [open, setOpen] = useState(false);
	const [current, setCurrent] = useState(0);

	const prev = useCallback(
		() => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1)),
		[images.length],
	);
	const next = useCallback(
		() => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1)),
		[images.length],
	);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [open, prev, next]);

	function openAt(index: number) {
		setCurrent(index);
		setOpen(true);
	}

	return (
		<>
			{/* Grid thumbnails */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
				{images.map((src, i) => (
					<button
						key={i}
						onClick={() => openAt(i)}
						className="rounded-xl overflow-hidden border border-border cursor-pointer hover:border-primary/50 transition-all duration-300 group aspect-[4/3]"
					>
						<img
							src={src}
							alt={`${alt} - ${i + 1}`}
							className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
							loading="lazy"
						/>
					</button>
				))}
			</div>

			{/* Lightbox dialog */}
			{open && (
				<div
					className="fixed inset-0 z-50 flex flex-col bg-black/90"
					onClick={() => setOpen(false)}
				>
					{/* Top bar */}
					<div className="flex items-center justify-between px-4 py-3 shrink-0">
						<div className="text-white/70 text-sm">
							{current + 1} / {images.length}
						</div>
						<button
							onClick={() => setOpen(false)}
							className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
						>
							<X size={24} />
						</button>
					</div>

					{/* Main image area */}
					<div className="flex-1 flex items-center justify-center relative min-h-0">
						{/* Prev */}
						{images.length > 1 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									prev();
								}}
								className="absolute left-3 md:left-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
							>
								<ChevronLeft size={32} />
							</button>
						)}

						<img
							src={images[current]}
							alt={`${alt} - ${current + 1}`}
							className="max-h-full max-w-[90vw] object-contain select-none"
							onClick={(e) => e.stopPropagation()}
						/>

						{/* Next */}
						{images.length > 1 && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									next();
								}}
								className="absolute right-3 md:right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
							>
								<ChevronRight size={32} />
							</button>
						)}
					</div>

					{/* Thumbnail strip */}
					{images.length > 1 && (
						<div
							className="shrink-0 flex justify-center gap-2 px-4 py-3 overflow-x-auto"
							onClick={(e) => e.stopPropagation()}
						>
							{images.map((src, i) => (
								<button
									key={i}
									onClick={() => setCurrent(i)}
									className={cn(
										"shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all",
										i === current
											? "border-primary opacity-100"
											: "border-transparent opacity-50 hover:opacity-80",
									)}
								>
									<img
										src={src}
										alt={`${alt} - ${i + 1}`}
										className="w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
}
