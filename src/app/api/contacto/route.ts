import { NextResponse } from "next/server";

/**
 * Recepción de los datos del formulario del final de la home.
 *
 * DÓNDE VAN LOS DATOS
 *
 * Este handler no guarda nada: reenvía el lead a la URL que esté en la variable
 * de entorno LEAD_WEBHOOK_URL. Sirve cualquier servicio que reciba un POST con
 * JSON — Formspree, Zapier, Make, n8n, un Apps Script de Google — así que no
 * hay dependencia nueva, ni proveedor atado, ni una sola clave escrita en el
 * código.
 *
 * Mientras esa variable no exista, responde 503 con el motivo. El formulario lo
 * entiende y ofrece mandar los mismos datos por WhatsApp, así el contacto nunca
 * se pierde en silencio: es preferible un camino manual visible a un formulario
 * que parece funcionar y tira los mensajes a la basura.
 *
 * Para activarlo: en Vercel → Settings → Environment Variables, agregar
 * LEAD_WEBHOOK_URL con la URL del servicio elegido, y volver a desplegar.
 */

/** Ninguna de estas respuestas se puede cachear: cada envío es distinto. */
export const dynamic = "force-dynamic";

type Lead = {
  nombre: string;
  email: string;
  telefono: string;
};

const LIMITES = { nombre: 120, email: 160, telefono: 40 } as const;

/** Validación mínima, la misma que hace el formulario pero del lado del servidor:
 *  el cliente se puede saltear, este no. */
function validar(datos: Partial<Lead>): string | null {
  const nombre = datos.nombre?.trim() ?? "";
  const email = datos.email?.trim() ?? "";
  const telefono = datos.telefono?.trim() ?? "";

  if (nombre.length < 2) return "Falta el nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "El email no parece válido.";
  if (telefono.replace(/\D/g, "").length < 6) return "El teléfono no parece válido.";

  if (
    nombre.length > LIMITES.nombre ||
    email.length > LIMITES.email ||
    telefono.length > LIMITES.telefono
  ) {
    return "Alguno de los datos es demasiado largo.";
  }

  return null;
}

export async function POST(request: Request) {
  let cuerpo: Partial<Lead> & { web?: string };

  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  /* Trampa para bots: es un campo oculto que una persona nunca completa. Si
     viene lleno, respondemos 200 sin reenviar nada — un error le diría al bot
     que lo detectamos y que pruebe de otra forma. */
  if (cuerpo.web) return NextResponse.json({ ok: true });

  const error = validar(cuerpo);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const destino = process.env.LEAD_WEBHOOK_URL;
  if (!destino) {
    return NextResponse.json(
      { error: "sin-destino", detalle: "Falta configurar LEAD_WEBHOOK_URL." },
      { status: 503 },
    );
  }

  const lead = {
    nombre: cuerpo.nombre!.trim(),
    email: cuerpo.email!.trim(),
    telefono: cuerpo.telefono!.trim(),
    origen: "web +4 — formulario del cierre",
    fecha: new Date().toISOString(),
  };

  try {
    const respuesta = await fetch(destino, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(lead),
    });

    if (!respuesta.ok) {
      return NextResponse.json({ error: "envio-fallido" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "envio-fallido" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
