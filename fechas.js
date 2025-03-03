const readline = require("readline");
const fs = require('fs');

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

let tareas = [];

if (fs.existsSync('tareas.json')){
    const data = fs.readFileSync('tareas.json', 'utf8');
    tareas = JSON.parse(data);
}
function task() {
    rl.question("📌 Menú:\n1️⃣  Agregar tarea\n2️⃣  Mostrar tareas pendientes\n3️⃣  Eliminar tarea\n4️⃣  Salir \n", (o) =>{
        o = Number(o);
        if (o === 1){
            rl.question("Introduce el nombre de la tarea ", (n) => {
                rl.question("Introduce la fecha limite (en formato YYYY-MM-DD): ", (f) => {
                    let fechaValida = !isNaN(new Date(f).getTime());
                    if (!fechaValida) {
                        console.log("❌ La fecha ingresada no es válida.")
                        task();
                    }
                    else if (fechaValida) {
                        let nuevaTarea = {nombre: n, fecha: f };
                        tareas.push(nuevaTarea);
                        fs.writeFileSync('tareas.json', JSON.stringify(tareas, null, 2), 'utf8');
                        console.log("✅ Tarea agregada.");
                        task()
                    }
                })
            });
        }
        else if (o === 2){
            if (tareas.length === 0){
                console.log("📋 La lista de tareas está vacía.");
            }
            else {
                console.log("📋 Lista de tareas:");
                tareas.forEach((tarea, i) => {
                    let fecha = new Date(tarea.fecha);
                    let fechaAcutual = new Date();
                    let diasAct = Math.floor(fechaAcutual.getTime() / (1000 * 3600 * 24));
                    let dias = Math.floor(fecha.getTime() / (1000 * 3600 * 24));
                    let diasFalt = dias - diasAct;
                    console.log(`${i + 1}. ${tarea.nombre} - Fecha limite: ${tarea.fecha} - Dias faltantes: ${diasFalt}`);
                });
            }
            task();
        }
        else if (o === 3){
            if (tareas.length === 0){
                console.log("📋 La lista de tareas está vacía.");
                task();        
            }
            else {
                console.log("📋 Lista de tareas:");
                tareas.forEach((tarea, i) => {
                    console.log(`${i + 1}. ${tarea.nombre} - Fecha limite: ${tarea.fecha}`);
                });
                rl.question("Introduce la tarea a eliminar: ", (elimina) => {
                    elimina = Number(elimina);
                    if (elimina > 0 && elimina <= tareas.length) {
                        tareas.splice(elimina - 1, 1);
                        fs.writeFileSync('tareas.json', JSON.stringify(tareas, null,2), 'utf8');
                        console.log("✅ tarea eliminada.");
                        task();
                    }
                });
            }
        }
        else if (o === 4){
            console.log("👋 Saliendo...");
            fs.writeFileSync('tareas.json', JSON.stringify(tareas, null, 2), 'utf8');
            rl.close();
        }
        else {
            console.log("❌ Opción no válida.");
            task();
        }
    });
}
task();