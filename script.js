const desiredWidth = 500;
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const imageContainer = document.querySelector('.image-container');
const languageSelect = document.getElementById('id_language');
const checkboxUseProjections = document.getElementById('useProjections');

let fileSelectionAllowed = true;
let cvReady = false;

const LANGUAGES = {
  "afr": "Afrikaans",
  "amh": "Amharic",
  "ara": "Arabic",
  "asm": "Assamese",
  "aze": "Azerbaijani",
  "aze_cyrl": "Azerbaijani - Cyrillic",
  "bel": "Belarusian",
  "ben": "Bengali",
  "bod": "Tibetan",
  "bos": "Bosnian",
  "bul": "Bulgarian",
  "cat": "Catalan; Valencian",
  "ceb": "Cebuano",
  "ces": "Czech",
  "chi_sim": "Chinese - Simplified",
  "chi_tra": "Chinese - Traditional",
  "chr": "Cherokee",
  "cym": "Welsh",
  "dan": "Danish",
  "deu": "German",
  "dzo": "Dzongkha",
  "ell": "Greek, Modern (1453-)",
  "eng": "English",
  "enm": "English, Middle (1100-1500)",
  "epo": "Esperanto",
  "est": "Estonian",
  "eus": "Basque",
  "fas": "Persian",
  "fin": "Finnish",
  "fra": "French",
  "frk": "German Fraktur",
  "frm": "French, Middle (ca. 1400-1600)",
  "gle": "Irish",
  "glg": "Galician",
  "grc": "Greek, Ancient (-1453)",
  "guj": "Gujarati",
  "hat": "Haitian; Haitian Creole",
  "heb": "Hebrew",
  "hin": "Hindi",
  "hrv": "Croatian",
  "hun": "Hungarian",
  "iku": "Inuktitut",
  "ind": "Indonesian",
  "isl": "Icelandic",
  "ita": "Italian",
  "ita_old": "Italian - Old",
  "jav": "Javanese",
  "jpn": "Japanese",
  "kan": "Kannada",
  "kat": "Georgian",
  "kat_old": "Georgian - Old",
  "kaz": "Kazakh",
  "khm": "Central Khmer",
  "kir": "Kirghiz; Kyrgyz",
  "kor": "Korean",
  "kur": "Kurdish",
  "lao": "Lao",
  "lat": "Latin",
  "lav": "Latvian",
  "lit": "Lithuanian",
  "mal": "Malayalam",
  "mar": "Marathi",
  "mkd": "Macedonian",
  "mlt": "Maltese",
  "msa": "Malay",
  "mya": "Burmese",
  "nep": "Nepali",
  "nld": "Dutch; Flemish",
  "nor": "Norwegian",
  "ori": "Oriya",
  "pan": "Panjabi; Punjabi",
  "pol": "Polish",
  "por": "Portuguese",
  "pus": "Pushto; Pashto",
  "ron": "Romanian; Moldavian; Moldovan",
  "rus": "Russian",
  "san": "Sanskrit",
  "sin": "Sinhala; Sinhalese",
  "slk": "Slovak",
  "slv": "Slovenian",
  "spa": "Spanish; Castilian",
  "spa_old": "Spanish; Castilian - Old",
  "sqi": "Albanian",
  "srp": "Serbian",
  "srp_latn": "Serbian - Latin",
  "swa": "Swahili",
  "swe": "Swedish",
  "syr": "Syriac",
  "tam": "Tamil",
  "tel": "Telugu",
  "tgk": "Tajik",
  "tgl": "Tagalog",
  "tha": "Thai",
  "tir": "Tigrinya",
  "tur": "Turkish",
  "uig": "Uighur; Uyghur",
  "ukr": "Ukrainian",
  "urd": "Urdu",
  "uzb": "Uzbek",
  "uzb_cyrl": "Uzbek - Cyrillic",
  "vie": "Vietnamese",
  "yid": "Yiddish"
}

// Populate the languages select box
while (languageSelect.firstChild) {
  languageSelect.removeChild(languageSelect.firstChild);
}

for (const code of Object.values(Tesseract.languages)) {
  const name = LANGUAGES[code];
  const option = document.createElement('option');
  option.value = code;
  option.textContent = name;
  if (option.value == 'spa') {
    option.selected = true;
  }
  languageSelect.appendChild(option);
}

dropzone.addEventListener('click', () => {
  if (!fileSelectionAllowed) return;
  fileInput.click();
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  if (!fileSelectionAllowed) return;
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

checkboxUseProjections.addEventListener('change', (e) => {
  const file = fileInput.files[0];
  if (file) {
    handleFile(file);
  } else {
    // No se hace nada si no hay archivo seleccionado
    // console.log('No hay archivo seleccionado');
  }
});

function handleFile(file) {
  imageContainer.innerHTML = '';
  if (file.type === 'application/pdf') {
    processPDF(file);
  } else if (['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    processImage(file);
  }
}

async function processPDF(file) {
  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    const images = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;

      const imageDataURL = canvas.toDataURL();
      const image = new Image();
      images.push(image); // Add the image to the array

      image.onload = () => extractTextBlocks(image); // Call extractTextBlocks when image loads
      image.src = imageDataURL;
    }
  };
  fileReader.readAsArrayBuffer(file);
}

function onOpenCvReady() {
  cvReady = true;
}

async function processImage(file) {
  if (!cvReady) {
    console.error('OpenCV.js no está listo todavía.');
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = async function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = async function () {
      extractTextBlocks(img)
    };
  };
  fileReader.readAsDataURL(file);
}

async function extractTextBlocks(img) {
  const container = document.createElement('div');
  container.className = 'image-result-container';
  const originalImage = document.createElement('img');
  originalImage.src = img.src;
  const textarea = document.createElement('textarea');
  textarea.className = 'form-control';

  container.appendChild(originalImage);
  container.appendChild(textarea);
  imageContainer.appendChild(container);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  let src = cv.imread(canvas);
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.resize(src, src, new cv.Size(0, 0), 2, 2, cv.INTER_LINEAR);
  cv.threshold(src, src, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

  let textBlocks = [];

  if (checkboxUseProjections.checked) {
    // Proyecciones horizontales y verticales
    let horizontalProjection = new cv.Mat();
    cv.reduce(src, horizontalProjection, 1, cv.REDUCE_AVG);

    let horizontalHist = [];
    for (let i = 0; i < horizontalProjection.rows; i++) {
      horizontalHist.push(horizontalProjection.ucharPtr(i, 0)[0]);
    }

    let horizontalLines = [];
    let start = -1;
    for (let i = 0; i < horizontalHist.length; i++) {
      if (horizontalHist[i] < 255) {
        if (start === -1) start = i;
      } else {
        if (start !== -1) {
          horizontalLines.push({ start, end: i });
          start = -1;
        }
      }
    }
    if (start !== -1) {
      horizontalLines.push({ start, end: horizontalHist.length });
    }

    for (let line of horizontalLines) {
      let roi = new cv.Rect(0, line.start, src.cols, line.end - line.start);
      let roiMat = src.roi(roi);

      let verticalProjection = new cv.Mat();
      cv.reduce(roiMat, verticalProjection, 0, cv.REDUCE_AVG);

      let verticalHist = [];
      for (let i = 0; i < verticalProjection.cols; i++) {
          verticalHist.push(verticalProjection.ucharPtr(0, i)[0]);
      }

      let verticalLines = [];
      let vStart = -1;
      for (let i = 0; i < verticalHist.length; i++) {
        if (verticalHist[i] < 255) {
          if (vStart === -1) vStart = i;
        } else {
          if (vStart !== -1) {
            verticalLines.push({ start: vStart, end: i });
            vStart = -1;
          }
        }
      }
      if (vStart !== -1) {
        verticalLines.push({ start: vStart, end: verticalHist.length });
      }

      for (let vLine of verticalLines) {
        textBlocks.push({
          x: vLine.start,
          y: line.start,
          width: vLine.end - vLine.start,
          height: line.end - line.start
        });
      }
      roiMat.delete();
      verticalProjection.delete();
    }

    horizontalProjection.delete();
  } else {
    // Detección de contornos
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);


    for (let i = 0; i < contours.size(); i++) {
      let rect = cv.boundingRect(contours.get(i));
      textBlocks.push(rect)
    }

    textBlocks = textBlocks.filter(rect => rect.width > 100 && rect.height > 20);

    // Ordenar los rectángulos por su posición en la imagen (de arriba a abajo, izquierda a derecha)
    textBlocks.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 10) {
          return a.y - b.y;
      } else {
          return a.x - b.x;
      }
    });

    contours.delete();
    hierarchy.delete();
  }

  // Proceder con OCR y detección de texto
  for (let block of textBlocks) {
    let roi = src.roi(block);
    let dst = new cv.Mat();
    cv.cvtColor(roi, dst, cv.COLOR_GRAY2RGBA);

    let tempCanvas = document.createElement('canvas');
    cv.imshow(tempCanvas, dst);
    await applyOcr(tempCanvas, textarea);

    dst.delete();
  }

  src.delete();
  return textBlocks;
}

async function applyOcr(canvas, textarea) {
  const { data: { text } } = await Tesseract.recognize(canvas, languageSelect.value);
  // Dividir el texto en líneas y aplicar el filtro
  const filteredText = text.split('\n')
      .filter(line => line.trim().length > 0 && !line.match(/^[^\w\s]+$/))
      .join('\n');
  // Agregar el texto filtrado al valor del textarea
  textarea.value += filteredText + "\n";
}

languageSelect.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    handleFile(file);
  }
});
