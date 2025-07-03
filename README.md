**Trabajo Práctico - Construcción de Interfaces de Usuario**
# Desarrollar el FrontEnd en React para la red social "UnaHur Anti-Social"

![banner](banner.png)

### Descripción del Proyecto

La presente aplicación web desarrollada en React permite que los usuarios puedan crear y navegar publicaciones, agregar comentarios, registrarse, iniciar sesión y crear sus propios posteos.

### Páginas y objetivos:

La aplicación permitirá a los usuarios:

- Registrarse ingresando un nickname, una contraseña y un mail.
- Logearse con usuario y contraseña.
- Ver posteos realizados por otros usuarios.
- Realizar posteos. 
- Agregar comentarios.


### Instrucciones para correr la aplicación 
-Es requisito tener instalado Node.js

## Backend

[Backend disponible en GitHub](https://github.com/FlamarokClass/anti-social-meanotounamigo-backend)

Instala las dependencias necesarias:
```bash
npm i
```

Inicializar entorno de desarrollo:
A. Crearse en raiz un .env 
B.copias allí el contenido de .env.example 
C.completar los campos vacios 

# Mongo DB 
USERNAME = se peude dejar en root, como se usa por defecto
PASSWORD = se peude dejar en example, como se usa por defecto

# Redis
PASSWORD = 1qaz!QAZ


### Dockerizar la app
Crea una imagen de la aplicación:
```bash
docker-compose up -d
```

Se podrá acceder al servicio de MongoDB: [http://localhost:808]
El puerto local de Redis es [http://localhost:5540]
Si se desea cambiar el PORT o algun otro valor se puede modificar el archivo .env

## Frontend

[Frontend disponible en GitHub](https://github.com/AlexisF12/anti-social-meanotounamigo-frontend)

Una vez clonado el repositorio, abrir una terminal donde se encuentre el mismo y correr los siguientes comandos:

Instrucciones para correr la aplicación de Frontend:
```bash
npm i
```
```bash
npm run dev
```

-Importante: ambas aplicaciones (tanto Backend como Frontend) deben estar corriendo a la par para el correcto funcionamiento de la página web. 


## Integrantes

Anderson, Franco - Britos, Alexis - Denhoff, Lorena - Garcia, Oscar - Paz, Facundo