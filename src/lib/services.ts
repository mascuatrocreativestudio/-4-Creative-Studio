/**
 * Contenido de la página /servicios.
 *
 * Todo el texto editable vive acá, igual que el contacto vive en site.ts: la
 * página sólo lo maqueta. Si hay que cambiar una palabra, se cambia en este
 * archivo y no hay que tocar JSX.
 *
 * Las CUATRO disciplinas no se redefinen acá: se leen de EQUATION_TERMS
 * (src/lib/scene.ts), que es la misma fuente que dibuja la ecuación de MEZCLA
 * en la home. Así la página y la escena no pueden contradecirse — si mañana se
 * agrega un ítem a "Contenido", aparece en los dos lados solo.
 *
 * Acá abajo se agrega únicamente lo que la escena no tiene: una descripción por
 * disciplina.
 */

export const SERVICES_PAGE = {
  eyebrow: "Servicios",
  title: ["Cuatro disciplinas.", "Un solo sistema."],
  lead: "No vendemos piezas sueltas. Cada disciplina existe para que la siguiente funcione: la estrategia define qué decir, la identidad cómo se ve, el contenido lo sostiene en el tiempo y el crecimiento lo convierte en demanda.",
};

/**
 * Descripción de cada disciplina, por id de EQUATION_TERMS.
 *
 * Describen QUÉ incluye cada una, no resultados prometidos: los resultados van
 * en los casos, con nombre y números reales.
 */
export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  estrategia:
    "Antes de producir, entender. Definimos a quién le vendés, qué te diferencia y por dónde va a entrar la demanda. De acá sale el plan que ordena todo lo demás.",
  identidad:
    "Cómo se ve y cómo suena tu marca, igual en todos lados. Construimos el sistema visual y lo bajamos a piezas reales, no a un manual que queda guardado en una carpeta.",
  contenido:
    "Lo que tu marca publica, sostenido en el tiempo. Producción propia, redes y colaboraciones, con un calendario que responde al plan y no a la urgencia de la semana.",
  crecimiento:
    "Poner el sistema a trabajar: pauta, mailing, web y ajustes según lo que muestran los datos. Es donde todo lo anterior se convierte en consultas.",
};

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

/**
 * Cómo se arranca un proyecto.
 *
 * ⚠️ Este bloque describe el proceso comercial del estudio. Reemplazar por el
 * proceso real si difiere: es lo que va a leer alguien decidiendo si escribir.
 */
export const PROCESS: ProcessStep[] = [
  {
    index: "01",
    title: "Conversación",
    body: "Nos contás dónde está tu negocio hoy y qué lo está frenando. Sin costo y sin compromiso.",
  },
  {
    index: "02",
    title: "Propuesta",
    body: "Te devolvemos un plan con alcance, prioridades y tiempos. Qué se hace primero y por qué.",
  },
  {
    index: "03",
    title: "En marcha",
    body: "Arrancamos por lo que mueve la aguja antes, y ajustamos con lo que muestran los datos.",
  },
];

export const SERVICES_CTA = {
  title: ["¿Por dónde", "empezamos?"],
  body: "Contanos qué está pasando con tu marca y te decimos si podemos ayudarte.",
};
