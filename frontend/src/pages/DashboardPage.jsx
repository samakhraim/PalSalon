import React from 'react'

export default function DashboardPage(){
	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Dashboard</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="p-4 bg-white rounded shadow">Overview card</div>
				<div className="p-4 bg-white rounded shadow">Appointments</div>
				<div className="p-4 bg-white rounded shadow">Clients</div>
			</div>
			<div className="p-4 bg-white rounded shadow">Main content area</div>
		</div>
	)
}
