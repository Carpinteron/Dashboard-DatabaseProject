export function run(){
  const { exec } = require("child_process");

exec("node sql.js", (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar el script: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Salida de error: ${stderr}`);
        return;
    }
    console.log(`Salida del script:\n${stdout}`);
});
}
