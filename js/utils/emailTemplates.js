// =============================
// TEMPLATE GLPI / REMEDY
// =============================

function generarGLPIHTML(data, tipo) {
  const {
    caso = "", inicio = "", fin = "", sede = "",
    descripcion = "", caso_hw = "", ubicacion = "",
    peticionario = "", trabajos = ""
  } = data;

  return `
    <p>Buenos días,</p>
    <p>${trabajos}</p>
    <p>Ubicación máquina: <strong>${ubicacion}</strong></p>
    <table style="border-collapse:collapse;width:100%;font-family:Calibri,sans-serif;font-size:11pt;">
      <tr>
        <th style="border:1px solid black;text-align:center;">Nº Caso</th>
        <th style="border:1px solid black;text-align:center;">Fecha Inicio</th>
        <th style="border:1px solid black;text-align:center;">Fecha Fin</th>
        <th style="border:1px solid black;text-align:center;">SEDE AFECTADA</th>
        <th style="border:1px solid black;text-align:center;">DESCRIPCIÓN</th>
        <th style="border:1px solid black;text-align:center;">Caso HW</th>
      </tr>
      <tr>
        <td style="border:1px solid black;text-align:center;">${caso}</td>
        <td style="border:1px solid black;text-align:center;">${inicio}</td>
        <td style="border:1px solid black;text-align:center;">${fin}</td>
        <td style="border:1px solid black;text-align:center;">${sede}</td>
        <td style="border:1px solid black;text-align:center;">${descripcion}</td>
        <td style="border:1px solid black;text-align:center;">${caso_hw}</td>
      </tr>
    </table>
    <br>
    <div><strong>Cambio:</strong> ${caso}</div>
    <div><strong>Descripción:</strong> ${descripcion}</div>
    <div><strong>Peticionario:</strong> ${peticionario}</div>
  `;
}

// =============================
// TEMPLATE PROGRAMADO
// =============================

function generarPROGRAMADOHTML(data) {
  const {
    herramienta = "", num_cambio = "", descripcion = "",
    inicio = "", fin = "", remedy = "", caso_soporte = "",
    info = "", ap = "", downtime = "", sede = ""
  } = data;

  return `
    <p>Buenas tardes,</p>
    <p><strong>DATOS DE LA INTERVENCIÓN:</strong></p>
    <ul>
      <li><strong>FECHA PROGRAMADA:</strong> ${inicio} - ${fin}<br><br></li>
      <li><strong>TÍTULO DEL CAMBIO:</strong> ${num_cambio} - ${descripcion}<br><br></li>
      <li><strong>INCIDENCIA ${herramienta} RELACIONADA:</strong> ${remedy}<br><br></li>
      <li><strong>DATOS DE LA MÁQUINA:</strong><br><br><br><br></li>
      <li><strong>CASO SOPORTE:</strong> ${caso_soporte}<br><br></li>
      <li><strong>TÉCNICO ASIGNADO:</strong><br><br><br><br></li>
      <li><strong>INFORMACIÓN ADICIONAL:</strong><br><br>${info}</li>
    </ul>
    <p><strong>AP:</strong><br><br>${ap}</p>
    <p><strong>DOWNTIME:</strong><br>${downtime} min</p>
  `;
}

// =============================
// TEMPLATE VENTANA FT
// =============================

function generarVENTANAHTML(data) {
  const {
    numero_cambio = "", incidencia_remedy = "", hostname = "",
    serial = "", ubicacion = "", tarea = "", grupos = "",
    cambio = "", tiempo = ""
  } = data;

  return `
    <p>Buenos días;</p>
    <p>Hemos abierto el siguiente cambio en <strong>REMEDY</strong>:</p>
    <ul>
      <li>Numero de cambio: <strong>${numero_cambio}</strong></li>
      <li>Incidencia REMEDY relacionada: <strong>${incidencia_remedy}</strong></li>
      <li>Servidor/Equipo afectado: <strong>${hostname}</strong> con <strong>SN_${serial}</strong></li>
      <li>Ubicación del equipo: <strong>${ubicacion}</strong></li>
      <li>Tarea que se necesita realizar para resolver el incidente HW: <strong>${tarea}</strong></li>
      <li>Grupos de Soporte relacionados: <strong>${grupos}</strong></li>
    </ul>
    <p>Soporte nos ha indicado ya disponibilidad de la pieza.</p>
    <p>El cambio es <strong>${cambio}</strong> y el tiempo de intervención por parte del técnico es de <strong>${tiempo} mins</strong> aproximadamente.</p>
    <p>Por favor, indicadnos el impacto y la ventana total de intervención.</p>
    <p>¿Podéis indicarnos ventana para su ejecución?</p>
  `;
}

// =============================
// TEMPLATE ECONOCOM
// =============================

function generarECONOCOMHTML(data) {
  const {
    caso_opit = "", titulo_opit = "", cliente = "", sede = "",
    direccion = "", marca_modelo = "", serial = "", ubicacion = "",
    contacto = "", email = "", telefono = "", operativa = "",
    incidencia = ""
  } = data;

  return `
    <p>Buenos días,</p>
    <p>Hemos abierto el siguiente caso a través de <strong>JIRANEXT</strong> para vuestra gestión:</p>
    <p><strong>${caso_opit} - ${titulo_opit}</strong></p>
    <p>${incidencia}</p>
    <ul>
      <li>Nombre del cliente: <strong>${cliente}</strong></li>
      <li>Ubicación CPD: <strong>${sede}<br>${direccion}</strong></li>
      <li>Número de serie: <strong>${serial}</strong></li>
      <li>Marca y modelo equipo: <strong>${marca_modelo}</strong></li>
      <li>Ubicación física del equipo y Dirección: <strong>${ubicacion}</strong></li>
      <li>Persona de contacto: <strong>${contacto}</strong></li>
      <li>Teléfono / E-mail: <strong>${telefono} / ${email}</strong></li>
      <li>Incidencia detectada: <strong>${incidencia}</strong></li>
      <li>La máquina da servicio-Operativa: <strong>${operativa}</strong></li>
    </ul>
    <p>Si es necesario alguna información más por favor, hacédnoslo saber</p>
  `;
}