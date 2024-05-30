import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
          Iniciar Sesión
        </button>
      </form>
      <p className="mt-4">
        ¿No tienes una cuenta? <Link to="/register" className="text-blue-500">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
