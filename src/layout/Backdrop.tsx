import { useSidebar } from "@/core/context/SidebarContext";

const Backdrop = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  if (!isSidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-30 lg:hidden"
      onClick={toggleSidebar}
    />
  );
};

export default Backdrop;
