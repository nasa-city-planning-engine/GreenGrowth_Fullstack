# Sistema de Denuncias - Documentación

## Componentes Implementados

### 1. DenunciaForm.tsx

**Ubicación:** `src/components/DenunciaForm.tsx`

**Funcionalidad:**

- Formulario para crear denuncias con 2 secciones:
  - **Izquierda:** Mapa placeholder + GPS + ubicación manual
  - **Derecha:** Categoría + detalles + botón enviar
- Geolocalización GPS con navegador
- 4 categorías predefinidas del backend: Infraestructura, Seguridad, Movibilidad, Servicios Publicos
- Validaciones: Contenido y categoría obligatorios
- Coordenadas por defecto: Hermosillo (29.0729, -110.9559) si no hay GPS
- Modal de éxito con auto-cierre a los 3 segundos
- Limpieza automática del formulario tras envío exitoso

**Conexión al backend:**

```http
POST http://localhost:5001/messages/
```

```json
{
  "content": "Descripción",
  "user_id": 1,
  "tags": ["Infraestructura"],
  "latitude": 29.0729,
  "longitude": -110.9559,
  "location": "Ubicación"
}
```

---

### 2. ListaDenuncias.tsx

**Ubicación:** `src/components/ListaDenuncias.tsx`

**Funcionalidad:**

- Lista en grid de todas las denuncias (2-3 columnas responsive)
- Filtro por ciudad basado en coordenadas GPS:
  - Detecta automáticamente 6 ciudades de Sonora
  - Sistema de rangos lat/lng para cada ciudad
- Filtro por categoría con contadores dinámicos
- Filtros combinados (ciudad + categoría simultáneos)
- Estados: Loading, Error, Sin resultados
- Botón "Nueva Denuncia" que redirige a `/denuncia`
- Tarjetas informativas con:
  - Número de denuncia
  - Tag con color por categoría
  - Contenido (truncado a 3 líneas)
  - Ciudad detectada + ubicación + coordenadas

**Sistema de detección de ciudades:**

```typescript
const cityRanges = {
  'Hermosillo': { latMin: 28.9, latMax: 29.3, ... },
  'Ciudad Obregón': { latMin: 27.3, latMax: 27.6, ... },
  // 6 ciudades configuradas
};
```

---

## Integración con Backend Existente

**Backend usado:** Flask + Docker (puerto 5001)

**Pasos de configuración realizados:**

1. `docker-compose exec backend flask init-db` - Crear tablas
2. Crear usuario de prueba (user_id: 1)

**Endpoints utilizados:**

- `POST /messages/` - Crear denuncia
- `GET /messages/` - Listar denuncias

---

## Rutas Agregadas

**Archivo modificado:** `src/routes/Routes.tsx`

```tsx
<Route path="/denuncia" element={<DenunciaForm />} />
<Route path="/lista-denuncias" element={<ListaDenuncias />} />
```

---

## Dependencias Añadidas

```json
{
  "lucide-react": "^0.263.1" // Iconos (MapPin, User, Tag, etc.)
}
```

---

## Problemas Resueltos

1. **Backend requiere latitude/longitude** → Siempre enviar (valores default si no hay GPS)
2. **user_id hardcodeado** → Usar ID 1 temporalmente (pendiente auth real)

---

## Pendientes

### CRÍTICO

- **Mapa interactivo real** (actualmente es placeholder)
  - Recomendación: React Leaflet
  - Permitir click para seleccionar ubicación
  - Geocoding reverso (coordenadas → dirección)
- Sistema que mediante las **coordenadas te regrese la ciudad**

### IMPORTANTE

- **Autenticación real** (reemplazar user_id: 1 hardcodeado)
- **Página de detalle de denuncia** (`/denuncia/:id`)
- **Estados de denuncia** (Pendiente/En proceso/Resuelta)

### MEJORAS

- Upload de imágenes
- Dashboard de administración
- Notificaciones
- Búsqueda por texto
- Paginación

---

## Cómo usar

### Crear denuncia

1. Ir a `/denuncia`
2. Seleccionar categoría
3. Escribir detalles
4. Opcionalmente obtener GPS
5. Enviar

### Ver denuncias

1. Ir a `/lista-denuncias`
2. Filtrar por ciudad/categoría
3. Ver detalles en tarjetas
