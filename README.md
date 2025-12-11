## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

🔧 Opciones de Mejora
1. Limpiar código legacy/sin usar
Los parámetros sin usar en DashboardNavigation (notifications, unreadCount, etc.)
Imports sin usar en dashboard/page.tsx y settings/page.tsx
Arreglar los tipos any implícitos en verify/utils/pdf.ts
2. Crear más componentes compartidos
ActionButton - Botones con estilos consistentes (primary, secondary, ghost)
StatusBadge - Badge con íconos para estados (verified, pending, failed)
FeatureCard - Card con ícono, título y descripción para features
3. Implementar lógica de negocio
Conectar el flujo de timestamp (capturar posts de X)
Implementar la verificación real de posts
Configurar WebSocket para actualizaciones en tiempo real
4. Mejorar la arquitectura
Crear hooks compartidos (usePostFetch, useTimestamp, useVerification)
Añadir validación de URLs centralizada
Crear constantes compartidas (rutas, configuración)
5. Testing y documentación
Añadir Storybook para los componentes compartidos
Crear tests unitarios para utilidades
Documentar la arquitectura de features
