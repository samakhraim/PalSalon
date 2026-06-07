import React from 'react'

function NavItem({children, href}){
	return (
		<a href={href} className="block px-4 py-2 rounded hover:bg-gray-100 text-gray-700">{children}</a>
	)
}

export default function Sidebar(){
	return (
		<aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
			<nav className="space-y-1">
				<NavItem href="#">Dashboard</NavItem>
				<NavItem href="#">Appointments</NavItem>
				<NavItem href="#">Clients</NavItem>
				<NavItem href="#">Services</NavItem>
				<NavItem href="#">Settings</NavItem>
			</nav>
		</aside>
	)
}
