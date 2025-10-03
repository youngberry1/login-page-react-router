import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   Outlet,
   useNavigate,
   Link,
} from 'react-router-dom';
import { useState } from 'react';

// Fake Auth State Hook
function useAuth() {
   const [user, setUser] = useState(null);
   return { user, setUser };
}

// Protected Route
function ProtectedRoute({ user, children }) {
   if (!user) {
      return <Navigate to='/login' replace />;
   }
   return children;
}

// Login Page
function Login({ setUser }) {
   const navigate = useNavigate();

   function handleLogin(e) {
      e.preventDefault();
      setUser({ name: 'John Doe' });
      navigate('/dashboard');
   }

   return (
      <div className='flex items-center justify-center min-h-screen bg-gray-900 text-gray-100'>
         <form
            onSubmit={handleLogin}
            className='bg-gray-800 p-6 rounded shadow-md w-80'
         >
            <h2 className='text-2xl font-bold mb-4 text-center text-white'>
               Login
            </h2>
            <input
               type='text'
               placeholder='Username'
               className='w-full px-3 py-2 mb-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
               type='password'
               placeholder='Password'
               className='w-full px-3 py-2 mb-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
               type='submit'
               className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition'
            >
               Login
            </button>
         </form>
      </div>
   );
}

// Dashboard Layout
function DashboardLayout({ user, setUser }) {
   const navigate = useNavigate();

   function handleLogout() {
      setUser(null);
      navigate('/login', { replace: true });
   }

   return (
      <div className='min-h-screen flex flex-col bg-gray-900 text-gray-100'>
         <nav className='bg-gray-800 p-4 flex justify-between items-center'>
            <div>
               <Link
                  to='profile'
                  className='mr-4 hover:text-blue-400 transition'
               >
                  Profile
               </Link>
               <Link to='settings' className='hover:text-blue-400 transition'>
                  Settings
               </Link>
            </div>
            <button
               onClick={handleLogout}
               className='bg-red-600 px-3 py-1 rounded hover:bg-red-500 transition'
            >
               Logout
            </button>
         </nav>
         <main className='flex-1 p-6'>
            <h1 className='text-xl font-bold mb-4 text-white'>
               Welcome, {user?.name}
            </h1>
            <Outlet />
         </main>
      </div>
   );
}

// Nested Pages
function Profile() {
   return (
      <p className='text-lg'>
         This is your <span className='text-blue-400'>Profile</span> page.
      </p>
   );
}

function Settings() {
   return (
      <p className='text-lg'>
         This is your <span className='text-green-400'>Settings</span> page.
      </p>
   );
}

// Root App
export default function App() {
   const { user, setUser } = useAuth();

   return (
      <BrowserRouter>
         <Routes>
            <Route path='/login' element={<Login setUser={setUser} />} />
            <Route
               path='/dashboard'
               element={
                  <ProtectedRoute user={user}>
                     <DashboardLayout user={user} setUser={setUser} />
                  </ProtectedRoute>
               }
            >
               <Route path='profile' element={<Profile />} />
               <Route path='settings' element={<Settings />} />
            </Route>
            <Route path='*' element={<Navigate to='/login' />} />
         </Routes>
      </BrowserRouter>
   );
}
