export default function SellerDashboardLayout({
	childen,
}: {
	childen: React.ReactNode;
}) {
	return (
		<div>
			<h1>Seller Dashboard</h1>
			{childen}
		</div>
	);
}
