import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { LoadingSpinner } from "~/components/LoadingScreen";
import { type ACTION_CONST, type TAB_IDS } from "~/constants";
import { useNavContext } from "./NavigationContext";

export const loading = () => (
  <div className="h-full">
    <LoadingSpinner />
  </div>
);

export type TabContextType = {
  activeAction: ActionType | null;
  activeTab: TabType["id"] | null;
  customText: string | null;
  tabs: TabType[] | null;
  tabsRef: MutableRefObject<Array<HTMLButtonElement | null>>;
  viewIndex: number | null;
  handleActiveAction: (action: ActionType | null) => void;
  handleCustomText: (text: string | null) => void;
  handleTabChange: (tabId: TabType["id"]) => void;
  handleViewIndex: (index: number | null) => void;
};

export const TabContext = createContext<TabContextType>({} as TabContextType);

export const useTabContext = () => useContext(TabContext);

type ActionType = (typeof ACTION_CONST)[number];

export type TabType = {
  id: (typeof TAB_IDS)[number];
  title: string;
  content: JSX.Element;
};

type TabContextProviderProps<T extends [TabType, ...TabType[]]> = {
  tabs?: T | null;
  defaultTabId?: T[number]["id"] | null;
  children: ReactNode;
};

const TabContextProvider = <T extends [TabType, ...TabType[]]>({
  tabs = null,
  defaultTabId = tabs?.[0]?.id ?? null,
  children,
}: TabContextProviderProps<T>) => {
  const { activeNav } = useNavContext();

  const [activeAction, setActiveAction] = useState<ActionType | null>(null);

  const [activeTab, setActiveTab] = useState<TabType["id"] | null>(
    defaultTabId,
  );

  const [customText, setCustomText] = useState<string | null>(null);

  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const [viewIndex, setViewIndex] = useState<number | null>(null);

  const handleActiveAction = (action: ActionType | null) => {
    setActiveAction(action);
  };

  const handleCustomText = (text: string | null) => {
    setCustomText(text);
  };

  const handleTabChange = (tabId: TabType["id"] | null) => {
    if (!tabs) return;

    const clickedTabIndex = tabs.findIndex((tab) => tab.id === tabId);
    if (clickedTabIndex !== -1 && tabsRef.current[clickedTabIndex]) {
      tabsRef.current[clickedTabIndex]?.click();
    }

    setActiveTab(tabId);
    reset();
  };

  const handleViewIndex = (index: number | null) => {
    setViewIndex(index);
  };

  const reset = () => {
    setActiveAction(null);
    if (activeNav !== "Notifications") setCustomText(null);
  };

  useEffect(() => {
    handleTabChange(defaultTabId);
  }, [activeNav, defaultTabId]);

  const value: TabContextType = {
    activeAction,
    activeTab,
    customText,
    tabs,
    tabsRef,
    viewIndex,
    handleActiveAction,
    handleCustomText,
    handleTabChange,
    handleViewIndex,
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export default TabContextProvider;
