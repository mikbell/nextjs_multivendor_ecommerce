import { User } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserInfo({ user }: { user: User | null }) {
    const role = user?.privateMetadata.role?.toString() ?? 'User';
	return (
		<div>
			<Button
				className="w-full mt-5 mb-4 flex items-center justify-between py-10"
				variant="ghost">
				<div className="flex items-center text-left gap-2">
					<Avatar className="w-16 h-16">
						<AvatarImage src={user?.imageUrl} alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`} />
						<AvatarFallback>{((user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')) || 'U'}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<p className="font-semibold">{user?.firstName + ' ' + user?.lastName}</p>
						<p className="text-sm text-muted-foreground">
							{user?.emailAddresses?.[0]?.emailAddress ?? ''}
						</p>
                        <p className="text-sm text-muted-foreground">
                            <Badge variant="secondary" className="capitalize">{role.toLocaleLowerCase()} Dashboard</Badge>
                        </p>                      
					</div>
				</div>
			</Button>
		</div>
	);
}
