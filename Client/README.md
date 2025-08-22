⚡ Real-Time Chat App (Frontend)
👉 View Live App -- https://quickchat-6vkt.onrender.com/

This is the frontend of a real-time chat application built using React, Vite, and Socket.io.
It provides instant messaging with live updates, smooth UI, and efficient state management.

🚀 Features
🔥 Real-time messaging using Socket.io
👥 User authentication & context API
✅ Message seen indicators (double ticks)
✍️ Typing indicators
📂 File sharing (PDFs, Images, Videos)
🎤 Voice messages support
📱 Responsive UI with sidebars for chat and user info

🛠️ Tech Stack

Frontend
React + Vite
Context API (for auth & chat state)
TailwindCSS / CSS Modules (UI styling)

Backend (separate repo)
Node.js
Express.js
Socket.io
MongoDB

📂 Project Structure
Client/
 ├── public/           # Static files
 ├── src/              # Main source code
 │   ├── components/   # UI Components
 │   ├── context/      # Auth & Chat Context
 │   ├── pages/        # App Pages
 │   └── App.jsx       # Root Component
 ├── package.json      # Project dependencies
 └── vite.config.js    # Vite configuration

⚙️ Installation & Setup

Clone the repository:
git clone https://github.com/adarsh005599/Chat-App.git
cd Chat-App/Client


Install dependencies:
npm install

Run the development server:
npm run dev


The app will be available at:
👉 http://localhost:5173/

🔗 Backend

Make sure the backend server (Socket.io + Express + MongoDB) is running.
Repo: Chat-App Backend

🤝 Contributing
Fork the repo
Create a new branch (feature-xyz)
Commit your changes
Push to your fork and open a PR

📜 License
This project is licensed under the MIT License.
