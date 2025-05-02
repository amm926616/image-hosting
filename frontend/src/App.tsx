import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CollectionsPage />} />
          <Route path="collection/:collectionName" element={<CollectionDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}