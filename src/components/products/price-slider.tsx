"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface PriceSliderProps {
	value: [number, number];
	onValueChange: (values: [number, number]) => void;
	onValueCommit?: (values: [number, number]) => void;
	min: number;
	max: number;
	step?: number;
}

export function PriceSlider({
	value,
	onValueChange,
	onValueCommit,
	min,
	max,
	step = 1,
}: PriceSliderProps) {
	const [localValue, setLocalValue] = React.useState<[number, number]>(value);

	// Sync local value with prop value when it changes externally
	React.useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleValueChange = React.useCallback((values: number[]) => {
		console.log("PriceSlider: Dragging to", values);
		setLocalValue(values as [number, number]);
		onValueChange(values as [number, number]);
	}, [onValueChange]);

	const handleValueCommit = React.useCallback((values: number[]) => {
		console.log("PriceSlider: Committed to", values);
		if (onValueCommit) {
			onValueCommit(values as [number, number]);
		}
	}, [onValueCommit]);

	return (
		<div
			className="w-full py-3"
			onMouseDown={(e) => e.stopPropagation()}
			onTouchStart={(e) => e.stopPropagation()}
		>
			<SliderPrimitive.Root
				value={localValue}
				onValueChange={handleValueChange}
				onValueCommit={handleValueCommit}
				min={min}
				max={max}
				step={step}
				minStepsBetweenThumbs={1}
				className="relative flex w-full touch-none select-none items-center h-6"
			>
				<SliderPrimitive.Track className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary">
					<SliderPrimitive.Range className="absolute h-full bg-primary" />
				</SliderPrimitive.Track>
				<SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-md transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-100 cursor-grab active:cursor-grabbing" />
				<SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-md transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-100 cursor-grab active:cursor-grabbing" />
			</SliderPrimitive.Root>
		</div>
	);
}
