import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import UserReview from './pages/UserReview';
import PendingReviews from './pages/PendingReviews';
import Layout from "./components/Layout";
import VerifiedUsers from "./pages/VerifiedUsers";
import UnverifiedUsers from "./pages/UnverifiedUsers";
import CreateAdmin from './pages/CreateAdmin';
import AdminList from './pages/AdminList';
import EditAdmin from './pages/EditAdmin';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import FotoDetalhes from './pages/FotoDetalhes';
import Advertisements from "./pages/Advertisements";
import Anuncios from "./pages/Anuncios";
import PaginaNaoEncontrada from "./pages/PaginaNaoEncontrada";
import RevisarAnuncio from "./pages/RevisarAnuncio";
import Denuncias from "./pages/Denuncias";
import PrivateRoute from './components/PrivateRoute';
import { OfflineProvider } from './contexts/OfflineContext';

function App() {
  return (
    <OfflineProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/users" element={
            <PrivateRoute>
              <Layout>
                <Users />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/user/:userId" element={
            <PrivateRoute>
              <Layout>
                <UserDetails />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/pending-reviews" element={
            <PrivateRoute>
              <Layout>
                <PendingReviews />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/user/:userId/review" element={
            <PrivateRoute>
              <Layout>
                <UserReview />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/verifiedUsers" element={
            <PrivateRoute>
              <Layout>
                <VerifiedUsers />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/unverifiedUsers" element={
            <PrivateRoute>
              <Layout>
                <UnverifiedUsers />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/create-admin" element={
            <PrivateRoute>
              <Layout>
                <CreateAdmin />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/admin-list" element={
            <PrivateRoute>
              <Layout>
                <AdminList />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/admin/:id/edit" element={
            <PrivateRoute>
              <Layout>
                <EditAdmin />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/categories" element={
            <PrivateRoute>
              <Layout>
                <Categories />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/orders" element={
            <PrivateRoute>
              <Layout>
                <Orders />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/advertisements" element={
            <PrivateRoute>
              <Layout>
                <Advertisements />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/anuncios" element={
            <PrivateRoute>
              <Layout>
                <Anuncios />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/anuncio/:id/revisar" element={
            <PrivateRoute>
              <Layout>
                <RevisarAnuncio />
              </Layout>
            </PrivateRoute>
          } />

          <Route path="/user/:id/fotos" element={<PrivateRoute><FotoDetalhes /></PrivateRoute>} />

          <Route path="/denuncias" element={
            <PrivateRoute>
              <Layout>
                <Denuncias />
              </Layout>
            </PrivateRoute>
          } />

          {/* Rota de configurações */}
          <Route path="/settings" element={
            <PrivateRoute>
              <Layout>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Configurações</h2>
                  <p>Página em construção...</p>
                </div>
              </Layout>
            </PrivateRoute>
          } />

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Routes>
      </Router>
    </OfflineProvider>
  );
}

export default App;
