
function validateTaskForm() {

// Constantes para traer la info del form
    const nombre = document.getElementById("task-name").value.trim();
    const descripcion = document.getElementById("task-Description").value.trim();
    const asignadoA = document.getElementById("task-assignment").value.trim();
    const fechaDeEntrega = document.getElementById("task-date").value;
    const estado = document.getElementById("task-status").value;

// Condicionales del form
    if (nombre === "" || nombre.length <= 8) {
        alert("El nombre debe tener más de 8 caracteres");
        return false;
    }

    if (descripcion === "" || descripcion.length <= 8) {
        alert("La descripcion debe tener más de 8 caracteres");
        return false;
    }

    if (asignadoA === "" || asignadoA.length <= 3) {
        alert("La asignacion debe tener más de 3 caracteres");
        return false;
    }

    if (fechaDeEntrega === "") {
        alert("Debes seleccionar una fecha de entrega");
        return false;
    }

    if (estado === "") {
        alert("Debes seleccionar un estado");
        return false;
    }

    return true;
}

// Creamos la clase (blue print) del gestor de tareas y sus métodos.
class TaskManager {

    constructor() {
        this.tareas = [];
        this.siguienteId = 1;
    }
    getAllTasks() {
        return this.tareas;
    }
    getTasksWithStatus(estado) {
        return this.tareas.filter(tarea => tarea.estado === estado);
    }

    addTask(tarea) {
        tarea.id = this.siguienteId;
        this.siguienteId++;
        this.tareas.push(tarea);
    }
    deleteTask(taskId) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== taskId);
    }
    updateTask(taskId, estado) {
        const tarea = this.tareas.find(tarea => tarea.id === taskId);

        if (tarea) {
            tarea.estado = estado;
        }
    }
    assignTask(taskId, asignadoA) {
        const tarea = this.tareas.find(tarea => tarea.id === taskId);

        if (tarea) {
            tarea.asignadoA = asignadoA;
        }
    }
}


//vamos a construir ahora si el gestor  de taks
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

// Cantidades que hay en los contadores y actualizarlos 
function actualizarContadores() {
    document.getElementById("cantidadHacer").textContent =
        administradorTareas.getTasksWithStatus("pendiente").length;

    document.getElementById("cantidadProceso").textContent =
        administradorTareas.getTasksWithStatus("proceso").length;

    document.getElementById("cantidadRevision").textContent =
        administradorTareas.getTasksWithStatus("revision").length;

    document.getElementById("cantidadHechas").textContent =
        administradorTareas.getTasksWithStatus("hecho").length;
}

// Mostrar una tarea en el tablero
function mostrarTarea(tarea) {

    let columna;

    if (tarea.estado === "pendiente") {
        columna = document.getElementById("tareasHacer");
    } else if (tarea.estado === "proceso") {
        columna = document.getElementById("tareasProceso");
    } else if (tarea.estado === "revision") {
        columna = document.getElementById("tareasRevision");
    } else {
        columna = document.getElementById("tareasHechas");
    }

    const tarjeta = document.createElement("div");
     ("tarjeta-tarea");
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

    if (tarea.estado === "pendiente") {
        estado.textContent = "Estado: PENDIENTE";
    } else if (tarea.estado === "proceso") {
        estado.textContent = "Estado: EN PROGRESO";
    } else if (tarea.estado === "revision") {
        estado.textContent = "Estado: REVISIÓN";
    } else {
        estado.textContent = "Estado: HECHO";
    }

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.classList.add("btn");
    btnEliminar.textContent = "Eliminar";

    btnEliminar.addEventListener("click", function () {
        administradorTareas.deleteTask(tarea.id);
        tarjeta.remove();
        actualizarContadores();
    });

    tarjeta.append(titulo, descripcion, asignado, fecha, estado, btnEliminar);
    columna.appendChild(tarjeta);

    actualizarContadores();
}

// Datos de prueba en JS . 
const tareasEjemplo = [
    {
        nombre: "Diseñar página principal",
        descripcion: "Preparar la estructura visual de la página principal.",
        asignadoA: "Ana Martínez",
        fechaDeEntrega: "2026-11-02",
        estado: "pendiente"
    },
    {
        nombre: "Crear formulario de tareas",
        descripcion: "Construir los campos para registrar nuevas tareas.",
        asignadoA: "Laura Gómez",
        fechaDeEntrega: "2026-11-03",
        estado: "pendiente"
    },
    {
        nombre: "Validar datos ingresados",
        descripcion: "Comprobar que los campos cumplan las reglas definidas.",
        asignadoA: "Carlos Pérez",
        fechaDeEntrega: "2026-11-04",
        estado: "proceso"
    },
    {
        nombre: "Revisar diseño de tarjetas",
        descripcion: "Verificar que la información se muestre correctamente.",
        asignadoA: "Sofía Torres",
        fechaDeEntrega: "2026-11-05",
        estado: "revision"
    },
    {
        nombre: "Probar eliminación de tareas",
        descripcion: "Comprobar que las tareas eliminadas desaparezcan del tablero.",
        asignadoA: "Daniel Rojas",
        fechaDeEntrega: "2026-11-06",
        estado: "hecho"
    }
];

// Agregar las tareas de ejemplo al tablero
tareasEjemplo.forEach(function (tarea) {
    administradorTareas.addTask(tarea);
    mostrarTarea(tarea);
});

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
    mostrarTarea(tarea);

    formulario.reset();
    contenedorForm.close();
});
