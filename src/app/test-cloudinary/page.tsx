"use client";

import { useState } from "react";
import ImageUpload from "@/components/dashboard/shared/image-upload";
import Heading from "@/components/shared/heading";

export default function TestCloudinaryPage() {
	const [images, setImages] = useState<string[]>([]);
	const [debugInfo, setDebugInfo] = useState<string[]>([]);

	const addDebug = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setDebugInfo((prev) => [...prev, `${timestamp}: ${message}`]);
	};

	const handleImageChange = (urls: string[]) => {
		console.log("Images changed:", urls);
		addDebug(`Images changed: ${urls.join(", ")}`);
		setImages(urls);
	};

	const handleImageRemove = (url: string) => {
		console.log("Removing image:", url);
		addDebug(`Removing image: ${url}`);
		setImages((prev) => prev.filter((img) => img !== url));
	};

	return (
		<div className="container mx-auto p-8 max-w-2xl">
			<Heading>Test Cloudinary Image Upload</Heading>

			<div className="space-y-6">
				<div>
					<h2 className="text-lg font-semibold mb-3">
						Single Image Upload (Standard)
					</h2>
					<ImageUpload
						type="standard"
						maxImages={1}
						value={images}
						onChange={handleImageChange}
						onRemove={handleImageRemove}
					/>
				</div>

				<div className="mt-8">
					<h3 className="text-md font-medium mb-2">Current Images:</h3>
					{images.length === 0 ? (
						<p className="text-gray-500">No images uploaded</p>
					) : (
						<ul className="space-y-2">
							{images.map((url, index) => (
								<li
									key={index}
									className="break-all text-sm bg-gray-100 p-2 rounded">
									{url}
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="mt-8">
					<h3 className="text-md font-medium mb-2">Debug Log:</h3>
					<div className="bg-black text-green-400 p-4 rounded-md h-48 overflow-y-auto font-mono text-sm">
						{debugInfo.length === 0 ? (
							<p>No debug information yet...</p>
						) : (
							debugInfo.map((info, index) => <div key={index}>{info}</div>)
						)}
					</div>
					<button
						onClick={() => setDebugInfo([])}
						className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded">
						Clear Log
					</button>
				</div>
			</div>
		</div>
	);
}
