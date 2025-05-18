import { Tabs as TabsRoot, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Calendar, User, Map, Lock } from "lucide-react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabsConfig = [
    {
      value: "dashboard",
      label: "Dashboard",
      icon: Grid
    },
    {
      value: "tours",
      label: "My Tours",
      icon: Map
    },
    {
      value: "bookings",
      label: "My Bookings",
      icon: Calendar
    },
    {
      value: "edit-profile",
      label: "Edit Profile",
      icon: User
    },
    {
      value: "change-password",
      label: "Change Password",
      icon: Lock
    }
  ];

  return (
    <TabsRoot value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start gap-4 overflow-x-auto flex-nowrap">
        {tabsConfig.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-yellow-400/10 cursor-pointer whitespace-nowrap"
          >
            <tab.icon className="mr-2 h-4 w-4 text-icons" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
};

export default Tabs;