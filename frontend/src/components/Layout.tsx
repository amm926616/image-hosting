import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Add a navbar here */}
      {/* <Navbar /> */}
      
      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* This is where your routes will render */}
      </main>
    </div>
  );
}