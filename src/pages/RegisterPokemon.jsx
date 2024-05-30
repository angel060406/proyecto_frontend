import { useState } from 'react';
import axios from 'axios';

const RegisterPokemon = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/pokemons/register', {
        name,
        type,
        image: preview,
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Registrar Pokémon</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 rounded"
        />
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Tipo"
          required
          className="w-full px-4 py-2 mb-4 bg-gray-800 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 mb-4 bg-gray-800 rounded"
        />
        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full h-auto" />
          </div>
        )}
        <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded">
          Registrar Pokémon
        </button>
      </form>
    </div>
  );
};

export default RegisterPokemon;
