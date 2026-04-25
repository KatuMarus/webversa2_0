// =============================
// WEBVERSA — LÓGICA PRINCIPAL
// =============================

const sedeAbrev = {
  "CERDANYOLA": "CER",
  "TORREJÓN":   "TOR",
  "YÉCORA":     "YÉC",
  "ATLAS BCN":  "ATL",
  "ECHEGARAY":  "ECH",
  "COSLADA":    "COS",
  "ULISES":     "ULI"
};

let destinatarios = {};
let direcciones = {};
let tipoActual = "glpi";

const contactoEmails = {
  "Ricardo Terriza García":      "ricardo.terriza.garcia@kyndryl.com",
  "Eduardo Balaguer Hernández":  "eduardo.balaguer1@kyndryl.com",
  "Antonio Sánchez Tenorio":     "antonio.sancheztenorio@kyndryl.com",
  "Jordi Martínez Almarcha":     "jordi.martinez.almarcha@kyndryl.com",
  "Javier Rodríguez Rodríguez":  "javi.rodriguez1@kyndryl.com",
  "Kevin Bosch Cazalla":         "kevin.bosch.cazalla@kyndryl.com"
};

async function cargarDestinatarios() {
  const res = await fetch("data/destinatarios.json");
  destinatarios = await res.json();
}

async function cargarDirecciones() {
  const res = await fetch("data/direcciones.json");
  direcciones = await res.json();
}

// =============================
// FORMATEAR FECHA (PROGRAMADO)
// =============================

function formatearFecha(fechaISO, hora, min) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio} a las ${hora}:${min}`;
}

// =============================
// GENERAR EMAIL GLPI/REMEDY
// =============================

function generarEmailGLPI(tipo, valores) {
  const { sede, caso, descripcion } = valores;
  const tipoTexto = tipo.toUpperCase();
  const sedeCorta = sedeAbrev[sede] || sede;
  const asunto = `FINALIZADO ${tipoTexto} (${sedeCorta}) ${caso} - ${descripcion}`;
  const html = generarGLPIHTML(valores, tipoTexto);
  const dest = destinatarios[tipo] || { para: [], cc: [] };
  return { asunto, html, para: dest.para, cc: dest.cc };
}

// =============================
// GENERAR EMAIL PROGRAMADO
// =============================

function generarEmailProgramado() {
  const herramienta = document.getElementById("p_herramienta").value;
  const sede        = document.getElementById("p_sede").value;
  const num_cambio  = document.getElementById("p_num_cambio").value;
  const descripcion = document.getElementById("p_descripcion").value;
  const fecha_inicio= document.getElementById("p_fecha_inicio").value;
  const hora_inicio = document.getElementById("p_hora_inicio").value;
  const min_inicio  = document.getElementById("p_min_inicio").value;
  const fecha_fin   = document.getElementById("p_fecha_fin").value;
  const hora_fin    = document.getElementById("p_hora_fin").value;
  const min_fin     = document.getElementById("p_min_fin").value;
  const remedy      = document.getElementById("p_remedy").value;
  const caso_soporte= document.getElementById("p_caso_soporte").value;
  const info        = document.getElementById("p_info").value;
  const ap          = document.getElementById("p_ap").value;
  const downtime    = document.getElementById("p_downtime").value;

  const obligatorios = [herramienta, sede, num_cambio, descripcion,
    fecha_inicio, fecha_fin, remedy, caso_soporte];

  if (obligatorios.some(v => !v)) {
    alert("Completa todos los campos obligatorios antes de generar el email.");
    return null;
  }

  const dtInicio = new Date(`${fecha_inicio}T${hora_inicio}:${min_inicio}`);
  const dtFin    = new Date(`${fecha_fin}T${hora_fin}:${min_fin}`);
  if (dtFin < dtInicio) {
    alert("La fecha de fin no puede ser anterior a la fecha de inicio.");
    return null;
  }

  const inicio = formatearFecha(fecha_inicio, hora_inicio, min_inicio);
  const fin    = formatearFecha(fecha_fin, hora_fin, min_fin);
  const sedeCorta = sedeAbrev[sede] || sede;

  const asunto = `**PROGRAMADO ${inicio}** ${herramienta} (${sedeCorta}) ${num_cambio} - ${descripcion}`;

  const html = generarPROGRAMADOHTML({
    herramienta, num_cambio, descripcion, inicio, fin,
    remedy, caso_soporte, info, ap, downtime, sede
  });

  const dest = destinatarios["programado"] || { para: [], cc: [] };
  return { asunto, html, para: dest.para, cc: dest.cc };
}

// =============================
// GENERAR EMAIL VENTANA FT
// =============================

function generarEmailVentana() {
  const numero_cambio     = document.getElementById("v_numero_cambio").value.trim();
  const incidencia_remedy = document.getElementById("v_incidencia_remedy").value.trim();
  const hostname          = document.getElementById("v_hostname").value.trim();
  const serial            = document.getElementById("v_serial").value.trim();
  const ubicacion         = document.getElementById("v_ubicacion").value.trim();
  const tarea             = document.getElementById("v_tarea").value.trim();
  const grupos            = document.getElementById("v_grupos").value.trim();
  const cambio            = document.getElementById("v_cambio").value;
  const tiempo            = document.getElementById("v_tiempo").value;

  const obligatorios = [numero_cambio, incidencia_remedy, hostname, serial,
    ubicacion, tarea, grupos, cambio, tiempo];

  if (obligatorios.some(v => !v)) {
    alert("Completa todos los campos antes de generar el email.");
    return null;
  }

  const asunto = `**Solicitud de ventana** ${numero_cambio} - ${hostname} - ${tarea} - ${incidencia_remedy}`;

  const html = generarVENTANAHTML({
    numero_cambio, incidencia_remedy, hostname, serial,
    ubicacion, tarea, grupos, cambio, tiempo
  });

  const dest = destinatarios["ventana"] || { para: [], cc: [] };
  return { asunto, html, para: dest.para, cc: dest.cc };
}

// =============================
// GENERAR EMAIL ECONOCOM
// =============================

function generarEmailEconocom() {
  const caso_opit   = document.getElementById("e_caso_opit").value.trim();
  const titulo_opit = document.getElementById("e_titulo_opit").value.trim();
  const cliente     = document.getElementById("e_cliente").value;
  const sede        = document.getElementById("e_sede").value;
  const direccion   = document.getElementById("e_direccion").value.trim();
  const marca_modelo= document.getElementById("e_marca_modelo").value.trim();
  const serial      = document.getElementById("e_serial").value.trim();
  const ubicacion   = document.getElementById("e_ubicacion").value.trim();
  const contacto    = document.getElementById("e_contacto").value;
  const email       = document.getElementById("e_email").value.trim();
  const telefono    = document.getElementById("e_telefono").value.trim();
  const operativa   = document.getElementById("e_operativa").value;
  const incidencia  = document.getElementById("e_incidencia").value.trim();

  const obligatorios = [caso_opit, titulo_opit, cliente, sede, direccion,
    marca_modelo, serial, ubicacion, contacto, email, telefono, operativa, incidencia];

  if (obligatorios.some(v => !v)) {
    alert("Completa todos los campos antes de generar el email.");
    return null;
  }

  const asunto = `Caso OPIT ${caso_opit} - ${titulo_opit}`;

  const html = generarECONOCOMHTML({
    caso_opit, titulo_opit, cliente, sede, direccion,
    marca_modelo, serial, ubicacion, contacto, email,
    telefono, operativa, incidencia
  });

  const dest = destinatarios["econocom"] || { para: [], cc: [] };
  return { asunto, html, para: dest.para, cc: dest.cc };
}

// =============================
// CAMBIAR FORMULARIO
// =============================

function mostrarFormulario(tipo) {
  const esGLPI = (tipo === "glpi" || tipo === "remedy");
  document.getElementById("campos-glpi").style.display = esGLPI ? "grid" : "none";
  document.getElementById("campos-programado").style.display = tipo === "programado" ? "grid" : "none";
  document.getElementById("campos-ventana").style.display = tipo === "ventana" ? "grid" : "none";
  document.getElementById("campos-econocom").style.display = tipo === "econocom" ? "grid" : "none";

  const titulos = {
    glpi:       "FINALIZADO GLPI",
    remedy:     "FINALIZADO REMEDY",
    programado: "PROGRAMADO",
    ventana:    "SOLICITUD VENTANA FT",
    econocom:   "CASO ECONOCOM"
  };
  document.getElementById("tituloFormulario").textContent = titulos[tipo] || tipo.toUpperCase();

  if (tipo === "programado") {
    const hoy = new Date().toISOString().split("T")[0];
    document.getElementById("p_fecha_inicio").setAttribute("min", hoy);
    document.getElementById("p_fecha_fin").setAttribute("min", hoy);
  }
}

// =============================
// HISTORIAL
// =============================

function renderHistorial() {
  const lista = document.getElementById("historialLista");
  const historial = JSON.parse(localStorage.getItem("historial_webversa")) || [];
  lista.innerHTML = "";

  historial.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="hist-tipo">${item.tipo.toUpperCase()}</span>
      <span class="hist-asunto">${item.asunto}</span>
    `;
    li.addEventListener("click", () => {
      tipoActual = item.tipo;
      document.querySelectorAll(".sidebar button[data-tipo]").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-tipo") === item.tipo);
      });
      mostrarFormulario(item.tipo);
      document.getElementById("editor").innerHTML = item.html;
      document.getElementById("asunto").value = item.asunto;
      document.getElementById("para").value = item.para;
    });
    lista.appendChild(li);
  });

  if (historial.length > 0) {
    const btnLimpiar = document.createElement("span");
    btnLimpiar.textContent = "Limpiar historial";
    btnLimpiar.style.cssText = "display:block; margin-top:10px; font-size:11px; color:#666; cursor:pointer; text-align:left;";
    btnLimpiar.addEventListener("mouseenter", () => btnLimpiar.style.color = "#ff7a00");
    btnLimpiar.addEventListener("mouseleave", () => btnLimpiar.style.color = "#666");
    btnLimpiar.addEventListener("click", () => {
      localStorage.removeItem("historial_webversa");
      renderHistorial();
      document.querySelector(".sidebar button.active").focus();
    });
    lista.appendChild(btnLimpiar);
  }
}

function guardarHistorial(tipo, asunto, html, para) {
  let historial = JSON.parse(localStorage.getItem("historial_webversa")) || [];
  historial.unshift({ tipo, asunto, html, para });
  historial = historial.slice(0, 5);
  localStorage.setItem("historial_webversa", JSON.stringify(historial));
  renderHistorial();
}

// =============================
// INIT
// =============================

document.addEventListener("DOMContentLoaded", async () => {
  await cargarDestinatarios();
  await cargarDirecciones();

  // Desactivar autocompletado
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.setAttribute("autocomplete", "off");
  });

  renderHistorial();

  const editor = document.querySelector("#editor");

  // Ajustar fecha fin mínima en PROGRAMADO
  document.getElementById("p_fecha_inicio").addEventListener("change", () => {
    const val = document.getElementById("p_fecha_inicio").value;
    document.getElementById("p_fecha_fin").setAttribute("min", val);
  });

  // Autocompletar dirección al cambiar sede en ECONOCOM
  document.getElementById("e_sede").addEventListener("change", () => {
    const sede = document.getElementById("e_sede").value;
    document.getElementById("e_direccion").value = direcciones[sede] || "";
  });

  // Autocompletar email al cambiar contacto en ECONOCOM
  document.getElementById("e_contacto").addEventListener("change", () => {
    const contacto = document.getElementById("e_contacto").value;
    document.getElementById("e_email").value = contactoEmails[contacto] || "";
  });

  // =============================
  // SIDEBAR
  // =============================
  document.querySelectorAll(".sidebar button[data-tipo]").forEach(btn => {
    btn.addEventListener("click", () => {
      const tipo = btn.getAttribute("data-tipo");
      if (!tipo) return;
      document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      tipoActual = tipo;
      mostrarFormulario(tipo);
    });
  });

  // =============================
  // GENERAR EMAIL
  // =============================
  document.querySelector(".main-btn").addEventListener("click", () => {
    let email;

    if (tipoActual === "programado") {
      email = generarEmailProgramado();
      if (!email) return;
    } else if (tipoActual === "ventana") {
      email = generarEmailVentana();
      if (!email) return;
    } else if (tipoActual === "econocom") {
      email = generarEmailEconocom();
      if (!email) return;
    } else {
      const valores = {
        caso:         document.getElementById("caso").value,
        inicio:       document.getElementById("inicio").value,
        fin:          document.getElementById("fin").value,
        sede:         document.getElementById("sede").value,
        descripcion:  document.getElementById("titulo").value,
        caso_hw:      document.getElementById("caso_hw").value,
        ubicacion:    document.getElementById("ubicacion").value,
        peticionario: document.getElementById("peticionario").value,
        trabajos:     document.getElementById("trabajos").value
      };

      const obligatorios = [valores.caso, valores.inicio, valores.fin,
        valores.sede, valores.descripcion, valores.caso_hw, valores.ubicacion,
        valores.peticionario, valores.trabajos];

      if (obligatorios.some(v => !v)) {
        alert("Completa todos los campos antes de generar el email.");
        return;
      }

      email = generarEmailGLPI(tipoActual, valores);
    }

    editor.innerHTML = email.html;
    document.getElementById("asunto").value = email.asunto;

    if (tipoActual === "ventana") {
      document.getElementById("para").value = email.cc.join("; ");
    } else {
      document.getElementById("para").value = email.para.join("; ");
    }

    guardarHistorial(tipoActual, email.asunto, email.html, document.getElementById("para").value);
  });

  // =============================
  // ABRIR OUTLOOK
  // =============================
  document.getElementById("abrirMail").addEventListener("click", () => {
    const paraRaw = document.getElementById("para").value;
    const asunto = document.getElementById("asunto").value;
    const destinatarios = paraRaw.split(";").map(e => e.trim()).filter(Boolean).join(",");

    const cuerpo = editor.innerText || editor.textContent || "";
    navigator.clipboard.writeText(cuerpo).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = cuerpo;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });

    if (tipoActual === "ventana") {
      window.location.href = `mailto:?cc=${destinatarios}&subject=${encodeURIComponent(asunto)}`;
    } else if (tipoActual === "programado") {
      window.location.href = `mailto:${destinatarios}?subject=${encodeURIComponent(asunto)}&importance=high`;
    } else {
      window.location.href = `mailto:${destinatarios}?subject=${encodeURIComponent(asunto)}`;
    }
  });

  // =============================
  // LIMPIAR
  // =============================
  document.getElementById("limpiar").addEventListener("click", () => {
    document.querySelectorAll("input[type=text], textarea").forEach(el => el.value = "");
    document.querySelectorAll("input[type=date]").forEach(el => el.value = "");
    document.querySelectorAll("select").forEach(el => el.selectedIndex = 0);
    document.getElementById("editor").innerHTML = "";
    document.getElementById("asunto").value = "";
    document.getElementById("para").value = "";
    if (tipoActual === "econocom") {
      document.getElementById("e_telefono").value = "+34 618 34 67 88";
    }
  });

  // =============================
  // COPIAR CAMPOS
  // =============================
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;
      const el = document.getElementById(targetId);

      if (targetId === "editor") {
        const html = el.innerHTML;
        navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([el.innerText], { type: "text/plain" })
          })
        ]).catch(() => {
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(el);
          sel.removeAllRanges();
          sel.addRange(range);
          document.execCommand("copy");
          sel.removeAllRanges();
        });
      } else {
        navigator.clipboard.writeText(el.value || "");
      }

      const original = btn.textContent;
      btn.textContent = "✔";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1200);
    });
  });

});