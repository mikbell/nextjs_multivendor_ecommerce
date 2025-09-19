export default function AdminDashboardLayout({
	childen,
}: {
	childen: React.ReactNode;
}) {
	return (
		<div>
			<h1>Admin Dashboard</h1>
			{childen}
		</div>
	);
}
