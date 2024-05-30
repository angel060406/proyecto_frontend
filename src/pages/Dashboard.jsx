import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [pokemons, setPokemons] = useState([]);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [notifications, setNotifications] = useState([]);

  const fetchPokemons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pokemons/list');
      setPokemons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (pokemonId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${pokemonId}`);
      setComments((prev) => ({ ...prev, [pokemonId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (pokemonId, value) => {
    setNewComments((prev) => ({ ...prev, [pokemonId]: value }));
  };

  const handleCommentSubmit = async (pokemonId) => {
    try {
      await axios.post('http://localhost:5000/api/comments/add', {
        pokemonId,
        comment: newComments[pokemonId],
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNewComments((prev) => ({ ...prev, [pokemonId]: '' }));
      fetchComments(pokemonId);
    } catch (err) {
      console.error(err);
    }
  };

  const longPollComments = useCallback(async (pokemonId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/longpoll/${pokemonId}`);
      setComments((prev) => ({
        ...prev,
        [pokemonId]: [...(prev[pokemonId] || []), res.data]
      }));
      longPollComments(pokemonId);
    } catch (err) {
      setTimeout(() => {
        longPollComments(pokemonId);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    fetchPokemons();
    const intervalId = setInterval(fetchPokemons, 5000); // Short polling every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    pokemons.forEach((pokemon) => longPollComments(pokemon._id));
  }, [pokemons, longPollComments]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000');
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((_, index) => index !== 0));
      }, 10000);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <div key={pokemon._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
            <img src={pokemon.imageUrl} alt={pokemon.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h2 className="text-xl font-bold">{pokemon.name}</h2>
            <p>{pokemon.type}</p>
            <div>
              <h3 className="font-semibold mt-4">Comentarios:</h3>
              <div className="max-h-32 overflow-y-auto">
                {comments[pokemon._id]?.map((comment) => (
                  <p key={comment._id}>{comment.comment}</p>
                ))}
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit(pokemon._id);
              }} className="mt-2">
                <input
                  type="text"
                  value={newComments[pokemon._id] || ''}
                  onChange={(e) => handleCommentChange(pokemon._id, e.target.value)}
                  placeholder="Añadir comentario"
                  required
                  className="w-full px-4 py-2 mb-2 bg-gray-700 rounded"
                />
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
                  Añadir Comentario
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 right-0 m-4">
        {notifications.map((notification, index) => (
          <div key={index} className="bg-green-500 text-white p-4 rounded shadow-lg mb-2">
            <img src={notification.imageUrl} alt="thumbnail" className="w-12 h-12 inline-block mr-2 rounded" />
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
