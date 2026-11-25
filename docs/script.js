
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

    if (descripcion === "" || descripcion.length <= 15) {
        alert("La descripcion debe tener más de 15 caracteres");
        return false;
    }

    if (asignadoA === "" || asignadoA.length <= 8) {
        alert("La asignacion debe tener más de 8 caracteres");
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

    save() {
        localStorage.setItem("myPlanningTask.tasks", JSON.stringify(this.tareas));
        localStorage.setItem("myPlanningTask.siguienteId", String(this.siguienteId));
    }

    load() {
        const tareasGuardadas = localStorage.getItem("myPlanningTask.tasks");

        if (tareasGuardadas === null) {
            return false;
        }

        const tareas = JSON.parse(tareasGuardadas);

        if (!Array.isArray(tareas)) {
            throw new TypeError("Las tareas guardadas deben ser un arreglo.");
        }

        this.tareas = tareas;

        const siguienteIdGuardado = localStorage.getItem("myPlanningTask.siguienteId");
        const siguienteId = siguienteIdGuardado === null ? NaN : Number(siguienteIdGuardado);

        const siguienteIdPorTareas = this.tareas.reduce(
            (maxId, tarea) => Math.max(maxId, Number(tarea.id) || 0),
            0
        ) + 1;

        if (siguienteIdGuardado !== null && (!Number.isInteger(siguienteId) || siguienteId < 1)) {
            throw new TypeError("El siguiente ID guardado no es válido.");
        }

        this.siguienteId = Math.max(siguienteId || 1, siguienteIdPorTareas);

        return true;
    }

    getAllTasks() {
        return this.tareas;
    }

    getTasksWithStatus(estado) {
        return this.tareas.filter(tarea => tarea.estado === estado);
    }

    getTaskById(taskId) {
        return this.tareas.find(tarea => tarea.id === taskId);
    }

    addTask(tarea) {
        tarea.id = this.siguienteId;
        this.siguienteId++;
        this.tareas.push(tarea);
        this.save();
    }

    deleteTask(taskId) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== taskId);
        this.save();
    }

    updateTask(taskId, estado) {
        const tarea = this.tareas.find(tarea => tarea.id === taskId);

        if (tarea) {
            tarea.estado = estado;
            this.save();
        }
    }

    assignTask(taskId, asignadoA) {
        const tarea = this.tareas.find(tarea => tarea.id === taskId);

        if (tarea) {
            tarea.asignadoA = asignadoA;
            this.save();
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
const tableroTareas = document.querySelector(".task-board-tablero");



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



// Volver a dibujar todas las tareas desde el TaskManager
function renderTasks() {

    document.getElementById("tareasHacer").innerHTML = "";
    document.getElementById("tareasProceso").innerHTML = "";
    document.getElementById("tareasRevision").innerHTML = "";
    document.getElementById("tareasHechas").innerHTML = "";

    administradorTareas.getAllTasks().forEach(mostrarTarea);
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
    tarjeta.classList.add("tarjeta-tarea");
    tarjeta.dataset.id = tarea.id;
    tarjeta.draggable = true;

    // Detectar cuando comenzamos a arrastrar la tarjeta
    tarjeta.addEventListener("dragstart", function (event) {
        event.dataTransfer.setData("text/plain", tarea.id);
    });


    const titulo = document.createElement("h3");
    titulo.textContent = tarea.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = tarea.descripcion;

    const asignado = document.createElement("p");
    asignado.textContent = "Asignado a: " + tarea.asignadoA;

    const fecha = document.createElement("p");
    fecha.textContent = "Fecha de entrega: " + tarea.fechaDeEntrega;

    const estado = document.createElement("p");
    estado.classList.add("estado-tarea");


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
    btnEliminar.classList.add("btn", "btn-eliminar");
    btnEliminar.textContent = "Eliminar";

    btnEliminar.addEventListener("click", function () {
        administradorTareas.deleteTask(tarea.id);
        renderTasks();
    });


    tarjeta.append(titulo, descripcion, asignado, fecha, estado);


    if (tarea.estado !== "hecho") {
        const btnHecho = document.createElement("button");
        btnHecho.type = "button";
        btnHecho.classList.add("btn", "done-button");
        btnHecho.textContent = "Marcar como hecha";
        tarjeta.append(btnHecho);
    }


    tarjeta.append(btnEliminar);
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



// Recuperar las tareas guardadas; usar ejemplos solo en la primera ejecución.
if (!administradorTareas.load()) {
    tareasEjemplo.forEach(function (tarea) {
        administradorTareas.addTask(tarea);
    });
}

renderTasks();



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
    renderTasks();

    formulario.reset();
    contenedorForm.close();
});



// Un solo listener para los botones de todas las tarjetas
tableroTareas.addEventListener("click", function (event) {

    if (!event.target.classList.contains("done-button")) {
        return;
    }

    const tarjeta = event.target.parentElement;
    const taskId = Number(tarjeta.dataset.id);
    const tarea = administradorTareas.getTaskById(taskId);

    if (tarea) {
        administradorTareas.updateTask(taskId, "hecho");
        renderTasks();
    }

});



// Permitir soltar tarjetas en las columnas
const columnas = document.querySelectorAll(".columna");

columnas.forEach(function (columna) {

    columna.addEventListener("dragover", function (event) {
        event.preventDefault();
    });


    // Detectar cuando soltamos una tarjeta
    columna.addEventListener("drop", function (event) {
        event.preventDefault();

        // Obtener el ID de la tarea que estamos moviendo
        const taskId = Number(event.dataTransfer.getData("text/plain"));

        // Identificar el estado de la columna donde soltamos la tarjeta
        const tituloColumna = columna.querySelector("h2").textContent.trim();

        let nuevoEstado;

        if (tituloColumna === "PENDIENTE") {
            nuevoEstado = "pendiente";
        } else if (tituloColumna === "EN PROGRESO") {
            nuevoEstado = "proceso";
        } else if (tituloColumna === "REVISIÓN") {
            nuevoEstado = "revision";
        } else if (tituloColumna === "HECHO") {
            nuevoEstado = "hecho";
        }

        // Actualizar el estado de la tarea
        administradorTareas.updateTask(taskId, nuevoEstado);

        // Buscar la tarjeta que estamos moviendo
        const tarjeta = document.querySelector(`[data-id="${taskId}"]`);

        // Mover la tarjeta a la nueva columna
        renderTasks();

        // Actualizar el estado que se muestra en la tarjeta
        // renderTasks() vuelve a crear la tarjeta con su nuevo estado

        // Actualizar los contadores
        actualizarContadores();

    });

});


// Personalización del tema claro y oscuro

const btnModoClaro = document.getElementById("btnModoClaro");
const btnModoOscuro = document.getElementById("btnModoOscuro");


// Aplicar el tema seleccionado
function aplicarTema(tema) {

    document.body.setAttribute("data-theme", tema);

    btnModoClaro.classList.remove("activo");
    btnModoOscuro.classList.remove("activo");

    if (tema === "dark") {
        btnModoOscuro.classList.add("activo");
    } else {
        btnModoClaro.classList.add("activo");
    }

    // Guardar la preferencia del usuario
    localStorage.setItem("myPlanningTask.theme", tema);
}


// Recuperar el tema guardado
const temaGuardado = localStorage.getItem("myPlanningTask.theme");

if (temaGuardado) {
    aplicarTema(temaGuardado);
} else {
    aplicarTema("light");
}


// Cambiar al modo claro
btnModoClaro.addEventListener("click", function () {
    aplicarTema("light");
});


// Cambiar al modo oscuro
btnModoOscuro.addEventListener("click", function () {
    aplicarTema("dark");
});
