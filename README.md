# 🌱 GreenGrowth - Fullstack Application

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![NASA Space Apps](https://img.shields.io/badge/NASA%20Space%20Apps-2025-orange.svg)

A fullstack application for sustainable urban planning developed for the NASA Space Apps Challenge 2025. This application allows you to visualize and plan green growth in cities using geospatial data and interactive maps.

## 📋 Table of Contents
- [📡 Demo](#-demo)
- [🎯 Features](#-features)
- [🏗️ Project Architecture](#️-project-architecture)
- [📋 Prerequisites](#-prerequisites)
- [⚡ Quick Installation](#-quick-installation)
- [🔧 Detailed Installation](#-detailed-installation)
- [🚀 Running the Application](#-running-the-application)
- [🐳 Docker](#-docker)
- [🌐 APIs and Technologies](#-apis-and-technologies)
- [📁 Project Structure](#-project-structure)
- [🛠️ Development](#️-development)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📡 Demo
**Live Demo available at:** [greengrowth-front.onrender.com](https://greengrowth-front.onrender.com/)

> [!WARNING]
> **Patience Required:** Processing heavy satellite data is computationally intensive and may take up to 5 minutes to complete. Please be patient when exploring these geospatial features.

## 🎯 Features

### Frontend
- **🗺️ Interactive Maps**: Geospatial data visualization with Leaflet
- **🏙️ Urban Planning**: Tools for drawing and selecting zones
- **🌍 Country Data**: Integration with country API for geolocation
- **💻 Modern Interface**: Built with React, TypeScript and TailwindCSS
- **📱 Responsive**: Optimized for different devices

### Backend
- **🔗 RESTful API**: For user, message and geoprocessing management
- **🌍 Google Earth Engine**: Integration for geospatial analysis
- **💾 Database**: SQLite (development) and PostgreSQL support (production)
- **🐳 Docker Ready**: Containers ready for deployment
- **🔀 CORS Enabled**: To facilitate frontend-backend development

## 🏗️ Project Architecture

```
GreenGrowth_Fullstack/
├── GreenGrowth_Backend/          # Flask API
│   ├── app.py                    # Main entry point
│   ├── models/                   # Database models
│   ├── routers/                  # API routes and blueprints
│   ├── utils/                    # Utilities and helper logic
│   └── secrets/                  # Credentials (do not version)
├── GreenGrowth_Fronted/          # React Application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Application pages
│   │   └── routes/               # Route configuration
│   └── public/                   # Static files
└── README.md                     # This file
```

## 📋 Prerequisites

Before starting, make sure you have installed:

### For the Backend
- **Python**: Version 3.11 or higher
- **pip**: Python package manager
- **Google Cloud Credentials**: JSON file for Google Earth Engine

### For the Frontend
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)

### Optional (Recommended)
- **Docker** and **Docker Compose**: For containers
- **Git**: For version control

You can verify the installed versions by running:
```bash
python --version
node --version
npm --version
docker --version
```

## ⚡ Quick Installation

### Using Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nasa-city-planning-engine/GreenGrowth_Fullstack.git
   cd GreenGrowth_Fullstack
   ```

2. **Configure Google credentials:**
   - Place your JSON credentials file in `GreenGrowth_Backend/secrets/`

3. **Run with Docker Compose:**
   ```bash
   # Backend
   cd GreenGrowth_Backend
   docker-compose up --build
   ```
   
   ```bash
   # Frontend (in another terminal)
   cd ../GreenGrowth_Fronted
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## 🔧 Detailed Installation

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd GreenGrowth_Backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   - Copy `.flaskenv.template` to `.flaskenv`
   - Fill in the required values:
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   DB_URL=sqlite:///instance/database.db
   GEE_PROJECT=your-gee-project
   GOOGLE_APPLICATION_CREDENTIALS=secrets/your-credentials-file.json
   ```

5. **Initialize the database:**
   ```bash
   flask --app app.py init-db
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd GreenGrowth_Fronted
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify installation:**
   ```bash
   npm list --depth=0
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend:**
   ```bash
   cd GreenGrowth_Backend
   flask run
   ```
   Backend available at: http://localhost:5000

2. **Start the frontend (in another terminal):**
   ```bash
   cd GreenGrowth_Fronted
   npm run dev
   ```
   Frontend available at: http://localhost:5173

### Production Mode

1. **Build the frontend:**
   ```bash
   cd GreenGrowth_Fronted
   npm run build
   ```

2. **Run the backend in production mode:**
   ```bash
   cd GreenGrowth_Backend
   FLASK_ENV=production flask run
   ```

## 🐳 Docker

### Backend with Docker

```bash
cd GreenGrowth_Backend
docker-compose up --build
```

### Frontend with Docker (Optional)

```bash
cd GreenGrowth_Fronted
# Create Dockerfile if needed
docker build -t greengrowth-frontend .
docker run -p 5173:5173 greengrowth-frontend
```

## 🌐 APIs and Technologies

### Backend Technologies
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **Google Earth Engine**: Geospatial analysis
- **Flask-CORS**: CORS handling
- **SQLite/PostgreSQL**: Database

### Frontend Technologies
- **React 19**: User interface framework
- **TypeScript**: Static typing
- **Vite 7**: Build tool
- **TailwindCSS 4**: CSS framework
- **Leaflet**: Interactive maps
- **React Router**: Routing
- **Axios**: HTTP client

### External APIs
- **REST Countries API**: Country information
- **Google Earth Engine**: Geospatial data

## 📁 Project Structure

<details>
<summary>📂 Backend Structure</summary>

```
GreenGrowth_Backend/
├── app.py                        # Main Flask application
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Docker image
├── docker-compose.yml            # Container orchestration
├── .flaskenv.template           # Environment variables template
├── models/                      # Database models
│   ├── __init__.py
│   ├── UserModel.py
│   ├── MessageModel.py
│   └── TagModel.py
├── routers/                     # API blueprints and routes
│   ├── __init__.py
│   ├── user_router.py
│   ├── message_router.py
│   └── geo_router.py
├── utils/                       # Utilities and helper logic
│   ├── __init__.py
│   └── geoprocessor.py
├── secrets/                     # Credentials (do not commit)
└── instance/                    # SQLite database
    └── database.db
```
</details>

<details>
<summary>📂 Frontend Structure</summary>

```
GreenGrowth_Fronted/
├── index.html                   # Main HTML file
├── package.json                 # Dependencies and npm scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.*.json             # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── src/
│   ├── main.tsx                # Entry point
│   ├── app.tsx                 # Main component
│   ├── index.css               # Global styles
│   ├── components/             # Reusable components
│   │   ├── header.tsx
│   │   ├── mapView.tsx
│   │   ├── legend.tsx
│   │   ├── PolygonDrawer.tsx
│   │   ├── seleccionarZona.tsx
│   │   └── UbiForm.tsx
│   ├── pages/                  # Application pages
│   │   ├── MainPage.tsx
│   │   ├── MapPage.tsx
│   │   ├── EditMapPage.tsx
│   │   └── ErrorPage.tsx
│   ├── routes/                 # Route configuration
│   │   └── Routes.tsx
│   ├── apiCountry.tsx          # Country API
│   └── coordinateProvider.tsx  # Coordinate provider
└── public/                     # Static files
    ├── logo.png
    ├── world.jpg
    └── vite.svg
```
</details>

## 🛠️ Development

### Useful Scripts

#### Backend
```bash
# Run in development mode
flask run

# Run tests
python -m pytest

# Linting
flake8 .

# Initialize database
flask --app app.py init-db
```

#### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Production preview
npm run preview

# Linting
npm run lint

# Verify dependencies
npm list --depth=0
```

### Environment Variables

#### Backend (.flaskenv)
```env
FLASK_APP=app.py
FLASK_ENV=development
DB_URL=sqlite:///instance/database.db
GEE_PROJECT=your-gee-project-id
GOOGLE_APPLICATION_CREDENTIALS=secrets/your-credentials.json
```

## 🐛 Troubleshooting

### Common Backend Issues

1. **Google credentials error:**
   ```bash
   # Verify that the credentials file exists
   ls secrets/
   # Verify the environment variable
   echo $GOOGLE_APPLICATION_CREDENTIALS
   ```

2. **Database error:**
   ```bash
   # Reinitialize the database
   flask --app app.py init-db
   ```

3. **Port in use:**
   ```bash
   # Change the port
   flask run --port 5001
   ```

### Common Frontend Issues

1. **Dependency errors:**
   ```bash
   # Clean and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors:**
   ```bash
   # Verify configuration
   npx tsc --noEmit
   ```

3. **Port in use:**
   Vite automatically uses the next available port.

### Logs and Debugging

- **Backend**: Logs in the console where you run `flask run`
- **Frontend**: Logs in the browser console and development terminal
- **Docker**: `docker-compose logs`

## 🤝 Contributing

This project is part of the NASA Space Apps Challenge 2025. To contribute:

1. **Fork the project**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Standards
- **Backend**: Follow PEP 8 for Python
- **Frontend**: Use ESLint and TypeScript configurations
- **Commits**: Use descriptive messages in English

## 📄 License

This project is part of the NASA Space Apps Challenge 2025.

## 👥 Team

Developed for the NASA Space Apps Challenge 2025 by the sustainable urban planning team.

---

## 📞 Support

Need help? 

- 📧 Open an issue in the repository
- 💬 Contact the development team
- 📖 Review the documentation in the `docs/` folders

---

**Let's build greener and more sustainable cities together! 🌱🏙️**
