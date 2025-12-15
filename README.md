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

1. Autenticación y Protección de Rutas (Prioridad Alta)
Crear middleware en middleware.ts para proteger las rutas de (consumer)
Integrar better-auth session en las páginas protegidas
Reemplazar DEMO_USER_ID con el ID real del usuario autenticado
Actualizar AppNavigation para mostrar información del usuario real (nombre, avatar)
Añadir funcionalidad de sign-out
2. Integración con X (Twitter API) (Prioridad Alta)
Implementar OAuth flow para conectar cuentas de X
Guardar tokens de acceso de forma segura
Implementar fetching real de posts desde X API
Validar que los posts pertenecen al usuario autenticado
3. Implementar Timestamping Real (Prioridad Media)
Integrar OpenTimestamps (resolver error de instalación primero)
Conectar con blockchains reales (Ethereum, Bitcoin, Polygon)
Implementar proceso de confirmación de transacciones
Guardar proof files (.ots) de forma segura
Implementar verificación de timestamps
4. Sistema de Notificaciones (Prioridad Media)
Implementar WebSocket server para notificaciones en tiempo real
Conectar con el componente AppNavigation (ya tiene UI de notificaciones)
Notificar cuando timestamps se completan
Notificar confirmaciones de blockchain
5. Panel de Administración (Prioridad Baja)
Crear route group (admin) separado
Crear AdminNavigation component
Implementar gestión de usuarios
Visualizar estadísticas globales del sistema
6. Sistema de Facturación/Credits (Prioridad Baja)
Implementar sistema de créditos por timestamp
Integrar pasarela de pago (Stripe, etc.)
Completar BillingSettingsSection en settings