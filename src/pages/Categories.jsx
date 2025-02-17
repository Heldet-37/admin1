import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado');
        return;
      }

      const response = await api.get('/admin/categorias');
      console.log('Resposta da API:', response.data);
      setCategories(response.data);
    } catch (err) {
      console.error('Erro completo:', err);
      console.error('Resposta da API:', err.response?.data);
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await api.delete(`/admin/categorias/${categoryId}`);
      alert('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (err) {
      alert('Erro ao excluir categoria');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await api.post('/admin/categorias', { nome: newCategory });
      setNewCategory('');
      fetchCategories();
      alert('Categoria adicionada com sucesso!');
    } catch (err) {
      alert('Erro ao adicionar categoria');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.nome.trim()) return;

    try {
      await api.put(`/admin/categorias/${editingCategory.id}`, {
        nome: editingCategory.nome
      });
      setEditingCategory(null);
      fetchCategories();
      alert('Categoria atualizada com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar categoria');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
      </div>

      {/* Formulário para adicionar nova categoria */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nova categoria"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Adicionar
          </button>
        </form>
      </div>

      {/* Lista de categorias */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nome
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCategory?.id === category.id ? (
                    <input
                      type="text"
                      value={editingCategory.nome}
                      onChange={(e) => setEditingCategory({
                        ...editingCategory,
                        nome: e.target.value
                      })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <div className="text-sm font-medium text-gray-900">
                      {category.nome}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingCategory?.id === category.id ? (
                    <>
                      <button
                        onClick={handleUpdateCategory}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 