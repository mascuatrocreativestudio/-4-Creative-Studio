/**
 * Contenido de /preguntas-frecuentes.
 *
 * Igual que services.ts: todo el texto editable vive acá y la página sólo lo
 * maqueta. El orden del array es el orden en pantalla.
 *
 * Las respuestas son las que escribió el estudio. Sólo se corrigieron tres
 * cosas de ortografía, marcadas con un comentario donde ocurren, sin tocar el
 * sentido de ninguna.
 */

export type FaqItem = {
  id: string;
  question: string;
  /** Un elemento por párrafo. La mayoría tiene uno solo. */
  answer: string[];
};

export const FAQ_PAGE = {
  eyebrow: "Preguntas frecuentes",
  title: ["Antes de", "escribirnos."],
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "alcance",
    question: "¿Tengo que contratar todos los servicios o puedo empezar por una parte?",
    answer: [
      "Podemos empezar por lo más urgente. Nos reunimos, charlamos y evaluamos lo que necesita tu negocio, y cómo podemos resolverlo.",
    ],
  },
  {
    id: "precio",
    question: "¿Cuánto cuesta?",
    answer: [
      // "necesitas" → "necesitás": el resto del sitio usa voseo con tilde.
      "Depende de lo que necesite tu negocio. En nuestra primera reunión hacemos un diagnóstico, charlamos sobre todo lo que necesitás resolver y armamos una propuesta a medida.",
    ],
  },
  {
    id: "plazos",
    question: "¿En cuánto tiempo veo resultados?",
    answer: [
      "Depende del servicio. Por ejemplo, la pauta suele mostrar señales en las primeras semanas. En cuanto al contenido, marca y recurrencia construyen en meses. No hacemos promesas vacías, vamos a definir juntos los objetivos a alcanzar.",
    ],
  },
  {
    id: "clientes",
    question: "¿Con qué tipo de empresas trabajan?",
    answer: [
      "Trabajamos con marcas, negocios, emprendimientos y pymes que necesiten crear un embudo comercial que les asegure clientes nuevos, ventas y reconocimiento todos los meses.",
    ],
  },
  {
    id: "convivencia",
    question: "Ya trabajo con otra agencia o ya tengo web. ¿Sirve igual?",
    answer: [
      "Sí. Muchas veces el problema no es que “falte algo”, sino que las partes no trabajan en conjunto. Si, por ejemplo, ya tenés quien te genere el contenido y los anuncios, y te falta quien desarrolle tu e-commerce y la estrategia de venta, podemos trabajar en equipo.",
    ],
  },
  {
    id: "medicion",
    question: "¿Cómo miden los resultados?",
    answer: [
      "Medimos según los datos de interés del negocio, por ejemplo, consultas, clientes nuevos, ventas, alcance, facturación, recurrencia… Armamos un reporte mensual con todos los datos del mes, y su traducción, para que entiendas dónde estamos parados y lo que viene en el nuevo mes.",
    ],
  },
  {
    id: "propiedad",
    question: "¿Las cuentas, la web y el contenido quedan a mi nombre?",
    answer: [
      "Sí. Todo lo que generemos para tu negocio es de TU propiedad. No nos quedamos con ningún acceso exclusivo, material o similares.",
    ],
  },
  {
    id: "pago",
    question: "¿Cómo se abona el servicio?",
    answer: [
      // "Podes" → "Podés".
      "Podés abonar por transferencia bancaria en pesos argentinos, transferencia en USD, o en efectivo. Nuestro servicio es mensual.",
    ],
  },
  {
    id: "equipo",
    question: "¿Quiénes son?",
    answer: [
      // Faltaba la conjunción entre el tercer y el cuarto profesional: sin ella
      // "un editor de videos consultora de negocios" se leía como una sola
      // persona y el equipo quedaba en tres, no en cuatro.
      "Somos 4 profesionales trabajando en equipo, de ahí nuestro nombre. +4. En tu empresa va a estar trabajando una diseñadora gráfica especialista en redes y conversión, un desarrollador web tanto para landings como para e-commerces, un editor de videos y una consultora de negocios que traduce lo que necesitás en acciones concretas.",
      "Cuatro miradas sobre tu negocio, un mismo objetivo estratégico.",
    ],
  },
  {
    id: "empezar",
    question: "¿Cómo empezamos?",
    answer: [
      "Nos escribís por WhatsApp, agendamos una charla de diagnóstico y te armamos una propuesta.",
    ],
  },
];

export const FAQ_CTA = {
  title: "¿Empezamos?",
};
