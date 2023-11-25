import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
//pages
import Home from "./pages/Home"
import Login from './pages/Login'
import Signup from './pages/Signup'

import Navbar from "./components/Navbar"
import Footer from './components/Footer';

function App() {
  const { user } = useAuthContext()
  return (
    <BrowserRouter >
      <main className='min-h-full flex flex-col' >
        <Navbar />
        <Routes className=''>
          <Route index element={<Home />} />
          <Route path="login" element={!user ? <Login /> : <Navigate to={"/admin"} />} />
          <Route path="signup" element={!user ? <Signup /> : <Navigate to={"/admin"} />} />
          {/* <Route path="teams/:id" element={<UserTeam />} /> */}
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>

  );
}

export default App;
