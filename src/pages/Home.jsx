
const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a la Pokédex</h1>
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" 
        alt="Pikachu" 
        className="w-64 h-64 mb-8"
      />
      <p className="text-lg">Explora el mundo Pokémon y encuentra a tus favoritos.</p>
    </div>
  );
};

export default Home;
