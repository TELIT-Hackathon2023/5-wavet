import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
//pages
import Home from "./pages/Home"
import Login from './pages/Login'
import Signup from './pages/Signup'

import Navbar from "./components/Navbar"
import Footer from './components/Footer';
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Verified from './pages/Verified'

function App() {
  const { user } = useAuthContext()
  return (
    <BrowserRouter >
      <main className='min-h-full flex flex-col' >
        <Navbar />
        <Routes className=''>
          <Route index element={<Landing />} />
          <Route path="login" element={!user ? <Login /> : <Navigate to={"/home"} />} />
          <Route path="signup" element={!user ? <Signup /> : <Navigate to={"/home"} />} />
          <Route path="home" element={user ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="profile/:id" element={user ? <Profile /> : <Navigate to={"/login"} />} />
          <Route path="verified/:id" element={ <Verified />} />
          {/* <Route path="teams/:id" element={<UserTeam />} /> */}
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>

  );
}

export default App;
