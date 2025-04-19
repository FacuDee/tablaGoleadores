const apiURL =
  "https://script.google.com/macros/s/AKfycbw0W53EORtBfP60NbnIn4DtAcjolnkvB9rFIV8QoxouRwJ2XSpO9ztEn7yozhLtqnDo/exec";
const SECRET_KEY = "vivachicho2025";

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
            <td>${goles}</td>
            <td>
              <button onclick="modificarGol('${jugador}', ${goles}, 1)">+1</button>
              <button onclick="modificarGol('${jugador}', ${goles}, -1)">-1</button>
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
  const nuevosGoles = Math.max(0, golesActuales + cambio);

  try {
    const response = await fetch(apiURL, {
      method: "POST",
      body: JSON.stringify({
        jugador: jugador,
        goles: nuevosGoles,
        clave: SECRET_KEY,
      }),
    });

    if (response.ok) {
      mostrarAnimacion(jugador);
      cargarTabla(); // Refresca la tabla y la ordena
    } else {
      alert("No autorizado o error al actualizar.");
    }
  } catch (error) {
    console.error("Error en la actualización:", error);
    alert("Error de conexión. Intentalo de nuevo.");
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
