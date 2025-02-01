import React, { useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');

  const fetchMeaning = async () => {
    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setMeaning(
        response.data[0]?.meanings[0]?.definitions[0]?.definition ||
          'No meaning found'
      );
    } catch (error) {
      setMeaning('Error fetching definition');
    }
  };

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg shadow-lg p-4 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4">Dictionary</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-black/60 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-900"
          />
          <button
            onClick={fetchMeaning}
            className="p-2 bg-gradient-to-r from-gray-900 to-black text-white rounded hover:from-black hover:to-purple-900 transition-all duration-200"
          >
            <Search size={20} />
          </button>
        </div>
        {meaning && (
          <div className="p-3 bg-black/80 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-200">{meaning}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;