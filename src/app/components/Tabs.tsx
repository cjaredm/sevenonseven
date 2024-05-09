import { classnames } from "resolves/app/utils";

type TabProps = {
  label: string;
  onClick: () => void;
  color: string;
};
type TabsProps = {
  tabs: TabProps[];
  activeTabIndex: number;
  children: React.ReactNode;
};

export function Tabs({ tabs, activeTabIndex, children }: TabsProps) {
  console.log("tabs", tabs);
  const color = tabs[activeTabIndex].color || "transparent";

  return (
    <div className="flex flex-col flex-1">
      <div className="flex h-[52px] gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={tab.onClick}
            className={classnames(`flex-1 p-2 text-white rounded-t font-bold`)}
            style={{ backgroundColor: tab.color }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-2 flex-1" style={{ backgroundColor: color }}>
        {children}
      </div>
    </div>
  );
}
