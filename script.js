const apiURL =
  "https://script.google.com/macros/s/AKfycbw0W53EORtBfP60NbnIn4DtAcjolnkvB9rFIV8QoxouRwJ2XSpO9ztEn7yozhLtqnDo/exec";
const SECRET_KEY = "chicho2025";

async function cargarTabla() {
  try {
    const res = await fetch(apiURL);
    let data = await res.json();

    // Eliminar encabezados y ordenar por goles descendente
    data = data.slice(1).sort((a, b) => b[1] - a[1]);

    let html = `<table>
        <tr>
          <th>Jugador</th>
          <th>Goles</th>
          <th>Acciones</th>
        </tr>`;

    data.forEach(([jugador, goles]) => {
      html += `
              <tr>
                <td>${jugador}</td>
                <td id="goles-${jugador}">${goles}</td>
                <td class="acciones">
                  <button class="sumar" onclick="modificarGol('${jugador}', ${goles}, 1)">+1</button>
                  <button class="restar" onclick="modificarGol('${jugador}', ${goles}, -1)">-1</button>
                </td>
              </tr>`;
    });

    html += `</table>`;
    document.getElementById("tabla").innerHTML = html;
  } catch (error) {
    console.error("Error al cargar la tabla:", error);
    document.getElementById("tabla").innerHTML =
      "<p style='color:red;'>Error cargando datos.</p>";
  }
}

async function modificarGol(jugador, golesActuales, cambio) {
    // Obtener la celda de goles correspondiente
    const td = document.getElementById(`goles-${jugador}`);
    
    // Mostrar el spinner solo en la celda de goles correspondiente
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    td.innerHTML = '';  // Limpiar el contenido de la celda
    td.appendChild(spinner);  // Agregar el spinner a la celda de goles

    const nuevosGoles = Math.max(0, golesActuales + cambio);  // Evita números negativos
    try {
      const response = await fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify({ jugador: jugador, goles: nuevosGoles })
      });

      if (response.ok) {
        // Actualizar la celda con el nuevo valor de goles
        td.innerHTML = nuevosGoles;  // Reemplazamos el spinner con el nuevo valor
        mostrarAnimacion(jugador);

        // Recargar y ordenar la tabla
        cargarTabla();  // Volver a cargar la tabla y ordenar los datos
      } else {
        alert("Error al actualizar. Intentalo de nuevo.");
        td.innerHTML = golesActuales;  // Revertir al valor anterior si hay error
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
      alert("Error de conexión. Intentalo de nuevo.");
      td.innerHTML = golesActuales;  // Revertir al valor anterior si hay error
    }
}

function mostrarAnimacion(jugador) {
  const filas = document.querySelectorAll("#tabla table tr");
  filas.forEach((fila) => {
    if (fila.children[0]?.textContent === jugador) {
      fila.classList.add("success");
      setTimeout(() => fila.classList.remove("success"), 2000);
    }
  });
}

cargarTabla();

document.getElementById("exportarPDF").addEventListener("click", () => {
  const tabla = document.querySelector(".tabla-container");
  html2pdf().from(tabla).save("tabla_goleadores.pdf");
});
