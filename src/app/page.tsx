import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<>
			<h2>Bella a tutti ragazzi</h2>
			<h2 className="font-inter">Bella a tutti ragazzi</h2>
			<h2 className="font-barlow">Bella a tutti ragazzi</h2>

      <Button>Button</Button>

	  <ThemeToggle />
		</>
	);
}
