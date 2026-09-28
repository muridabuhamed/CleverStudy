# CleverStudy 📚

> A modern learning platform designed to make studying more organized, interactive, and effective.

CleverStudy is a full-stack educational web application that helps students manage their learning experience, explore study content, track progress, and stay organized in one place.

## ✨ Features

* 📖 **Interactive Learning** — Access and explore study materials through a clean, modern interface.
* 📊 **Progress Tracking** — Keep track of learning progress and completed activities.
* 🔐 **User Authentication** — Secure user accounts with personalized learning data.
* 👤 **Personalized Experience** — Each user can maintain their own learning progress and account information.
* 📝 **Study Resources** — Organized educational content designed to make studying easier.
* 📱 **Responsive UI** — Designed to work across desktop and mobile screen sizes.
* ℹ️ **About Us** — Dedicated information page explaining the project and its purpose.
* ⚡ **Modern Frontend** — Fast, component-based frontend architecture.
* 🐍 **Python Backend** — Backend services and data management powered by Python.

## 🖥️ Screenshots

<img width="956" height="745" alt="Screenshot 2026-04-13 171934" src="https://github.com/user-attachments/assets/a40dc6c5-537e-4bca-ae1d-16f6f94eb57d" />

<img width="951" height="738" alt="Screenshot 2026-04-13 172014" src="https://github.com/user-attachments/assets/1af2e15d-34de-4e27-aa45-cb21d7e0b184" />
<img width="1188" height="856" alt="Screenshot 2026-04-13 172127" src="https://github.com/user-attachments/assets/49a91205-a071-48d8-8af8-e733f9c53806" />
<img width="796" height="863" alt="Screenshot 2026-04-13 172215" src="https://github.com/user-attachments/assets/da089f97-afc9-49f1-8e60-962e6889bb77" />

<img width="1633" height="862" alt="Screenshot 2026-04-14 185216" src="https://github.com/user-attachments/assets/74d4c349-6fe7-424a-8c17-b01064d18628" />

<img width="1918" height="871" alt="Screenshot 2026-04-14 191603" src="https://github.com/user-attachments/assets/c3ad3404-fb37-43d8-860a-e0ceb83cc79c" />
<img width="1752" height="867" alt="Screenshot 2026-04-14 191627" src="https://github.com/user-attachments/assets/ae188c0c-2ac5-43a4-a639-8f086e5f2449" />
<img width="1726" height="861" alt="Screenshot 2026-04-14 191648" src="https://github.com/user-attachments/assets/f25dcd20-c288-4aef-acc4-33252933debe" />
<img width="1176" height="866" alt="Screenshot 2026-04-14 185139" src="https://github.com/user-attachments/assets/a7b233f1-d7ee-4ae6-b2c4-2ae4571eef6a" />

---

## 🏗️ Project Structure

```text
CleverStudy/
├── backend/              # Python backend
├── frontend/             # TypeScript frontend
├── .vscode/              # VS Code configuration
├── .env.example          # Environment variable template
├── netlify.toml           # Netlify deployment configuration
├── render.yaml            # Render deployment configuration
├── add_data_now.py        # Data/setup utility
├── verify_data.py         # Data verification utility
├── start-python.ps1       # Backend startup script
├── CONFIG_VERIFICATION.md # Configuration notes
├── CONNECTION_FIXED.md    # Connection/setup notes
└── README.md              # Project documentation
```

## 🛠️ Tech Stack

### Frontend

* **TypeScript**
* Modern component-based web architecture
* Responsive UI
* Client-side application logic

### Backend

* **Python**
* API/backend services
* Authentication and user management
* Learning progress management

### Deployment

The repository includes configuration for:

* **Netlify** — frontend deployment
* **Render** — backend deployment

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* [Python](https://www.python.org/) 3.x
* Git

### 1. Clone the repository

```bash
git clone https://github.com/muridabuhamed/CleverStudy.git
cd CleverStudy
```

### 2. Configure environment variables

Create your environment file from the provided example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the required values for your local environment.

> **Important:** Never commit your `.env` file or expose private credentials.

### 3. Set up the backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

**Windows:**

```powershell
venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

If the project uses a different dependency/setup file, follow the instructions provided in the `backend` directory.

### 4. Set up the frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at the local development URL displayed in your terminal.

### 5. Start the backend

From the backend directory, start the Python server using the project's configured startup command.

For Windows, the repository also includes:

```text
start-python.ps1
```

Refer to the backend configuration for the exact server command and port.

---

## 🔐 Authentication

CleverStudy includes an authentication system that allows users to have personalized accounts and retain their learning progress.

The application is designed around:

* User registration and login
* Authenticated user sessions
* User-specific learning data
* Progress tracking
* Personalized application state

Environment variables should be configured before running authentication-dependent functionality.

---

## 📈 Progress Tracking

CleverStudy provides a personalized learning experience by keeping track of user progress.

Progress data can be used to help users:

* See what they have completed
* Continue their learning journey
* Monitor their study activity
* Maintain a personalized learning experience

---

## 🌐 Deployment

The repository contains deployment configuration for both the frontend and backend.

### Frontend — Netlify

The project includes:

```text
netlify.toml
```

This can be used to configure frontend deployment through Netlify.

### Backend — Render

The repository also includes:

```text
render.yaml
```

which provides Render deployment configuration for backend services.

Before deploying, make sure all required environment variables are configured in the deployment platform.

---

## 🧪 Data & Development Utilities

The repository includes several utility scripts:

### Add data

```bash
python add_data_now.py
```

### Verify data

```bash
python verify_data.py
```

These scripts are intended to assist with development and data setup/verification.

---

## 🤝 Contributing

Contributions are welcome!

To contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Test your changes locally.
5. Commit your changes:

```bash
git commit -m "Add your feature"
```

6. Push the branch:

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

When contributing, please keep changes focused and document any significant changes to the application or setup process.

---

## 🐛 Issues

If you encounter a bug or have a feature request, please open an issue in the repository.

Include:

* A clear description of the problem
* Steps to reproduce the issue
* Expected behavior
* Actual behavior
* Screenshots or logs when applicable
* Your environment information when relevant

---

## 📄 License

A license has not yet been specified for this repository.

If you intend to make CleverStudy open source, consider adding an appropriate license such as the MIT License and a `LICENSE` file to the repository.

---

## 👨‍💻 Author

**MURID ABUHAMED**

GitHub: [@muridabuhamed](https://github.com/muridabuhamed)

---

## ⭐ Support

If you find CleverStudy useful, consider giving the repository a ⭐ on GitHub.

**CleverStudy — Learn smarter. Track your progress. Keep growing.**








