# 🚀 Text Tools - AI-Powered Text Processing Platform

> **Live Demo:** [https://text-tools-2yf5.onrender.com/](https://text-tools-2yf5.onrender.com/)

A modern, full-stack web application that leverages AI to process and enhance your text with features like rephrasing, summarizing, grammar checking, translation, and more. Includes a powerful Chrome extension for text processing anywhere on the web!

---

## ✨ Features

### 🤖 AI-Powered Text Operations

- **Rephrase** - Rewrite your text in different ways while maintaining meaning
- **Summarize** - Get concise summaries of long text
- **Grammar Check** - Detect and fix grammar issues automatically
- **Translate** - Translate text to Spanish (and more languages)

### 📚 Dictionary Integration

- Built-in dictionary lookup for word definitions
- Instant word meanings and usage examples

### 🔧 Chrome Extension

- Process text directly from any webpage
- Right-click context menu integration
- Works seamlessly with the web app
- [Download Chrome Extension](https://drive.google.com/file/d/1jnKv5RuSDQsv0vvGDJsChaNlr1hLvDHA/view?usp=sharing)

### 💫 User Experience

- Modern, responsive UI with dark theme
- Real-time text processing
- Session history tracking
- Clean and intuitive interface

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB with Mongoose** - Database
- **OpenRouter API** - AI model access (Llama 3.1-8B)
- **Socket.io** - Real-time communication

### Chrome Extension

- Manifest V3
- Integrated with backend API
- Content scripts for seamless web integration

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/texttools.git
cd texttools
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
OPENROUTER_API_KEY=your_api_key_here
PORT=5000
```

Start the backend server:

```bash
npm start
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📦 Project Structure

```
texttools/
├── backend/
│   ├── server.js              # Main Express server
│   ├── models/
│   │   └── Session.js         # MongoDB session model
│   ├── chrome-proxy/          # Chrome extension backend
│   │   ├── server.js
│   │   └── package.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # Navigation component
│   │   │   └── Dictionary.tsx # Dictionary lookup
│   │   └── main.tsx
│   ├── chrome-extension/      # Chrome extension files
│   │   ├── manifest.json
│   │   ├── background.js
│   │   ├── content.js
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

---

## 🎯 API Endpoints

### Text Processing

```http
POST /api/gemini
Content-Type: application/json

{
  "text": "Your text here",
  "task": "rephrase" | "summarize" | "grammar check" | "translate to Spanish"
}
```

**Response:**

```json
{
  "text": "Processed result"
}
```

---

## 🌐 Chrome Extension Installation

1. Download the extension from [this link](https://drive.google.com/file/d/1jnKv5RuSDQsv0vvGDJsChaNlr1hLvDHA/view?usp=sharing)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (top right)
5. Click "Load unpacked" and select the extracted folder
6. The Smart Text Tools extension is now ready to use!

**Features:**

- Select any text on a webpage
- Right-click to access text processing options
- Results appear instantly

---

## 🚀 Deployment

The application is deployed on Render:

- **Frontend + Backend**: [https://text-tools-2yf5.onrender.com/](https://text-tools-2yf5.onrender.com/)

### Deploy Your Own

#### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variable: `OPENROUTER_API_KEY`

#### Frontend (Render/Vercel/Netlify)

1. Build command: `cd frontend && npm install && npm run build`
2. Publish directory: `frontend/dist`
3. Add environment variable: `VITE_API_URL` (your backend URL)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ by Sasidhar

---

## 🙏 Acknowledgments

- OpenRouter for AI model access
- Llama 3.1 for text processing capabilities
- React and TypeScript communities
- Tailwind CSS for beautiful styling

---

⭐ **If you find this project useful, please consider giving it a star!** ⭐

## Deployment

### Backend (Render / Railway / Heroku)

1. Connect your GitHub repo
2. Set environment variable: `OPENROUTER_API_KEY`
3. Deploy!

### Frontend (Vercel / Netlify)

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable: `VITE_API_URL` to your backend URL

## License

MIT
