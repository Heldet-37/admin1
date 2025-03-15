import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineMessage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gray-100/95 flex items-center justify-center p-4 z-[9999]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full animate-pulse">
            <WifiOff className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Sem conexão com a internet
        </h2>
        
        <p className="text-gray-600 mb-6">
          Verifique sua conexão com a internet e tente novamente.
        </p>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 space-x-2"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
} 