// Menú de navegación en celular.
const botonMenu = document.querySelector(".boton-menu");
const navegacion = document.querySelector(".navegacion-principal");

botonMenu.addEventListener("click", () => {
  const abierto = navegacion.classList.toggle("abierto");
  botonMenu.setAttribute("aria-expanded", String(abierto));
  botonMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});

navegacion.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    navegacion.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
  });
});

// Las confirmaciones son parte de una demostración: no se envían datos.
const formularioReserva = document.querySelector("#formulario-reserva");
if (formularioReserva) {
  const campoFecha = document.querySelector("#fecha");
  const campoHorario = document.querySelector("#horario");
  const calendario = document.querySelector("#calendario-reserva");
  const tituloMes = document.querySelector("#mes-calendario");
  const diasCalendario = document.querySelector("#dias-calendario");
  const botonAnterior = document.querySelector("#mes-anterior");
  const botonSiguiente = document.querySelector("#mes-siguiente");
  const errorFecha = document.querySelector("#error-fecha");
  const hoy = new Date();
  let mesVisible = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  function diaDeHoy() {
    const fecha = new Date();
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  }

  function fechaDisponible(fecha) {
    const dia = fecha.getDay();
    return fecha >= diaDeHoy() && (dia === 4 || dia === 5 || dia === 6);
  }

  function cerrarCalendario() {
    calendario.hidden = true;
    campoFecha.setAttribute("aria-expanded", "false");
  }

  function dibujarCalendario() {
    const anio = mesVisible.getFullYear();
    const mes = mesVisible.getMonth();
    tituloMes.textContent = new Intl.DateTimeFormat("es-AR", {
      month: "long", year: "numeric"
    }).format(mesVisible);
    botonAnterior.disabled = mesVisible <= new Date(diaDeHoy().getFullYear(), diaDeHoy().getMonth(), 1);
    diasCalendario.replaceChildren();

    // La grilla comienza en lunes; getDay() comienza en domingo.
    const espacios = (new Date(anio, mes, 1).getDay() + 6) % 7;
    for (let i = 0; i < espacios; i++) {
      const espacio = document.createElement("span");
      espacio.setAttribute("aria-hidden", "true");
      diasCalendario.append(espacio);
    }

    const cantidadDias = new Date(anio, mes + 1, 0).getDate();
    for (let dia = 1; dia <= cantidadDias; dia++) {
      const fecha = new Date(anio, mes, dia);
      const boton = document.createElement("button");
      boton.type = "button";
      boton.textContent = String(dia);
      boton.disabled = !fechaDisponible(fecha);
      boton.setAttribute("aria-label", new Intl.DateTimeFormat("es-AR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      }).format(fecha));

      const iso = [anio, String(mes + 1).padStart(2, "0"), String(dia).padStart(2, "0")].join("-");
      if (campoFecha.dataset.fecha === iso) boton.setAttribute("aria-pressed", "true");
      boton.addEventListener("click", () => {
        campoFecha.dataset.fecha = iso;
        campoFecha.value = [String(dia).padStart(2, "0"), String(mes + 1).padStart(2, "0"), anio].join("/");
        campoFecha.removeAttribute("aria-invalid");
        errorFecha.hidden = true;
        cerrarCalendario();
        campoHorario.focus();
      });
      diasCalendario.append(boton);
    }
  }

  function abrirCalendario() {
    if (!calendario.hidden) return;
    dibujarCalendario();
    calendario.hidden = false;
    campoFecha.setAttribute("aria-expanded", "true");
    diasCalendario.querySelector("button:not(:disabled)")?.focus();
  }

  campoFecha.addEventListener("click", () => {
    if (calendario.hidden) abrirCalendario();
    else cerrarCalendario();
  });
  campoFecha.addEventListener("keydown", (evento) => {
    if (["Enter", " ", "ArrowDown"].includes(evento.key)) {
      evento.preventDefault();
      abrirCalendario();
    }
  });
  botonAnterior.addEventListener("click", () => {
    mesVisible.setMonth(mesVisible.getMonth() - 1);
    dibujarCalendario();
  });
  botonSiguiente.addEventListener("click", () => {
    mesVisible.setMonth(mesVisible.getMonth() + 1);
    dibujarCalendario();
  });
  document.addEventListener("click", (evento) => {
    if (!evento.target.closest(".selector-fecha")) cerrarCalendario();
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !calendario.hidden) {
      cerrarCalendario();
      campoFecha.focus();
    }
  });

  formularioReserva.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const partes = (campoFecha.dataset.fecha || "").split("-").map(Number);
    const fechaElegida = partes.length === 3 ? new Date(partes[0], partes[1] - 1, partes[2]) : null;
    if (!fechaElegida || !fechaDisponible(fechaElegida)) {
      errorFecha.textContent = "Elegí un jueves, viernes o sábado en el calendario.";
      errorFecha.hidden = false;
      campoFecha.setAttribute("aria-invalid", "true");
      campoFecha.focus();
      return;
    }
    if (!["20:00", "22:30"].includes(campoHorario.value)) {
      campoHorario.setCustomValidity("Elegí uno de los dos horarios disponibles.");
      campoHorario.reportValidity();
      return;
    }
    window.location.href = "confirmacion-reserva.html";
  });
  campoHorario.addEventListener("change", () => campoHorario.setCustomValidity(""));
}

const formularioGiftcard = document.querySelector("#formulario-giftcard");
if (formularioGiftcard) {
  const paraMi = document.querySelector("#destino-propio");
  const paraOtraPersona = document.querySelector("#destino-otra");
  const etiquetaCorreo = document.querySelector("#etiqueta-correo");
  const etiquetaNombre = document.querySelector("#etiqueta-nombre");

  function actualizarDestinatario() {
    etiquetaCorreo.textContent = paraMi.checked ? "Tu correo electrónico:" : "Correo electrónico del destinatario:";
    etiquetaNombre.textContent = paraMi.checked ? "Tu nombre:" : "Nombre del destinatario:";
  }

  paraMi.addEventListener("change", actualizarDestinatario);
  paraOtraPersona.addEventListener("change", actualizarDestinatario);

  formularioGiftcard.addEventListener("submit", (evento) => {
    evento.preventDefault();
    window.location.href = "confirmacion-compra.html";
  });
}
