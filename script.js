
 // Validar los campos del formulario
function validateTaskForm() {

    // Obtener los valores del formulario
    const nombre = document.getElementById("task-name").value.trim();
    const descripcion = document.getElementById("task-Description").value.trim();
    const asignadoA = document.getElementById("task-assignment").value.trim();
    const fechaDeEntrega = document.getElementById("task-date").value;
    const estado = document.getElementById("task-status").value;

    // Validar nombre de la tarea
    if (nombre === "" || nombre.length <= 8) {
        alert("El nombre debe tener más de 8 caracteres");
        return false;
    }

    // Validar descripcion de la tarea
    if (descripcion === "" || descripcion.length <= 15) {
        alert("La descripcion debe tener más de 15 caracteres");
        return false;
    }

    // Validar persona asignada
    if (asignadoA === "" || asignadoA.length <= 8) {
        alert("La asignacion debe tener más de 8 caracteres");
        return false;
    }

    // Validar fecha de entrega
    if (fechaDeEntrega === "") {
        alert("Debes seleccionar una fecha de entrega");
        return false;
    }

    // Validar estado de la tarea
    if (estado === "") {
        alert("Debes seleccionar un estado");
        return false;
    }

    return true;
}

// Administrar las tareas
class TaskManager {

    constructor() {
        this.tareas = [];
        this.siguienteId = 1;
    }

    // Obtener todas las tareas
    getAllTasks() {
        return this.tareas;
    }

    // Obtener tareas por estado
    getTasksWithStatus(estado) {
        return this.tareas.filter(tarea => tarea.estado === estado);
    }

    // Agregar una tarea
    addTask(tarea) {
        tarea.id = this.siguienteId;
        this.siguienteId++;
        this.tareas.push(tarea);
    }

    // Eliminar una tarea
    deleteTask(taskId) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== taskId);
    }

    // Actualizar el estado de una tarea
    updateTask(taskId, estado) {
        const tarea = this.tareas.find(tarea => tarea.id === taskId);

        if (tarea) {
            tarea.estado = estado;
        }
    }

    // Cambiar la persona asignada
    assignTask(taskId, asignadoA) {
        const tarea = this.tareas.find(tarea => tarea.id === taskId);

        if (tarea) {
            tarea.asignadoA = asignadoA;
        }
    }
}

// Crear el administrador de tareas
const administradorTareas = new TaskManager();

// Obtener elementos del HTML
const formulario = document.getElementById("form-tareas");
const contenedorForm = document.getElementById("contenedorform");
const btnNuevaTarea = document.getElementById("btnNuevaTarea-Newtask");
const btnCierraForm = document.getElementById("btncierraform");

// Abrir formulario
btnNuevaTarea.addEventListener("click", function () {
    contenedorForm.showModal();
});

// Cerrar formulario
btnCierraForm.addEventListener("click", function () {
    contenedorForm.close();
});

// Mostrar una tarea en el tablero
function mostrarTarea(tarea) {

    let columna;

    if (tarea.estado === "hacer") {
        columna = document.getElementById("tareasHacer");
    } else if (tarea.estado === "proceso" || tarea.estado === "revision") {
        columna = document.getElementById("tareasProceso");
    } else {
        columna = document.getElementById("tareasHechas");
    }

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-tarea");
    tarjeta.dataset.id = tarea.id;

    const titulo = document.createElement("h3");
    titulo.textContent = tarea.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = tarea.descripcion;

    const asignado = document.createElement("p");
    asignado.textContent = "Asignado a: " + tarea.asignadoA;

    const fecha = document.createElement("p");
    fecha.textContent = "Fecha de entrega: " + tarea.fechaDeEntrega;

    const estado = document.createElement("p");
    estado.textContent = "Estado: " + tarea.estado;

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";

    btnEliminar.addEventListener("click", function () {
        administradorTareas.deleteTask(tarea.id);
        tarjeta.remove();
    });

    tarjeta.append(titulo, descripcion, asignado, fecha, estado, btnEliminar);
    columna.appendChild(tarjeta);
}

// Guardar una tarea desde el formulario
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateTaskForm()) {
        return;
    }

    const tarea = {
        nombre: document.getElementById("task-name").value.trim(),
        descripcion: document.getElementById("task-Description").value.trim(),
        asignadoA: document.getElementById("task-assignment").value.trim(),
        fechaDeEntrega: document.getElementById("task-date").value,
        estado: document.getElementById("task-status").value
    };

    administradorTareas.addTask(tarea);

    const tareas = administradorTareas.getAllTasks();
    mostrarTarea(tareas[tareas.length - 1]);

    formulario.reset();
    contenedorForm.close();
});
