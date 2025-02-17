import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, RefreshCw, AlertTriangle, Search, Filter } from 'lucide-react';
import OrderDetails from '../components/OrderDetails';
import Pagination from '../components/Pagination';

export default function Orders() {
  const navigate = useNavigate();
  const [ordersData, setOrdersData] = useState({ total: 0, pedidos: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: '',
    dateRange: 'all'
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(ordersData.total / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await api.get(`/admin/listar-pedidos?skip=${skip}&limit=${ITEMS_PER_PAGE}`);
      setOrdersData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = ordersData.pedidos?.filter(order => {
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesSearch = !filters.searchTerm || 
      order.comprador.nome.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      order.produto.nome.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button onClick={fetchOrders} className="mt-2 text-red-600 hover:text-red-800">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Pedidos ({ordersData.total})
        </h1>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou produto..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>
        </div>
        <select
          className="border rounded-lg px-4 py-2"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
          <option value="recusado">Recusado</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Produto', 'Cliente', 'Data', 'Status', 'Total'].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders?.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="px-6 py-4">#{order.id}</td>
                <td className="px-6 py-4">{order.produto.nome}</td>
                <td className="px-6 py-4">{order.comprador.nome}</td>
                <td className="px-6 py-4">{formatDate(order.data_pedido)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold
                    ${order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'concluido' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'cancelado' ? 'bg-red-100 text-red-800' : ''}
                    ${order.status === 'recusado' ? 'bg-gray-100 text-gray-800' : ''}`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'MZN' })
                    .format(order.preco_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && ordersData.pedidos.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo(0, 0);
          }}
        />
      )}

      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
