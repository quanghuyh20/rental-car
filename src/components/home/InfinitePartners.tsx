import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface PartnerItem {
	src: string;
	alt: string;
}

interface Props {
	items: PartnerItem[];
	direction?: "left" | "right";
	speed?: "fast" | "normal" | "slow";
	pauseOnHover?: boolean;
	className?: string;
}

export default function InfinitePartners({
	items,
	direction = "left",
	speed = "slow",
	pauseOnHover = true,
	className,
}: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const scrollerRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		addAnimation();
	}, []);
	const [start, setStart] = useState(false);
	function addAnimation() {
		if (containerRef.current && scrollerRef.current) {
			const scrollerContent = Array.from(scrollerRef.current.children);

			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				if (scrollerRef.current) {
					scrollerRef.current.appendChild(duplicatedItem);
				}
			});

			getDirection();
			getSpeed();
			setStart(true);
		}
	}
	const getDirection = () => {
		if (containerRef.current) {
			if (direction === "left") {
				containerRef.current.style.setProperty(
					"--animation-direction",
					"forwards",
				);
			} else {
				containerRef.current.style.setProperty(
					"--animation-direction",
					"reverse",
				);
			}
		}
	};
	const getSpeed = () => {
		if (containerRef.current) {
			if (speed === "fast") {
				containerRef.current.style.setProperty("--animation-duration", "20s");
			} else if (speed === "normal") {
				containerRef.current.style.setProperty("--animation-duration", "40s");
			} else {
				containerRef.current.style.setProperty("--animation-duration", "80s");
			}
		}
	};

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative overflow-hidden mask-[linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
				className,
			)}
		>
			<ul
				ref={scrollerRef}
				className={cn(
					"flex w-max min-w-full shrink-0 flex-nowrap gap-10 py-4",
					start && "animate-scroll",
					pauseOnHover && "hover:paused",
				)}
			>
				{items.map((item, idx) => (
					<li key={idx} className="shrink-0 flex items-center justify-center">
						<img
							src={item.src}
							alt={item.alt}
							height={64}
							className="h-12 md:h-16 w-auto object-contain opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
							loading="lazy"
							decoding="async"
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
