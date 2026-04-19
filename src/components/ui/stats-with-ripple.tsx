import { useMemo, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Stat = { value: string; label: string };
type CellStyle = CSSProperties & { "--delay"?: string; "--duration"?: string };

const ROWS = 8;
const COLS = 36;
const CELL = 56;

function DivGrid({
	clickedCell,
	onCellClick,
}: {
	clickedCell: { row: number; col: number } | null;
	onCellClick: (row: number, col: number) => void;
}) {
	const cells = useMemo(
		() => Array.from({ length: ROWS * COLS }, (_, idx) => idx),
		[],
	);

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
				gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
				width: COLS * CELL,
				height: ROWS * CELL,
			}}
		>
			{cells.map((idx) => {
				const rowIdx = Math.floor(idx / COLS);
				const colIdx = idx % COLS;
				const dist = clickedCell
					? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
					: 0;

				const style: CellStyle = clickedCell
					? {
							"--delay": `${Math.max(0, dist * 50)}ms`,
							"--duration": `${200 + dist * 70}ms`,
						}
					: {};

				return (
					<div
						key={idx}
						className={cn(
							"border-[0.5px] border-neutral-700/50 bg-neutral-900/60 opacity-40 cursor-pointer transition-opacity duration-150 hover:opacity-70",
							clickedCell && "animate-cell-ripple",
						)}
						style={style}
						onClick={() => onCellClick(rowIdx, colIdx)}
					/>
				);
			})}
		</div>
	);
}

export function StatsWithRipple({ stats }: { stats: Stat[] }) {
	const [clicked, setClicked] = useState<{ row: number; col: number } | null>(
		null,
	);
	const [gridKey, setGridKey] = useState(0);

	return (
		<div className="relative overflow-hidden border-y border-border">
			{/* Grid background — centered, intentionally wider than container */}
			<div className="absolute inset-0 flex items-center justify-center">
				<DivGrid
					key={gridKey}
					clickedCell={clicked}
					onCellClick={(row, col) => {
						setClicked({ row, col });
						setGridKey((k) => k + 1);
					}}
				/>
			</div>

			{/* Edge fades so grid bleeds in from center */}
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background from-5% via-transparent to-background to-95%" />
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background from-0% via-transparent to-background to-100%" />

			{/* Stats */}
			<div className="relative z-10 container mx-auto px-8 md:px-16 py-20">
				<div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
					{stats.map(({ value, label }) => (
						<div key={label} className="px-6 md:px-10 py-4 first:pl-0 last:pr-0 text-center">
							<p className="text-5xl md:text-6xl font-black text-primary leading-none tabular-nums">
								{value}
							</p>
							<p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
								{label}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
