# ☕ CaffeVibes

A modern full-stack MERN social media platform with real-time features and a clean UI.

---

## 🚀 Features

* 🧑‍💻 User Authentication (JWT-based login/signup)
* 📝 Post creation (tweets, videos, vibes)
* ❤️ Like & Comment system
* 📂 Playlist management
* 🔔 Notifications system
* 🌐 Responsive UI (mobile + desktop)
* ⚡ Real-time updates using Socket.IO

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Tailwind CSS
* Axios

### Backend:

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Socket.IO

---

## 📁 Project Structure

```
caffeVibes/
├── caffeVibesFrontend/
├── caffeVibesBackend/
└── README.md
|__ .gitignore
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/anandshivam23/vibes.git
cd vibes
```

---

### 2. Install dependencies

#### Backend:

```
cd caffeVibesBackend
npm install
```

#### Frontend:

```
cd ../caffeVibesFrontend
npm install
```

---

### 3. Environment Variables

Create a `.env` file in backend:

```
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CORS_ORIGIN= origin_here
API_KEY=your_api_key
```

---

### 4. Run the app

#### Backend:

```
npm run dev
```

#### Frontend:

```
npm run dev
```

---

## 🌍 Deployment

* Frontend: Vercel
* Backend: Render

---

## 👥 Contributors
## 👥 Contributors & Roles

### 🧑‍💻 Shivam Anand (Project Owner)

* Full-stack development
* Backend architecture (Node.js, Express, MongoDB)
* Authentication system (JWT)
* Deployment (Vercel + Render)
* API integration & backend structure design

---

### 👨‍💻 Jayesh More

* Frontend UI development (React + Tailwind)
* Responsive design (mobile optimization)
* UI/UX improvements and layout structuring
* Component design and styling

---

### 👨‍💻 Vinay Kumar

* Feature implementation support
* Testing and debugging
* API integration support
* Performance improvements and bug fixing

---

## 🤝 Collaboration

* Followed Git-based workflow using branches and pull requests
* Maintained clean and modular code structure
* Regular testing and debugging for stable releases

---

## 📌 Notes

* Ensure MongoDB Atlas is configured properly
* Use correct CORS settings for deployment
* Backend must be running for frontend to work

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!