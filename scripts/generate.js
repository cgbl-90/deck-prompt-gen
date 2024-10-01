// Nuevas opciones predeterminadas para cada categoría
const options = {
  style: [
    "Profesional",
    "Casual",
    "Narrativo",
    "Educativo",
    "Corporativo",
    "Creativo",
    "Tecnológico",
  ],
  tone: ["Formal", "Conversacional", "Persuasivo", "Inspirador", "Pragmático"],
  purpose: [
    "Educar",
    "Motivar",
    "Vender",
    "Convencer",
    "Gestionar Cambio",
    "Negociar",
    "Colaborar",
    "Informar Progreso",
  ],
  audience: [
    "Ejecutivos",
    "Público General",
    "Estudiantes",
    "Profesionales del área",
    "Inversores",
    "Directores y Gerentes",
    "Proveedores",
    "Equipo de Ventas",
    "Clientes Potenciales",
    "Stakeholders",
  ],
  length: [
    "Corto (5-10 minutos)",
    "Medio (10-20 minutos)",
    "Largo (más de 20 minutos)",
    "Pitch rápido (1-3 minutos)",
    "Breve (3-5 minutos)",
    "Conferencia (más de 30 minutos)",
    "Taller (1-2 horas)",
  ],
  slideType: [
    "Introducción",
    "Agenda",
    "Resumen",
    "Conceptos Clave",
    "Estudio de Caso",
    "Estadísticas",
    "Comparación",
    "Proceso",
    "Cronograma",
    "Presentación del Equipo",
    "Desafíos",
    "Soluciones",
    "Resultados",
    "Conclusión",
    "Llamado a la Acción",
  ],
};

// Función para cargar las opciones dinámicamente
function loadOptions() {
  loadOptionGroup("style-options", "style");
  loadOptionGroup("tone-options", "tone");
  loadOptionGroup("purpose-options", "purpose");
  loadOptionGroup("audience-options", "audience");
  loadLengthOptions("length-options"); // Cambiado para usar la nueva función
  loadSlideTypeOptions("slide-type-options");
}

// Carga las opciones en el HTML según la categoría
function loadOptionGroup(groupId, category) {
  const groupElement = document.getElementById(groupId);
  options[category].forEach((option) => {
    const label = document.createElement("label");
    const input = document.createElement("input");

    // Cambiado a checkbox para estilo, tono y propósito
    if (category === "style" || category === "tone" || category === "purpose") {
      input.type = "checkbox";
      input.name = category;
    } else {
      input.type = "radio"; // Cambiado a radio para length
      input.name = category; // Mantener el mismo nombre para agrupar
    }

    input.value = option;
    label.appendChild(input);
    label.append(option);
    groupElement.appendChild(label);
  });
}

// Función específica para cargar opciones de longitud
function loadLengthOptions(groupId) {
  const groupElement = document.getElementById(groupId);
  options.length.forEach((option) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio"; // Mantener como radio para permitir una sola selección
    input.name = "length"; // Nombre del grupo
    input.value = option;
    label.appendChild(input);
    label.append(option);
    groupElement.appendChild(label);
  });
}

// Carga las opciones de tipos de diapositivas con checkboxes
function loadSlideTypeOptions(groupId) {
  const groupElement = document.getElementById(groupId);
  options.slideType.forEach((type) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "slideType";
    input.value = type;

    // Marcar "Introducción" por defecto
    if (type === "Introducción") {
      input.checked = true;
    }

    input.addEventListener("change", handleSlideTypeSelection);
    label.appendChild(input);
    label.append(type);
    groupElement.appendChild(label);
  });
}

// Actualiza el valor del número de diapositivas
const slideCountInput = document.getElementById("slide-count");
const slideCountValue = document.getElementById("slide-count-value");

// Manejar cambio en el número de diapositivas y limitar la selección de tipos de diapositivas
slideCountInput.addEventListener("input", function () {
  slideCountValue.textContent = slideCountInput.value;
  limitSlideTypesSelection();
});

// Función que limita el número de tipos de diapositivas seleccionadas
function limitSlideTypesSelection() {
  const maxSlides = parseInt(slideCountInput.value);
  const selectedSlides = document.querySelectorAll(
    'input[name="slideType"]:checked'
  ).length;
  const slideTypeCheckboxes = document.querySelectorAll(
    'input[name="slideType"]'
  );

  slideTypeCheckboxes.forEach((checkbox) => {
    if (!checkbox.checked && selectedSlides >= maxSlides) {
      checkbox.disabled = true; // Deshabilitar si ya se alcanzó el máximo
    } else {
      checkbox.disabled = false; // Habilitar si aún no se alcanzó el máximo
    }
  });
}

// Manejar la selección de tipos de diapositivas y aplicar límite
function handleSlideTypeSelection() {
  limitSlideTypesSelection(); // Llamar cada vez que se seleccione o deseleccione una opción
}

// Función para generar el prompt final
function generatePrompt() {
  // Verificar si todas las opciones están seleccionadas
  const styles = Array.from(
    document.querySelectorAll('input[name="style"]:checked')
  ).map((el) => el.value);
  const tone = document.querySelector('input[name="tone"]:checked')?.value;
  const purposes = Array.from(
    document.querySelectorAll('input[name="purpose"]:checked')
  ).map((el) => el.value);
  const audience = document.querySelector(
    'input[name="audience"]:checked'
  )?.value;
  const length = document.querySelector('input[name="length"]:checked')?.value;
  const slideCount = slideCountInput.value;

  const slideTypes = [];
  document.querySelectorAll('input[name="slideType"]:checked').forEach((el) => {
    slideTypes.push(el.value);
  });

  // Obtener el valor de la idea del usuario
  const idea =
    document.getElementById("idea-input")?.value || "sin idea específica";

  // Condición para verificar si falta alguna selección
  if (
    !tone ||
    purposes.length === 0 ||
    !audience ||
    !length ||
    slideTypes.length === 0
  ) {
    alert(
      "Por favor, selecciona todas las opciones antes de generar el prompt."
    );
    return;
  }

  // Si todas las opciones están seleccionadas, generar el prompt
  const styleText =
    styles.length > 0 ? styles.join(", ") : "sin estilo específico";
  const purposeText =
    purposes.length > 0 ? purposes.join(", ") : "sin propósito específico";
  const slideTypeText = slideTypes.join(", ");

  const prompt = `Crear una presentación con estilo ${styleText}, tono de voz ${tone}, con el propósito de ${purposeText}, para una audiencia de ${audience}. 
    La presentación tendrá una duración ${length}, con ${slideCount} diapositivas, e incluirá los siguientes tipos de diapositivas: ${slideTypeText}, basada en esta idea: ${idea}.`;

  // Mostrar el prompt generado en el textarea
  document.getElementById("generated-prompt").textContent = prompt;
}

// Función para copiar el contenido del prompt al portapapeles
function copyPrompt() {
  const promptText = document.getElementById("generated-prompt").textContent;

  // Verificar que haya texto para copiar
  if (promptText.trim() === "") {
    alert("No hay texto para copiar.");
    return;
  }

  navigator.clipboard
    .writeText(promptText)
    .then(() => {
      alert("Prompt copiado al portapapeles!");
    })
    .catch((err) => {
      console.error("Error al copiar: ", err);
    });
}

// Asociar el botón de copia con la función de copiar
document.getElementById("copy-prompt").addEventListener("click", copyPrompt);

// Asociar el botón con la función de generación de prompt
document
  .getElementById("generate-prompt")
  .addEventListener("click", generatePrompt);

// Cargar las opciones dinámicamente al cargar la página
window.onload = loadOptions;
