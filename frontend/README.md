# Frontend - SIGPe

## Configuración del entorno y ejecución

```bash
# Desarrollo
npm install
npm run dev          # Inicia el servidor de desarrollo
```

## Descripción del Proyecto

SIGPe es una aplicación web desarrollada en React que permite la gestión de pedidos y órdenes. El frontend está construido con React 19.1.1 y Vite, siguiendo una arquitectura escalable y modular basada en componentes reutilizables.

## Estructura de Carpetas

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── views/             # Páginas/Vistas principales
│   │   ├── about_us/      # Página "Acerca de nosotros"
│   │   ├── dashboard/     # Panel de control principal
│   │   ├── landing/       # Página de inicio
│   │   ├── login/         # Página de inicio de sesión
│   │   ├── order_detail/  # Detalle de pedido específico
│   │   ├── orders/        # Lista de pedidos
│   │   └── register/      # Página de registro
│   ├── App.jsx            # Componente principal de la aplicación
│   └── main.jsx           # Punto de entrada de la aplicación
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
└── eslint.config.js       # Configuración de ESLint
```

## Arquitectura de Componentes

### 1. Estructura de Views (Páginas)

Cada vista representa una página completa de la aplicación y está organizada en carpetas separadas para facilitar el mantenimiento:

#### **Landing Page** (`/views/landing/`)
- **Propósito**: Página de inicio que presenta la aplicación
- **Componentes sugeridos**:
  - `HeroSection.jsx` - Sección principal con call-to-action
  - `FeaturesSection.jsx` - Características principales
  - `TestimonialsSection.jsx` - Testimonios de usuarios

#### **Autenticación** (`/views/login/` y `/views/register/`)
- **Propósito**: Gestión de usuarios y autenticación
- **Componentes sugeridos**:
  - `LoginForm.jsx` - Formulario de inicio de sesión
  - `RegisterForm.jsx` - Formulario de registro
  - `AuthLayout.jsx` - Layout común para páginas de auth

#### **Dashboard** (`/views/dashboard/`)
- **Propósito**: Panel de control principal del usuario
- **Componentes sugeridos**:
  - `DashboardHeader.jsx` - Encabezado con navegación
  - `StatsCards.jsx` - Tarjetas de estadísticas
  - `RecentOrders.jsx` - Pedidos recientes
  - `QuickActions.jsx` - Acciones rápidas

#### **Gestión de Pedidos** (`/views/orders/` y `/views/order_detail/`)
- **Propósito**: Lista y detalle de pedidos
- **Componentes sugeridos**:
  - `OrdersList.jsx` - Lista de pedidos con filtros
  - `OrderCard.jsx` - Tarjeta individual de pedido
  - `OrderFilters.jsx` - Filtros y búsqueda
  - `OrderDetail.jsx` - Vista detallada de un pedido
  - `OrderStatus.jsx` - Estado del pedido
  - `OrderItems.jsx` - Items del pedido

#### **Acerca de Nosotros** (`/views/about_us/`)
- **Propósito**: Información sobre la empresa
- **Componentes sugeridos**:
  - `AboutHero.jsx` - Sección principal
  - `TeamSection.jsx` - Equipo de trabajo
  - `MissionVision.jsx` - Misión y visión

### 2. Componentes Reutilizables (`/components/`)

Los componentes reutilizables deben estar organizados por funcionalidad:

```
components/
├── ui/                    # Componentes de interfaz básicos
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.module.css
│   │   └── index.js
│   ├── Input/
│   ├── Modal/
│   ├── Card/
│   └── Loading/
├── forms/                 # Componentes de formularios
│   ├── FormField/
│   ├── FormValidation/
│   └── FormSubmit/
├── layout/                # Componentes de layout
│   ├── Header/
│   ├── Sidebar/
│   ├── Footer/
│   └── Layout/
├── data/                  # Componentes de visualización de datos
│   ├── Table/
│   ├── Pagination/
│   ├── Search/
│   └── Filters/
└── business/              # Componentes específicos del negocio
    ├── OrderCard/
    ├── StatusBadge/
    └── UserProfile/
```

## Principios de Diseño

### 1. **Componentes Atómicos**
- Cada componente debe tener una responsabilidad única
- Componentes pequeños y enfocados en una funcionalidad específica
- Fácil testing y mantenimiento

### 2. **Reutilización**
- Componentes genéricos en `/components/ui/`
- Componentes específicos del negocio en `/components/business/`
- Props bien definidas para máxima flexibilidad

### 3. **Composición**
- Construir componentes complejos combinando componentes simples
- Uso de children y render props cuando sea apropiado

### 4. **Consistencia**
- Nomenclatura consistente (PascalCase para componentes)
- Estructura de carpetas uniforme
- Patrones de importación estandarizados

## Convenciones de Nomenclatura

### Archivos y Carpetas
- **Componentes**: PascalCase (`UserProfile.jsx`)
- **Carpetas**: kebab-case (`user-profile/`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.js`)
- **Utilidades**: camelCase (`formatDate.js`)

### Estructura de Componentes
```jsx
// Ejemplo de estructura de componente
import React from 'react';
import PropTypes from 'prop-types';
import './ComponentName.module.css';

const ComponentName = ({ prop1, prop2, children }) => {
  return (
    <div className="component-name">
      {children}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  children: PropTypes.node
};

ComponentName.defaultProps = {
  prop2: 0
};

export default ComponentName;
```

## Gestión de Estado

### Recomendaciones para Estado Global
- **Context API** para estado de autenticación
- **useReducer** para estado complejo de formularios
- **useState** para estado local de componentes

### Estructura de Contextos Sugerida
```
src/
├── contexts/
│   ├── AuthContext.jsx    # Contexto de autenticación
│   ├── OrderContext.jsx   # Contexto de pedidos
│   └── ThemeContext.jsx   # Contexto de tema
```

## Estilos y CSS

### Estrategia de Estilos
- **CSS Modules** para estilos específicos de componentes
- **CSS Variables** para temas y colores globales
- **Styled Components** o **Emotion** para estilos dinámicos (opcional)

### Estructura de Estilos
```
src/
├── styles/
│   ├── globals.css       # Estilos globales
│   ├── variables.css     # Variables CSS
│   └── themes/           # Temas de la aplicación
├── components/
│   └── ComponentName/
│       ├── ComponentName.jsx
│       └── ComponentName.module.css
```

## Routing y Navegación

### Estructura de Rutas Sugerida
```jsx
// Rutas principales
/                   # Landing page
/login              # Inicio de sesión
/register           # Registro
/dashboard          # Panel principal
/orders             # Lista de pedidos
/orders/:id         # Detalle de pedido
/about              # Acerca de nosotros
```

### Implementación con React Router
```jsx
// Estructura de rutas anidadas
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/auth">
    <Route path="login" element={<LoginPage />} />
    <Route path="register" element={<RegisterPage />} />
  </Route>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/orders">
    <Route index element={<OrdersListPage />} />
    <Route path=":id" element={<OrderDetailPage />} />
  </Route>
</Routes>
```

## Mejores Prácticas

### 1. **Performance**
- Lazy loading de componentes pesados
- Memoización con `React.memo` y `useMemo`
- Code splitting por rutas

### 2. **Accesibilidad**
- Uso de elementos semánticos
- Atributos ARIA apropiados
- Navegación por teclado

### 3. **Testing**
- Tests unitarios para componentes
- Tests de integración para flujos completos
- Mocks para dependencias externas

### 4. **Documentación**
- JSDoc para funciones complejas
- README en cada carpeta de componente importante
- Storybook para documentar componentes (recomendado)

## Dependencias Principales

- **React 19.1.1** - Biblioteca principal
- **Vite** - Herramienta de build y desarrollo
- **ESLint** - Linter para calidad de código

## Próximos Pasos Recomendados

1. **Configurar React Router** para navegación
2. **Implementar sistema de temas** con CSS Variables
3. **Agregar librería de componentes** (Material-UI, Chakra UI, o similar)
4. **Configurar testing** con Jest y React Testing Library
5. **Implementar Storybook** para documentación de componentes
6. **Agregar TypeScript** para tipado estático (recomendado)

## Wireframes del Proyecto

El proyecto está basado en los siguientes wireframes:
- **Home**: Página de inicio con diseño responsive
- **Dashboard**: Panel de control con estadísticas y acciones rápidas
- **Login/Registro**: Formularios de autenticación
- **Pedidos**: Lista y detalle de pedidos
- **Formulario de Pedido**: Creación y edición de pedidos

Cada vista debe implementarse siguiendo los diseños proporcionados en la carpeta `/wireframes/` del proyecto.
