"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, StoreIcon, CheckIcon, PlusIcon } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { useRouter, useParams } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
	stores: { name: string; slug: string }[];
}

const StoreSwitcher: FC<StoreSwitcherProps> = ({ stores, ...props }) => {
	const router = useRouter();
	const params = useParams();

	const formattedItems = stores.map((store) => ({
		label: store.name,
		value: store.slug,
	}));

	const [open, setOpen] = useState(false);

	const activeStore = stores.find((store) => store.slug === params.slug);

	const onStoreSelect = (store: { label: string; value: string }) => {
		setOpen(false);
		router.push(`/dashboard/seller/stores/${store.value}`);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger {...props} asChild>
				<Button variant="outline" size="sm">
					<StoreIcon className="h-4 w-4" />
					{activeStore?.name}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-0">
				<Command>
					<CommandList>
						<CommandInput placeholder="Search store..." />
						<CommandEmpty>Nessun negozio selezionato.</CommandEmpty>
						<CommandSeparator />
						<CommandGroup>
							{formattedItems.map((store) => (
								<CommandItem
									key={store.value}
									onSelect={() => onStoreSelect(store)}>
									<StoreIcon className="mr-2 h-4 w-4" />
									{store.label}
									{activeStore?.slug === store.value && (
										<CheckIcon className="ml-auto h-4 w-4" />
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandGroup>
						<CommandItem
							onSelect={() => {
								setOpen(false);
								router.push(`/dashboard/seller/stores/new`);
							}}
							className="cursor-pointer">
							<PlusIcon className="mr-2 h-4 w-4" />
							Nuovo negozio
						</CommandItem>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default StoreSwitcher;
