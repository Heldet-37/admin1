import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoon, faSun, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import useAuthStore from '../store/authStore';

export default function Settings() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [name, setName] = useState("Usuário Exemplo");
  const [email, setEmail] = useState("usuario@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Aplica o tema ao carregar a página
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveChanges = async () => {
    // Validação básica
    if (!name.trim() || !email.trim()) {
      setMessage({ type: 'error', text: 'Nome e email são obrigatórios' });
      return;
    }

    if (password && password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setLoading(true);
    try {
      // Simular uma chamada API (substitua por sua API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Alterações salvas com sucesso!' });
      setPassword(''); // Limpa a senha após salvar
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar alterações' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Configurações</h2>

      {/* Ícone de perfil */}
      <div className="flex items-center justify-center mt-20">
        <button onClick={() => setShowProfileForm(!showProfileForm)} className="relative">
          <FontAwesomeIcon icon={faUser} className="text-5xl text-gray-700 cursor-pointer hover:text-indigo-500 transition-all" />
        </button>
      </div>

      {/* Formulário de Perfil Expandível */}
      {showProfileForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg font-semibold mb-2">Perfil</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Configuração de Segurança (Senha) */}
          <h3 className="text-lg font-semibold mt-4 mb-2">Segurança</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Nova Senha</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Mensagem de feedback */}
          {message.text && (
            <div className={`mt-2 p-2 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          <button 
            onClick={handleSaveChanges}
            disabled={loading}
            className={`bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      )}

      {/* Preferências do Sistema */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tema</h3>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center space-x-2 px-4 py-2 rounded-md transition-all bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
          <span>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</span>
        </button>
      </div>

      {/* Modal de Confirmação de Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Confirmar Saída</h3>
            <p className="text-gray-600 mb-6">Tem certeza que deseja sair do sistema?</p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Confirmar Saída</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botão de Logout */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleLogoutClick}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-all flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  );
}
