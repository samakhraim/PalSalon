import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout({children}){
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="flex">
				<Sidebar />
				<div className="flex-1 flex flex-col">
					<Navbar />
					<main className="p-6">
						{children}
					</main>
					<footer className="border-t border-gray-200 text-sm text-gray-600 p-4">
						© {new Date().getFullYear()} PalSalon
					</footer>
				</div>
			</div>
		</div>
	)
}
