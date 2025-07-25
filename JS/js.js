if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const filterSelect = document.getElementById("filterPriority");

const listaPendientes = document.getElementById("listaPendientes");
const listaEnProceso = document.getElementById("listaEnProceso");
const listaTerminadas = document.getElementById("listaTerminadas");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const descripcion = input.value.trim();
  const prioridad = prioritySelect.value;
  if (!descripcion) return;

  const nuevaTarea = {
    id: Date.now(),
    descripcion,
    prioridad,
    estado: "Pendiente"
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  input.value = "";
  renderTareas();
});

filterSelect.addEventListener("change", () => renderTareas());

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function renderTareas() {
  listaPendientes.innerHTML = "";
  listaEnProceso.innerHTML = "";
  listaTerminadas.innerHTML = "";

  const filtro = filterSelect.value;

  tareas.forEach((tarea) => {
    if (filtro !== "Todas" && tarea.prioridad !== filtro) return;

    const li = document.createElement("li");
    li.classList.add("task-item", tarea.prioridad.toLowerCase());

    li.innerHTML = `
      <span>${tarea.descripcion}</span>
      <div class="task-actions">
        ${tarea.estado !== "Pendiente" ? '<button onclick="cambiarEstado(' + tarea.id + ', \'Pendiente\')">⬅</button>' : ''}
        ${tarea.estado === "Pendiente" ? '<button onclick="cambiarEstado(' + tarea.id + ', \'En Proceso\')">➡</button>' : ''}
        ${tarea.estado === "En Proceso" ? '<button onclick="cambiarEstado(' + tarea.id + ', \'Terminada\')">➡</button>' : ''}
        <button onclick="eliminarTarea(${tarea.id})">🗑</button>
      </div>
    `;

    if (tarea.estado === "Pendiente") {
      listaPendientes.appendChild(li);
    } else if (tarea.estado === "En Proceso") {
      listaEnProceso.appendChild(li);
    } else if (tarea.estado === "Terminada") {
      listaTerminadas.appendChild(li);
    }
  });
}

function cambiarEstado(id, nuevoEstado) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.estado = nuevoEstado;
    guardarTareas();
    renderTareas();
  }
}

function eliminarTarea(id) {
  tareas = tareas.filter(t => t.id !== id);
  guardarTareas();
  renderTareas();
}

// ✅ Cargar al inicio
renderTareas();


function renderTareas() {
  listaPendientes.innerHTML = "";
  listaEnProceso.innerHTML = "";
  listaTerminadas.innerHTML = "";

  const filtro = filterSelect.value;

  tareas.forEach((tarea) => {
    if (filtro !== "Todas" && tarea.prioridad !== filtro) return;

    const li = document.createElement("li");
    li.classList.add("task-item", tarea.prioridad.toLowerCase());

    // Si está en modo edición
    if (tarea.editando) {
      li.innerHTML = `
        <input type="text" id="editDesc${tarea.id}" value="${tarea.descripcion}" />
        <select id="editPriority${tarea.id}">
          <option value="Alta" ${tarea.prioridad === "Alta" ? "selected" : ""}>🔴 Alta</option>
          <option value="Media" ${tarea.prioridad === "Media" ? "selected" : ""}>🟠 Media</option>
          <option value="Normal" ${tarea.prioridad === "Normal" ? "selected" : ""}>🟢 Normal</option>
        </select>
        <div class="task-actions">
          <button onclick="guardarEdicion(${tarea.id})">💾</button>
          <button onclick="cancelarEdicion(${tarea.id})">❌</button>
        </div>
      `;
    } else {
      li.innerHTML = `
        <span>${tarea.descripcion}</span>
        <div class="task-actions">
          <button onclick="editarTarea(${tarea.id})">✏️</button>
          ${tarea.estado !== "Pendiente" ? '<button onclick="cambiarEstado(' + tarea.id + ', \'Pendiente\')">⬅</button>' : ''}
          ${tarea.estado === "Pendiente" ? '<button onclick="cambiarEstado(' + tarea.id + ', \'En Proceso\')">➡</button>' : ''}
          ${tarea.estado === "En Proceso" ? '<button onclick="cambiarEstado(' + tarea.id + ', \'Terminada\')">➡</button>' : ''}
          <button onclick="eliminarTarea(${tarea.id})">🗑</button>
        </div>
      `;
    }

    if (tarea.estado === "Pendiente") {
      listaPendientes.appendChild(li);
    } else if (tarea.estado === "En Proceso") {
      listaEnProceso.appendChild(li);
    } else if (tarea.estado === "Terminada") {
      listaTerminadas.appendChild(li);
    }
  });
}

// Funciones para edición

function editarTarea(id) {
  tareas = tareas.map(t => t.id === id ? { ...t, editando: true } : t);
  renderTareas();
}

function guardarEdicion(id) {
  const descInput = document.getElementById(`editDesc${id}`);
  const prioritySelect = document.getElementById(`editPriority${id}`);

  if (!descInput.value.trim()) return alert("La descripción no puede estar vacía.");

  tareas = tareas.map(t => {
    if (t.id === id) {
      return {
        ...t,
        descripcion: descInput.value.trim(),
        prioridad: prioritySelect.value,
        editando: false
      };
    }
    return t;
  });

  guardarTareas();
  renderTareas();
}

function cancelarEdicion(id) {
  tareas = tareas.map(t => t.id === id ? { ...t, editando: false } : t);
  renderTareas();
}

const darkModeToggle = document.getElementById("darkModeToggle");

function loadDarkMode() {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
}

function toggleDarkMode() {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
  }
}

darkModeToggle.addEventListener("change", toggleDarkMode);

loadDarkMode();


const deadlineInput = document.getElementById("taskDeadline");

const nuevaTarea = {
  id: Date.now(),
  descripcion,
  prioridad,
  estado: "Pendiente",
  deadline: deadlineInput.value || null
};


const fechaTexto = tarea.deadline
  ? new Date(tarea.deadline).toLocaleString()
  : "Sin fecha límite";

const ahora = new Date();
let claseFecha = "";

if (tarea.deadline) {
  const deadlineDate = new Date(tarea.deadline);
  const diffMs = deadlineDate - ahora;
  if (diffMs < 0) {
    claseFecha = "vencida";  // fecha pasada
  } else if (diffMs <= 24 * 60 * 60 * 1000) {
    claseFecha = "proxima";  // menos de 24h
  }
}

li.innerHTML = `
  <span>
    ${tarea.descripcion}<br/>
    <small class="deadline ${claseFecha}">${fechaTexto}</small>
  </span>
  <div class="task-actions">
    <!-- botones -->
  </div>
`;


function checkDeadlines() {
  const ahora = new Date();
  const proximas = tareas.filter(t => {
    if (!t.deadline) return false;
    const diffMs = new Date(t.deadline) - ahora;
    return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000 && t.estado !== "Terminada";
  });
  const vencidas = tareas.filter(t => {
    if (!t.deadline) return false;
    return new Date(t.deadline) < ahora && t.estado !== "Terminada";
  });

  if (vencidas.length > 0) {
    alert(`⚠️ Tienes ${vencidas.length} tarea(s) vencida(s).`);
  } else if (proximas.length > 0) {
    alert(`⏰ Tienes ${proximas.length} tarea(s) próxima(s) a vencer en menos de 24 horas.`);
  }
}

// Llama checkDeadlines() al final de renderTareas() y al inicio:
checkDeadlines();


const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

exportBtn.addEventListener("click", () => {
  const dataStr = JSON.stringify(tareas, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tareas.json";
  a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => {
  importInput.click();
});

importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedTareas = JSON.parse(e.target.result);
      if (!Array.isArray(importedTareas)) throw new Error("Formato inválido");
      // Validar y agregar solo tareas con id y descripcion
      importedTareas.forEach(tarea => {
        if (tarea.id && tarea.descripcion) {
          // Evitar duplicados por id
          if (!tareas.find(t => t.id === tarea.id)) {
            tareas.push(tarea);
          }
        }
      });
      guardarTareas();
      renderTareas();
      alert("Importación exitosa!");
    } catch (error) {
      alert("Error al importar: " + error.message);
    }
  };
  reader.readAsText(file);
});




function programarNotificacion(tarea) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  let minutos;

  switch (tarea.prioridad) {
    case "Alta":
      minutos = 5;
      break;
    case "Media":
      minutos = 10;
      break;
    case "Normal":
    default:
      minutos = 20;
      break;
  }

  const ms = minutos * 60 * 1000;

  setTimeout(() => {
    const tareaActual = tareas.find(t => t.id === tarea.id);

    if (tareaActual && tareaActual.estado === "Pendiente") {
      new Notification("⏰ Recordatorio de tarea", {
        body: `La tarea "${tarea.descripcion}" (prioridad ${tarea.prioridad}) sigue pendiente.`,
        icon: "https://cdn-icons-png.flaticon.com/512/2913/2913461.png"
      });
    }
  }, ms);
}



tareas.push(nuevaTarea);
guardarTareas();
programarNotificacion(nuevaTarea);
renderTareas();



