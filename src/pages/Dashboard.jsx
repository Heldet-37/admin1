import { useState, useEffect } from "react";
import api from '../utils/api';
import { 
  Users,
  ShoppingBag,
  Package,
  Wallet,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({
    saldo_total: "0.00",
    total_produtos_ativos: 0,
    total_produtos: 0,
    total_usuarios: 0,
    usuarios_pro: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/sistema/resumo/');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Erro ao carregar dados do dashboard');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total de Usuários",
      value: data.total_usuarios,
      icon: Users,
      color: "blue",
      description: "Usuários cadastrados no sistema"
    },
    {
      title: "Produtos Ativos",
      value: data.total_produtos_ativos,
      icon: ShoppingBag,
      color: "green",
      description: "Produtos disponíveis para venda"
    },
    {
      title: "Total de Produtos",
      value: data.total_produtos,
      icon: Package,
      color: "purple",
      description: "Total de produtos cadastrados"
    },
    {
      title: "Saldo Total",
      value: `MT ${parseFloat(data.saldo_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Wallet,
      color: "yellow",
      description: "Saldo disponível no sistema"
    },
    {
      title: "Usuários Pro",
      value: data.usuarios_pro?.length || 0,
      icon: UserCheck,
      color: "indigo",
      description: "Usuários com conta premium"
    }
  ];

  const getGradient = (color) => {
    const gradients = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      yellow: "from-yellow-500 to-yellow-600",
      indigo: "from-indigo-500 to-indigo-600"
    };
    return gradients[color] || gradients.blue;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo ao painel de controle do SkyVenda-Mz
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-gray-600">Última atualização: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getGradient(card.color)}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">{card.description}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-600">{card.title}</h3>
                  <p className={`text-3xl font-bold text-${card.color}-600`}>
                    {card.value}
                  </p>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${getGradient(card.color)}`}></div>
            </div>
          );
        })}
      </div>

      {/* Seção de Estatísticas */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxa de Ativação</span>
              <span className="font-medium text-green-600">
                {((data.total_produtos_ativos / data.total_produtos) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ 
                  width: `${(data.total_produtos_ativos / data.total_produtos) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Usuários Premium</span>
              <span className="font-medium text-indigo-600">
                {((data.usuarios_pro?.length / data.total_usuarios) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full"
                style={{ 
                  width: `${(data.usuarios_pro?.length / data.total_usuarios) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}