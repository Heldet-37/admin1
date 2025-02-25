import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar com altura total e largura adequada */}
      <div className="md:w-64 flex-shrink-0">
        <div className="md:fixed md:w-64 md:h-screen bg-gray-900 z-30">
          <Sidebar isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} />
        </div>
      </div>

      {/* Container principal */}
      <div className="flex-1 flex flex-col">
        {/* Header fixo */}
        <div className="fixed top-0 right-0 left-0 md:left-64 z-20">
          <Header toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
        </div>

        {/* Conteúdo principal com padding-top para compensar o header fixo */}
        <main className="flex-1 overflow-auto mt-16 p-4 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
