import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} />

      {/* Conteúdo principal */}
      <div className="flex-1">
        <Header toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
