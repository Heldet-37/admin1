import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Bell, User, Search, Menu } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: 'Nova solicitação de verificação', time: '5 min atrás' },
    { id: 2, text: 'Usuário atualizado com sucesso', time: '1 hora atrás' },
    { id: 3, text: 'Novo relatório disponível', time: '2 horas atrás' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo e Menu Mobile */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3 ml-2 md:ml-0">
              <Store className="h-8 w-8" />
              <h1 className="text-2xl font-bold tracking-tight hidden md:block">SkyVenda-Mz</h1>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="hidden md:block flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg bg-blue-500/40 text-white placeholder-gray-300 focus:outline-none focus:bg-blue-500/60 focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          {/* Ícones de Ação */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white relative"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
              </button>

              {/* Dropdown de Notificações */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold">Notificações</h3>
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <User className="h-6 w-6" />
                <span className="hidden md:block">Admin</span>
              </button>

              {/* Menu do Perfil */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-50">
                  <button
                    onClick={() => navigate('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Meu Perfil
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Configurações
                  </button>
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}