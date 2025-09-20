export default function SellerDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<h1>Seller Dashboard</h1>
			{children}
		</div>
	);
}
