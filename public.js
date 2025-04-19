const apiURL = "https://script.google.com/macros/s/AKfycbw0W53EORtBfP60NbnIn4DtAcjolnkvB9rFIV8QoxouRwJ2XSpO9ztEn7yozhLtqnDo/exec";

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
                <td class="acciones">
                  <button class="sumar2" onclick="modificarGol('${jugador}', ${goles}, 1)">+1</button>
                  <button class="restar2" onclick="modificarGol('${jugador}', ${goles}, -1)">-1</button>
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

cargarTabla();

function modificarGol() {
    alert("Esta acción sólo está habilitada para administradores.");
  }
