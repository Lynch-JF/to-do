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
