import React, { useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import Navbar from "./components/Navbar";
import Dictionary from "./components/Dictionary";
import { RefreshCw, FileText, Check, Languages, History } from "lucide-react";

interface HistoryEntry {
  action: string;
  timestamp: Date;
  text?: string; // Added text property
  task?: string; // Added task property
  result?: string; // Added result property
}

interface ApiResponse {
  candidates?: [
    {
      content?: {
        parts?: [
          {
            text?: string;
          }
        ];
      };
    }
  ];
}

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDrxnN7Xbq24DC6vlw9fLOaUQGHFOVikbs";

const App: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [task, setTask] = useState<string>("rephrase");
  const [token, setToken] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && sessionToken) {
      socket.emit("join_session", sessionToken);

      socket.on("history_updated", (updatedHistory: HistoryEntry[]) => {
        setHistory(updatedHistory);
      });

      return () => {
        socket.off("history_updated");
      };
    }
  }, [socket, sessionToken]);

  const downloadExtension = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/download-chrome-extension",
        {
          responseType: "blob", // Get as a file
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "chrome-extension.zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const fetchToken = async () => {
    try {
      const response = await axios.post<{ token: string }>(
        "http://localhost:5000/generate-token"
      );
      setToken(response.data.token);
      setSessionToken(response.data.token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const validateToken = async () => {
    if (!token) return;
    try {
      const response = await axios.post<{ history: HistoryEntry[] }>(
        "http://localhost:5000/get-history",
        { token }
      );
      setSessionToken(token);
      setHistory(response.data.history);
    } catch (error) {
      console.error("Error validating token:", error);
    }
  };

  const fetchHistory = async (token: string) => {
    try {
      const response = await axios.post<{ history: HistoryEntry[] }>(
        "http://localhost:5000/get-history",
        { token }
      );
      setHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleApiCall = async () => {
    if (!text.trim()) return;

    const payload = {
      contents: [{ parts: [{ text: `here is the text, ${task}: ${text}` }] }],
    };

    try {
      const response = await axios.post<ApiResponse>(API_URL, payload);
      const rawText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";
      setResult(rawText);

      if (sessionToken) {
        // Create detailed history entry
        await updateHistory({
          text: text.substring(0, 100) + (text.length > 100 ? "..." : ""), // Truncate long text
          task,
          result:
            rawText.substring(0, 100) + (rawText.length > 100 ? "..." : ""),
          action: `${task.charAt(0).toUpperCase() + task.slice(1)} operation`,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setResult("Error fetching response");
    }
  };

  const updateHistory = async (historyData: Partial<HistoryEntry>) => {
    if (!sessionToken) return;

    try {
      const response = await axios.post<{ history: HistoryEntry[] }>(
        "http://localhost:5000/update-history",
        {
          token: sessionToken,
          ...historyData,
        }
      );
      setHistory(response.data.history);
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  const buttons = [
    { label: "Rephrase", task: "rephrase", icon: RefreshCw },
    { label: "Summarize", task: "summarize", icon: FileText },
    { label: "Grammar Check", task: "grammar check", icon: Check },
    { label: "Translate", task: "translate to Spanish", icon: Languages },
  ];

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar
        token={token}
        setToken={setToken}
        generateToken={fetchToken}
        validateToken={validateToken}
      />
      <div className="container mx-auto px-4 py-8 flex gap-6 flex-grow">
        {/* Left Sidebar - Buttons */}
        <div className="flex flex-col gap-3 w-48 shrink-0">
          {buttons.map(({ label, task: buttonTask, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setTask(buttonTask);
                handleApiCall();
              }}
              className="flex items-center px-4 py-3 bg-black text-white rounded-lg hover:bg-purple-900 transition-all duration-200 space-x-2"
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
          <button
            onClick={toggleHistory}
            className="flex items-center px-4 py-3 bg-black text-white rounded-lg hover:bg-purple-900 transition-all duration-200 space-x-2"
          >
            <History size={18} />
            <span>{showHistory ? "Hide History" : "Show History"}</span>
          </button>

          {/* ADD THE DOWNLOAD BUTTON HERE */}
          <button
            onClick={downloadExtension}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Download Chrome Extension
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1">
            <textarea
              className="w-full h-48 p-4 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 resize-none"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {result && (
              <div className="bg-gray-800 rounded-lg p-6 mt-4 text-white">
                {result}
              </div>
            )}

            {sessionToken && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg text-purple-200">
                Current Session Token: {sessionToken}
              </div>
            )}
          </div>

          {/* Dictionary Component */}
          <Dictionary />
        </div>

        {/* Right Sidebar - History */}
        {showHistory && (
          <div className="w-80 shrink-0">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">History</h3>
                <span className="text-sm text-gray-400">
                  {history.length} entries
                </span>
              </div>
              <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-purple-400">
                        {entry.action}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-gray-400">Original Text: </span>
                        <span className="text-gray-200">{entry.text}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Task: </span>
                        <span className="text-purple-300">{entry.task}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Result: </span>
                        <span className="text-gray-200">{entry.result}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
