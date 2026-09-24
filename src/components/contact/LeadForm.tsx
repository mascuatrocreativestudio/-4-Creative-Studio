"use client";

import { useState, type FormEvent } from "react";
import { WHATSAPP_NUMBER } from "@/lib/site";
import styles from "./LeadForm.module.css";

/**
 * Dejá tus datos — cierre de la home.
 *
 * Para quien no quiere abrir una conversación todavía: deja nombre, mail y
 * teléfono, y el estudio lo contacta.
 *
 * Los datos van a /api/contacto, que los reenvía al servicio configurado en
 * LEAD_WEBHOOK_URL. Si esa variable todavía no existe —o el envío falla— el
 * formulario no se come el contacto: muestra un botón de WhatsApp con los
 * mismos datos ya escritos en el mensaje. Preferimos un camino manual visible
 * antes que un formulario que aparenta funcionar y pierde mensajes.
 *
 * Único componente cliente del cierre. El resto de la sección sigue siendo
 * server component.
 */

type Estado = "listo" | "enviando" | "enviado" | "fallback";

const CAMPOS = [
  { id: "nombre", label: "Nombre", type: "text", autoComplete: "name", inputMode: undefined },
  { id: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
  { id: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel", inputMode: "tel" },
] as const;

export default function LeadForm() {
  const [datos, setDatos] = useState({ nombre: "", email: "", telefono: "" });
  const [web, setWeb] = useState(""); // trampa para bots
  const [estado, setEstado] = useState<Estado>("listo");
  const [error, setError] = useState<string | null>(null);

  const mensajeWhatsApp = `Hola +4, les dejo mis datos.%0A%0ANombre: ${encodeURIComponent(
    datos.nombre,
  )}%0AEmail: ${encodeURIComponent(datos.email)}%0ATeléfono: ${encodeURIComponent(datos.telefono)}`;

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (estado === "enviando") return;

    setEstado("enviando");
    setError(null);

    try {
      const respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, web }),
      });

      if (respuesta.ok) {
        setEstado("enviado");
        return;
      }

      const cuerpo = await respuesta.json().catch(() => ({}));

      /* 400 = los datos están mal: lo arregla la persona, se lo decimos y
         seguimos en el formulario. */
      if (respuesta.status === 400 && cuerpo.error) {
        setEstado("listo");
        setError(cuerpo.error);
        return;
      }

      /* Cualquier otra cosa es culpa nuestra, no suya: ofrecemos WhatsApp con
         los datos ya cargados. */
      setEstado("fallback");
    } catch {
      setEstado("fallback");
    }
  }

  if (estado === "enviado") {
    return (
      <p className={styles.exito} role="status">
        Gracias. Te vamos a estar escribiendo.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      <div className={styles.campos}>
        {CAMPOS.map((campo) => (
          <p key={campo.id} className={styles.campo}>
            <label className={styles.label} htmlFor={`lead-${campo.id}`}>
              {campo.label}
            </label>
            <input
              className={styles.input}
              id={`lead-${campo.id}`}
              name={campo.id}
              type={campo.type}
              inputMode={campo.inputMode}
              autoComplete={campo.autoComplete}
              required
              value={datos[campo.id]}
              onChange={(event) =>
                setDatos((previo) => ({ ...previo, [campo.id]: event.target.value }))
              }
            />
          </p>
        ))}
      </div>

      {/* Invisible para una persona, irresistible para un bot. */}
      <input
        className={styles.trampa}
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={web}
        onChange={(event) => setWeb(event.target.value)}
      />

      <div className={styles.pie}>
        <button className={styles.boton} type="submit" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : "Dejar mis datos"}
          <i className={styles.flecha} aria-hidden="true">
            →
          </i>
        </button>

        <p className={styles.nota}>Te escribimos nosotros. No compartimos tus datos.</p>
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {estado === "fallback" ? (
        <p className={styles.error} role="alert">
          No pudimos enviarlo desde acá.{" "}
          <a
            className={styles.errorLink}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Mandanos tus datos por WhatsApp
          </a>{" "}
          — ya van escritos en el mensaje.
        </p>
      ) : null}
    </form>
  );
}
