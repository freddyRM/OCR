# OCR en Navegador

Este proyecto es una aplicación web simple que permite realizar OCR (Reconocimiento Óptico de Caracteres) directamente en tu navegador. Puedes subir imágenes o PDFs, y extraer el texto de ellos sin necesidad de enviar los archivos a un servidor.

Vista [links](https://freddyrm.github.io/OCR/).

## Características

- Carga de imágenes y archivos PDF.
- Extracción de texto utilizando [Tesseract.js](https://tesseract.projectnaptha.com/).
- Conversión de PDFs en imágenes usando [PDF.js](https://mozilla.github.io/pdf.js/).
- Opción para habilitar proyecciones horizontales y verticales durante la extracción de texto.
- La aplicación se ejecuta completamente en tu navegador, sin necesidad de enviar archivos a un servidor.

## Requisitos

- Navegador moderno compatible con JavaScript y soporte para ES6 Modules.
- Conexión a internet para cargar las dependencias de [Bootstrap](https://getbootstrap.com/), [Tesseract.js](https://tesseract.projectnaptha.com/), y [PDF.js](https://mozilla.github.io/pdf.js/).

## Uso

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio

2. **Abrir el archivo index.html en un navegador:**

- Simplemente abre el archivo index.html en tu navegador preferido.

3. **Subir un archivo PDF o Imagen:**

- Utiliza el área de "Arrastra y suelta un archivo aquí" o el botón correspondiente para seleccionar la imagen o PDF que deseas procesar.

4. **Opciones de OCR:**

- Puedes habilitar las proyecciones horizontales y verticales marcando la casilla correspondiente.

5. **Extraer texto:**

- Una vez cargado el archivo, el texto será extraído automáticamente y mostrado junto con la imagen original.

## Dependencias

El proyecto utiliza las siguientes librerías y frameworks:

- Bootstrap 4.5 para estilos y componentes.
- Tesseract.js para el OCR.
- PDF.js para procesar archivos PDF.
- OpenCV.js para manipulación de imágenes.

## Contribuciones
¡Las contribuciones son bienvenidas! Siéntete libre de hacer un fork del repositorio y enviar un pull request con mejoras o nuevas características.
