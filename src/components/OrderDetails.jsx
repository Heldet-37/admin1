import { formatDate } from '../utils/formatters';

export default function OrderDetails({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Detalhes do Pedido #{order.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Informações do Produto */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Produto</h3>
            <p>Nome: {order.produto.nome}</p>
            <p>Preço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'MZN' }).format(order.produto.preco)}</p>
            <p>Quantidade: {order.quantidade}</p>
          </div>

          {/* Informações do Comprador e Vendedor */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Participantes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Comprador:</p>
                <p>{order.comprador.nome}</p>
                <p>{order.comprador.email}</p>
              </div>
              <div>
                <p className="font-medium">Vendedor:</p>
                <p>{order.vendedor.nome}</p>
                <p>{order.vendedor.email}</p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Datas</h3>
            <p>Pedido: {formatDate(order.data_pedido)}</p>
            {order.data_aceite && <p>Aceite: {formatDate(order.data_aceite)}</p>}
            {order.data_envio && <p>Envio: {formatDate(order.data_envio)}</p>}
            {order.data_entrega && <p>Entrega: {formatDate(order.data_entrega)}</p>}
          </div>

          {/* Status e Tipo */}
          <div>
            <p>Status: <span className={`px-2 py-1 rounded-full text-sm font-semibold
              ${order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${order.status === 'concluido' ? 'bg-green-100 text-green-800' : ''}
              ${order.status === 'cancelado' ? 'bg-red-100 text-red-800' : ''}
              ${order.status === 'recusado' ? 'bg-gray-100 text-gray-800' : ''}`}>
              {order.status.toUpperCase()}
            </span></p>
            <p>Tipo de Pagamento: {order.tipo === 'skywallet' ? 'SkyWallet' : 'Normal'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 