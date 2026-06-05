import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	useEffect(() => {
		const handleScroll = () => {
			const newScroll = window.scrollY

			blobRefs.current.forEach((blob, index) => {
				if (!blob) return
				const initialPos = initialPositions[index]

				// Calculating movement in both X and Y direction
				const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340 // Horizontal movement
				const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40 // Vertical movement

				const x = initialPos.x + xOffset
				const y = initialPos.y + yOffset

				// Apply transformation with smooth transition
				blob.style.transform = `translate(${x}px, ${y}px)`
				blob.style.transition = "transform 1.4s ease-out"
			})
		}

		window.addEventListener("scroll", handleScroll)
		handleScroll() // Initialize position on mount

		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	return (
		<div className="fixed inset-0 bg-[#050507]">
			<div className="absolute inset-0 overflow-hidden">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-0 -left-10 md:w-[500px] md:h-[500px] w-80 h-80 bg-amber-500/10 rounded-full mix-blend-screen filter blur-[160px] md:opacity-15 opacity-30"></div>
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-1/4 -right-10 md:w-[600px] md:h-[600px] w-96 h-96 bg-yellow-900/5 rounded-full mix-blend-screen filter blur-[180px] hidden sm:block"></div>
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute -bottom-20 left-[-20%] md:left-10 md:w-[500px] md:h-[500px] w-80 h-80 bg-orange-900/5 rounded-full mix-blend-screen filter blur-[160px] md:opacity-15 opacity-25"></div>
				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute -bottom-10 right-10 md:w-[450px] md:h-[450px] w-80 h-80 bg-yellow-600/10 rounded-full mix-blend-screen filter blur-[140px] hidden sm:block"></div>
			</div>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
		</div>
	)
}

export default AnimatedBackground

