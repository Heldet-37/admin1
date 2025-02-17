// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { 
  Home, Users, UserX, UserCheck, ClipboardList, 
  Shield, Layout, ShoppingCart, Settings 
} from "lucide-react";

export default function Sidebar({ isSidebarVisible, setIsSidebarVisible }) {
  const location = useLocation();
  
  const menuItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/users", icon: Users, label: "Usuários" },
    { path: "/unverifiedUsers", icon: UserX, label: "Não Verificados" },
    { path: "/verifiedUsers", icon: UserCheck, label: "Verificados" },
    { path: "/pending-reviews", icon: ClipboardList, label: "Revisões Pendentes" },
    { path: "/admin-list", icon: Shield, label: "Administradores" },
    { path: "/categories", icon: Layout, label: "Categorias" },
    { path: "/orders", icon: ShoppingCart, label: "Pedidos" },
    { path: "/advertisements", icon: ShoppingCart, label: "Anúncios" },
    { path: "/anuncios", icon: ClipboardList, label: "Lista de anuncios" },
    { path: "/denuncias", icon: ClipboardList, label: "Denúncias" },
    { path: "/settings", icon: Settings, label: "Configurações" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-100 transform transition-transform duration-300 ease-in-out
        ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
    >
      <div className="flex flex-col h-full">
        <div className="md:hidden flex justify-end p-4">
          <button 
            onClick={() => setIsSidebarVisible(false)}
            className="text-gray-300 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive(item.path)
                  ? "bg-indigo-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Admin Panel</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
