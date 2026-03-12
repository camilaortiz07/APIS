# Proyecto Multi-APIs en Java ☕
Este proyecto es una aplicación desarrollada en Java que consume tres servicios diferentes (APIs) para mostrar información interactiva.
---

## 🚀 ¿Qué hace esta aplicación?

### 1. 🎮 Consulta de Pokémon (PokeAPI)
* Muestra la lista de los **151 Pokémon** originales.
* Puedes ver el nombre, su ID y los **tipos** (Fuego, Agua, etc.) de cada uno.

### 2. 🌤️ Buscador de Clima
* Permite escribir el nombre de un **país o ciudad**.
* Devuelve el estado del clima actual usando una API meteorológica.

### 3. 📸 Galería de Fotos del Mundo
* Conecta con una API de imágenes para mostrar fotografías de diferentes lugares del mundo.

---

## 🛠️ Herramientas utilizadas
* **Lenguaje:** Java ☕
* **Librerías:** * `HttpURLConnection` (para conectar con las APIs).
  * `JSON` (para leer la información que llega de Internet).
* **Entorno:** VS Code.

---

## 📂 Mi Estructura de Carpetas
```text
├── src/
│   ├── PokeApi.java      # Lógica para los Pokémon
│   ├── ClimaApi.java     # Lógica para el clima mundial
│   └── GaleriaApi.java   # Lógica para las fotos
└── README.md

## 📥 Cómo clonar y ejecutar el repositorio

Para tener una copia de este proyecto en tu computadora, sigue estos pasos:

1. **Abrir la terminal** (o Git Bash).
2. **Clonar el proyecto** con el siguiente comando:
   ```bash
   git clone [https://github.com/camilaortiz07/PokeAPI.git](https://github.com/camilaortiz07/PokeAPI.git)
   cd PokeAPI
