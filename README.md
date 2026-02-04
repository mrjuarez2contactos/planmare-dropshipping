# PlanMARE Dropshipping Automation MVP

PlanMARE es una plataforma diseñada para automatizar el proceso de creación de tiendas de dropshipping siguiendo la metodología "One Product Store".

## 🚀 Características del MVP

- **Autenticación Completa**: Registro e inicio de sesión integrados con Supabase Auth.
- **Generador de Marcas**: Utiliza GPT-4 para generar nombres creativos basados en tu nicho.
- **Buscador de Productos**: Interfaz para buscar y seleccionar productos ganadores (datos simulados para MVP).
- **Generador de Copywriting**: Creación automática de títulos, descripciones, beneficios y FAQs persuasivos con IA.
- **Preview de Landing Page**: Visualización en tiempo real de una landing page optimizada y responsive.
- **Dashboard de Usuario**: Gestión centralizada de proyectos y productos.

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS & shadcn/ui
- **Base de Datos & Auth**: Supabase
- **IA**: OpenAI API (GPT-4)

## 📋 Requisitos Previos

1. Cuenta en **Supabase**.
2. Cuenta en **OpenAI** con API Key.
3. Node.js instalado.

## ⚙️ Configuración

1. **Clonar/Descargar el proyecto**.
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Variables de Entorno**:
   Copia el archivo `.env.example` a `.env.local` y rellena las variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role
   OPENAI_API_KEY=tu-openai-key
   ```
4. **Configuración de Base de Datos**:
   Ejecuta el contenido de `supabase_setup.sql` en el SQL Editor de tu Dashboard de Supabase.

## 🚀 Ejecución en Desarrollo

```bash
npm run dev
```
Accede a `http://localhost:3000` para empezar.

## 📂 Estructura del Proyecto

- `app/`: Rutas, páginas y API endpoints.
- `components/`: Componentes UI reutilizables y formularios.
- `lib/`: Configuraciones de Supabase y OpenAI.
- `types/`: Definiciones de tipos TypeScript.

## 📝 Notas del Programador (Marco Juárez)
Este MVP se enfoca en la validación rápida de la idea. Las integraciones con Shopify y proveedores reales están planeadas para la Fase 2.
