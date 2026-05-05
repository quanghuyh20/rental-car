import { Tabs } from "@base-ui/react/tabs";

interface Props {
	locale: "vi" | "en";
	viHref: string;
	enHref: string;
}

const baseTab = "px-2 py-1 transition-colors cursor-pointer";
const activeTab = `${baseTab} text-foreground font-semibold bg-muted`;
const inactiveTab = `${baseTab} text-muted-foreground hover:text-foreground`;

export default function LangTabs({ locale, viHref, enHref }: Props) {
	return (
		<Tabs.Root value={locale} className="flex">
			<Tabs.List className="flex items-center text-xs font-medium rounded border border-border overflow-hidden">
				<Tabs.Tab
					value="vi"
					className={locale === "vi" ? activeTab : inactiveTab}
					render={<a href={viHref} />}
				>
					VN
				</Tabs.Tab>
				<Tabs.Tab
					value="en"
					className={locale === "en" ? activeTab : inactiveTab}
					render={<a href={enHref} />}
				>
					EN
				</Tabs.Tab>
			</Tabs.List>
		</Tabs.Root>
	);
}
