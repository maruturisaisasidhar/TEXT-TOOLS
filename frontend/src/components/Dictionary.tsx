import React, { useState } from "react";
import axios from "axios";
import { Search, Volume2 } from "lucide-react";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchMeaning = async () => {
    if (!word.trim()) return;
    setError("");
    setData(null);

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setData(response.data[0]);
    } catch (err) {
      setError("Word not found or error fetching definition.");
    }
  };

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      new Audio(audioUrl).play();
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

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {data && (
          <div className="p-3 bg-black/80 rounded-lg border border-gray-800 space-y-3">
            {/* Word & Pronunciation */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">{data.word}</h3>
              {data.phonetics?.find((p) => p.audio) && (
                <button
                  onClick={() =>
                    playAudio(data.phonetics.find((p) => p.audio).audio)
                  }
                >
                  <Volume2 size={20} className="text-gray-300" />
                </button>
              )}
            </div>
            {data.phonetics?.map((phonetic, index) => (
              <p key={index} className="text-sm text-gray-400">
                {phonetic.text}
              </p>
            ))}

            {/* Meanings */}
            {data.meanings?.map((meaning, index) => (
              <div
                key={index}
                className="p-2 bg-black/70 rounded border border-gray-700 mt-2"
              >
                <p className="text-sm text-purple-400 font-semibold">
                  {meaning.partOfSpeech}
                </p>
                {meaning.definitions.map((def, i) => (
                  <div key={i} className="mt-1">
                    <p className="text-sm text-gray-200">- {def.definition}</p>
                    {def.example && (
                      <p className="text-xs text-gray-400 italic">
                        Example: "{def.example}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
