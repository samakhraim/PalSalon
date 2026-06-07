import React from 'react'

export default function Navbar(){
	return (
		<header className="w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className="w-8 h-8 bg-sky-500 rounded-md flex items-center justify-center text-white font-bold">PS</div>
				<h1 className="text-lg font-semibold">PalSalon</h1>
			</div>

			<div className="flex items-center gap-4">
				<input className="hidden md:block border rounded px-3 py-1 text-sm" placeholder="Search..." />
				<div className="flex items-center gap-3">
					<button className="text-sm text-gray-600">Notifications</button>
					<div className="w-8 h-8 bg-gray-300 rounded-full" />
				</div>
			</div>
		</header>
	)
}
