// =============================
// UTILS COMPARTIDOS — WEBVERSA
// =============================

const get = (id) => document.getElementById(id)

// =============================
// CARGAR SEDES DESDE JSON
// =============================

async function cargarSedes(selectId) {
  try {
    const res = await fetch("../data/sedes.json")
    const data = await res.json()
    const select = get(selectId)

    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Seleccionar"
    select.appendChild(defaultOption)

    data.sedes.forEach(sede => {
      const option = document.createElement("option")
      option.value = sede.nombre
      option.dataset.abrev = sede.abrev
      option.textContent = sede.nombre
      select.appendChild(option)
    })

    select.value = ""
  } catch (err) {
    console.error("Error cargando sedes:", err)
  }
}

// =============================
// OBTENER ABREVIATURA DE SEDE
// =============================

function getAbrevSede(selectId) {
  const select = get(selectId)
  const option = select.options[select.selectedIndex]
  return option?.dataset?.abrev || select.value
}

// =============================
// CARGAR DESTINATARIOS DESDE JSON
// =============================

async function cargarDestinatarios(grupo) {
  const res = await fetch("../data/destinatarios.json")
  const data = await res.json()
  return data[grupo] || { para: [], cc: [] }
}

// =============================
// RECOGER VALORES DE CAMPOS
// =============================

function recogerValores(campos) {
  const valores = {}
  campos.forEach(id => {
    const el = get(id)
    valores[id] = el ? (el.value || "").trim() : ""
  })
  return valores
}

// =============================
// LIMPIAR CAMPOS
// =============================

function limpiarCampos(campos) {
  campos.forEach(id => {
    const el = get(id)
    if (!el) return
    if (el.tagName === "SELECT") el.selectedIndex = 0
    else el.value = ""
  })
}

// =============================
// ABRIR OUTLOOK (mailto + clipboard)
// =============================

function abrirOutlook(para, cc, asunto, cuerpoHTML) {
  // Copiar cuerpo al portapapeles
  const cuerpoTexto = cuerpoHTML.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()

  navigator.clipboard.writeText(cuerpoTexto).catch(() => {
    const ta = document.createElement("textarea")
    ta.value = cuerpoTexto
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    document.body.removeChild(ta)
  })

  const paraStr = para.join(",")
  const ccStr = cc.length ? `&cc=${encodeURIComponent(cc.join(","))}` : ""
  const mailto = `mailto:${paraStr}?subject=${encodeURIComponent(asunto)}${ccStr}`

  window.location.href = mailto
}

// =============================
// COPIAR HTML AL PORTAPAPELES (formato rico)
// =============================

async function copiarBodyHTML(html) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([html.replace(/<[^>]+>/g, "")], { type: "text/plain" })
      })
    ])
  } catch {
    // fallback texto plano
    const ta = document.createElement("textarea")
    ta.value = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    document.body.removeChild(ta)
  }
}
