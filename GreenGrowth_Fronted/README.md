# GreenGrowth Frontend

A web application for sustainable urban planning developed for the NASA Space Apps Challenge 2025. This application allows you to visualize and plan green growth in cities using geospatial data and interactive maps.

## 🚀 Features

- **Interactive Maps**: Geospatial data visualization with Leaflet
- **Urban Planning**: Tools for drawing and selecting zones
- **Country Data**: Integration with country API for geolocation
- **Modern Interface**: Designed with React, TypeScript and TailwindCSS
- **Responsive**: Optimized for different devices

## 🛠️ Technologies Used

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 4
- **Maps**: Leaflet + React-Leaflet
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Linting**: ESLint

## 📋 Prerequisites

Before starting, make sure you have installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)

You can verify the installed versions by running:
```bash
node --version
npm --version
```

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nasa-city-planning-engine/GreenGrowth_Front.git
cd GreenGrowth_Front
```

### 2. Install Dependencies

```bash
npm install
```

This command will install all necessary dependencies specified in `package.json`, including:

- React and React DOM
- TypeScript and related types
- Vite and plugins
- Leaflet and React-Leaflet
- TailwindCSS
- Axios
- React Router DOM
- ESLint and configurations

### 3. Verify Installation

You can verify that all dependencies were installed correctly by running:

```bash
npm list --depth=0
```

## 🚀 Running the Project

### Development Mode

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

To create an optimized production version:

```bash
npm run build
```

The compiled files will be generated in the `dist/` folder

### Production Preview

To preview the production version locally:

```bash
npm run preview
```

### Linting

To run the linter and check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
├── public/                 # Static public files
│   ├── vite.svg           # Vite logo
│   └── world.jpg          # World image
├── src/                   # Source code
│   ├── components/        # Reusable components
│   │   ├── header.tsx     # Header component
│   │   ├── legend.tsx     # Legend component
│   │   ├── mapView.tsx    # Main map view
│   │   ├── PolygonDrawer.tsx # Polygon drawing tool
│   │   ├── seleccionarZona.tsx # Zone selector
│   │   └── UbiForm.tsx    # Location form
│   ├── pages/             # Application pages
│   │   ├── EditMapPage.tsx # Map editing page
│   │   ├── ErrorPage.tsx  # Error page
│   │   ├── MainPage.tsx   # Main page
│   │   └── MapPage.tsx    # Map page
│   ├── routes/            # Route configuration
│   │   └── Routes.tsx     # Route definitions
│   ├── assets/            # Static assets
│   ├── apiCountry.tsx     # Country data API
│   ├── coordinateProvider.tsx # Coordinate provider
│   ├── app.tsx            # Main component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── eslint.config.js       # ESLint configuration
├── index.html             # Main HTML file
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── tsconfig.*.json        # TypeScript configuration
```

## 🌐 APIs Used

The application uses the following external APIs:

- **REST Countries API**: For country information and coordinates
  - Endpoint: `https://restcountries.com/v3.1`
  - Usage: Geolocation and country data

- **Google Earth Engine** (Proxy): For geospatial data
  - Configured in Vite as proxy at `/gee-proxy`

## 🔧 Additional Configuration

### Google Earth Engine Proxy

The project includes a proxy configuration in `vite.config.ts` to handle requests to Google Earth Engine:

```typescript
server: {
  proxy: {
    '/gee-proxy': {
      target: 'https://earthengine.googleapis.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/gee-proxy/, '')
    }
  }
}
```

### TailwindCSS

The project uses TailwindCSS 4 with the Vite plugin for faster and more efficient development.

## 🐛 Troubleshooting

### Common Issues

1. **Dependency errors**: If there are issues with dependencies, try:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port in use**: If port 5173 is occupied, Vite will automatically use the next available one.

3. **TypeScript errors**: Make sure all dependencies are installed correctly.

### Development Logs

During development, you can see detailed logs in the browser console and in the terminal where you ran `npm run dev`.

## 📱 Compatibility

- **Browsers**: Chrome, Firefox, Safari, Edge (modern versions)
- **Devices**: Desktop, Tablet, Mobile
- **Node.js**: Version 18+

## 🤝 Contributing

This project is part of the NASA Space Apps Challenge 2025. To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the NASA Space Apps Challenge 2025.

## 👥 Team

Developed for the NASA Space Apps Challenge 2025 by the sustainable urban planning team.

---

Need help? Open an issue in the repository or contact the development team.
