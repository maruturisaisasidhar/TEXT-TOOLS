import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Dictionary from './components/Dictionary';
import { RefreshCw, FileText, Check, Languages, Chrome } from 'lucide-react';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDrxnN7Xbq24DC6vlw9fLOaUQGHFOVikbs';

const App = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<React.ReactNode>('');
  const [task, setTask] = useState('rephrase');
  const [token, setToken] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [extensionEnabled, setExtensionEnabled] = useState(false);

  const handleApiCall = async () => {
    const payload = {
      contents: [{ parts: [{ text: `here is the text, ${task}: ${text}` }] }],
    };

    try {
      const response = await axios.post(API_URL, payload);
      const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      const formattedText = formatResponse(rawText);
      setResult(formattedText);
    } catch (error) {
      console.error('API Error:', error);
      setResult('Error fetching response');
    }
  };

  const formatResponse = (rawText: string) => {
    if (rawText.includes('*')) {
      return (
        <ul className="list-disc pl-6 space-y-2">
          {rawText
            .split('\n')
            .filter((line) => line.trim().startsWith('*'))
            .map((line, index) => (
              <li key={index} className="text-gray-100">
                {line.replace('*', '').trim()}
              </li>
            ))}
        </ul>
      );
    }
    return <p className="text-gray-100">{rawText}</p>;
  };

  const generateToken = () => {
    const newToken = Math.random().toString(36).substring(2, 15);
    setToken(newToken);
  };

  const validateToken = () => {
    if (token) {
      setSessionToken(token);
    }
  };

  const buttons = [
    { label: 'Rephrase', task: 'rephrase', icon: RefreshCw },
    { label: 'Summarize', task: 'summarize', icon: FileText },
    { label: 'Grammar Check', task: 'grammar check', icon: Check },
    { label: 'Translate', task: 'translate to Spanish', icon: Languages },
  ];

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80')] bg-cover bg-fixed">
      <div className="min-h-screen bg-gradient-to-br from-black/98 via-gray-900/98 to-black/98 backdrop-blur-sm">
        <Navbar token={token} setToken={setToken} generateToken={generateToken} validateToken={validateToken} />
        
        <div className="container mx-auto px-4 py-8">
          {/* Chrome Extension Box */}
          <div className="mb-8 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-gray-800 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Chrome className="text-purple-400" size={24} />
                <h2 className="text-lg font-semibold text-white">Chrome Extension</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={extensionEnabled}
                  onChange={() => setExtensionEnabled(!extensionEnabled)}
                />
                <div className="w-11 h-6 bg-gray-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-900"></div>
              </label>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left Sidebar - Action Buttons */}
            <div className="flex flex-col gap-3 w-48">
              {buttons.map(({ label, task: buttonTask, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    setTask(buttonTask);
                    handleApiCall();
                  }}
                  className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-black hover:to-purple-900 transition-all duration-200 space-x-2 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 border border-gray-800"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <textarea
                className="w-full h-64 p-4 mb-6 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 resize-none bg-black/60 backdrop-blur-md border-gray-800 placeholder-gray-500"
                placeholder="Enter your text here... ✨"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              {result && (
                <div className="bg-black/60 backdrop-blur-md rounded-lg shadow-lg p-6 border border-gray-800">
                  <div className="prose max-w-none prose-invert">
                    {result}
                  </div>
                </div>
              )}

              {sessionToken && (
                <div className="mt-4 p-4 bg-black/80 rounded-lg border border-gray-800">
                  <p className="text-purple-200">Current Session Token: {sessionToken}</p>
                </div>
              )}
            </div>

            {/* Right Sidebar - Dictionary */}
            <div className="w-64">
              <Dictionary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;