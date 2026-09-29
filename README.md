# NOC Network Operation Center

> Servicio de monitorización sencillo para comprobar la disponibilidad de una aplicación y conservar un historial local de sus resultados.

El proyecto ejecuta comprobaciones periódicas contra un endpoint HTTP. Cada resultado se transforma en un registro con nivel de severidad y se almacena en archivos `.log`, lo que permite revisar rápidamente cuándo un servicio estuvo disponible o presentó errores.

## Características

- Comprobación programada de servicios HTTP mediante `cron`.
- Registro de respuestas correctas y fallidas.
- Persistencia local de logs, sin necesidad de una base de datos.
- Separación por capas entre casos de uso, repositorios y fuentes de datos.
- Proyecto auxiliar con `json-server` para disponer de un endpoint local durante el desarrollo.

## Tecnologías

- Node.js
- TypeScript
- `tsx` para desarrollo
- `cron` para la planificación de tareas
- `json-server` como API local de prueba

## Requisitos

- Node.js 18 o superior
- npm

## Puesta en marcha

El monitor y el servidor de prueba son dos proyectos independientes. Es necesario iniciar ambos desde terminales separadas.

### 1. Iniciar el servidor de prueba

```bash
cd JSON-server
npm install
npm start
```

Por defecto, `json-server` queda disponible en `http://localhost:3000` y expone los recursos definidos en `JSON-server/db.json`. El monitor comprueba el endpoint `http://localhost:3000/comments`.

### 2. Iniciar el monitor

```bash
cd NOC-Network-Operation-Center
npm install
npm run dev
```

El comando `dev` ejecuta TypeScript directamente y reinicia el proceso cuando detecta cambios.

> Actualmente, la llamada a `Server.start()` está comentada en `src/app.ts`. Para activar la comprobación programada, descoméntala y vuelve a ejecutar el monitor.

```ts
async function main() {
    Server.start();
}
```

Con el servidor activo, se realiza una comprobación cada segundo (`*/1 * * * * *`).

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Ejecuta el monitor en modo desarrollo con recarga automática. |
| `npm run build` | Compila el proyecto TypeScript en `dist/`. |
| `npm start` | Ejecuta la versión compilada desde `dist/app.js`. |
| `npm test` | No hay pruebas automatizadas configuradas actualmente. |

## Logs

La primera ejecución crea la carpeta `logs/` y los archivos necesarios para guardar los resultados:

| Archivo | Contenido |
| --- | --- |
| `logs/logs-low.log` | Todos los registros generados por el monitor. |
| `logs/logs-medium.log` | Registros con severidad media. |
| `logs/error-low.log` | Registros de error con severidad alta. |

Cada línea contiene un registro serializado en formato JSON. Los archivos se generan localmente y no deben considerarse una fuente de almacenamiento permanente.

## Estructura del proyecto

```text
src/
├── app.ts                              # Punto de entrada
├── config/plugins/cron.plugin.ts       # Creación de tareas programadas
├── domain/
│   ├── datasources/                    # Contratos de acceso a datos
│   ├── entities/                       # Entidades del dominio
│   ├── repository/                     # Contratos de repositorio
│   └── use-cases/checks/               # Comprobación de servicios
├── infrastructure/
│   ├── datasources/                    # Persistencia en el sistema de archivos
│   └── repositories/                   # Implementaciones concretas
└── presentation/server.ts               # Configuración del monitor

logs/                                   # Registros generados en ejecución
template.env                             # Plantilla de variables de entorno
```

## Flujo de una comprobación

1. `Server.start()` crea una tarea programada.
2. La tarea solicita `http://localhost:3000/comments`.
3. `CheckService` determina si la respuesta HTTP es correcta.
4. Se crea un `LogEntity` con severidad baja o alta.
5. El repositorio guarda el registro en los archivos correspondientes.

## Configuración

El archivo `template.env` contiene valores de referencia para correo y puerto:

```env
MAILER_EMAIL=tu-correo@example.com
MAIL_SECRET_KEY=tu-clave
PORT=3000
```

La configuración de correo todavía no participa en el flujo actual de monitorización. No guardes credenciales reales en el repositorio.

## Compilación y ejecución en producción

```bash
npm run build
npm start
```

Antes de iniciar la versión compilada, comprueba que `Server.start()` esté habilitado y que el servicio objetivo esté disponible.

## Estado actual

El proyecto cubre la comprobación periódica y la persistencia local de resultados. Aún no incluye una interfaz web, notificaciones por correo, almacenamiento externo ni pruebas automatizadas.

## Licencia

Este proyecto utiliza la licencia ISC definida en `package.json`.
