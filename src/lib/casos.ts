/**
 * CASOS DE ÉXITO.
 *
 * El contenido de los dos casos, tal como lo pasó el estudio. Lo renderiza un
 * único molde (components/casos/CasoDoc), así que agregar un tercer caso es
 * agregar un objeto a CASOS y nada más: la ruta y la metadata salen solas.
 *
 * ⚠️ TODOS LOS NÚMEROS SON DE LOS DOCUMENTOS ORIGINALES. No se redondeó, no se
 * estimó y no se infirió ninguno. Si un dato cambia, se corrige acá.
 *
 * Sobre el texto: se corrigió ortografía y concordancia —meses en minúscula,
 * algunas frases que quedaban truncas— sin tocar un solo dato ni el tono. Las
 * correcciones están listadas en el commit que trajo este archivo.
 */

/** Un número de la tabla de resultados. El valor va grande; la etiqueta explica. */
export type Metrica = {
  valor: string;
  etiqueta: string;
  /** Contraste contra el punto de partida, cuando existe. Es lo que convierte
      un número en un resultado: "24" no dice nada, "antes, 6 por mes" sí. */
  antes?: string;
};

/** Un ítem con título propio: los pasos del trabajo y las razones del cierre. */
export type Punto = { titulo: string; texto: string };

export type Bloque =
  | { tipo: "p"; texto: string }
  /** Numerados: son una secuencia y el orden es parte del argumento. */
  | { tipo: "pasos"; items: Punto[] }
  /** Sin numerar: son razones independientes entre sí. */
  | { tipo: "puntos"; items: Punto[] };

export type SeccionCaso = {
  id: string;
  titulo: string;
  bloques: Bloque[];
};

export type Caso = {
  /** Ruta: /casos/<slug>. */
  slug: string;
  cliente: string;
  rubro: string;
  /** Una línea por renglón del titular. */
  titular: string[];
  /** El mes al que corresponden los números de la tabla. */
  periodo: string;
  /** Bajada: el caso entero en tres o cuatro oraciones. */
  resumen: string;
  /** meta description. */
  descripcion: string;
  metricas: Metrica[];
  secciones: SeccionCaso[];
  /** El cierre: la pregunta que le hace al lector y la invitación. */
  pregunta: string;
  invitacion: string;
};

/* --------------------------------------------------------------------------
   01 — DISTRIBUIDORA MITRE
   -------------------------------------------------------------------------- */

export const MITRE: Caso = {
  slug: "distribuidora-mitre",
  cliente: "Distribuidora Mitre",
  rubro: "Mayorista · más de 2.000 productos",
  titular: ["De cero clientes nuevos", "a 20 por mes"],
  periodo: "Septiembre 2026",
  resumen:
    "Distribuidora Mitre es un mayorista con más de 2.000 productos. Tenía 50 clientes fieles, pero casi no sumaba clientes nuevos. En septiembre de 2026, su segundo mes trabajando con nosotros, sumó 20 clientes nuevos de 12 provincias distintas.",
  descripcion:
    "Cómo Distribuidora Mitre pasó de casi no sumar clientes nuevos a conseguir 20 por mes de 12 provincias, con una tienda online mayorista y campañas medidas. Caso de +4 Creative Studio.",
  metricas: [
    { valor: "20", etiqueta: "Clientes nuevos en el mes" },
    { valor: "$6.144.201", etiqueta: "Compras de esos clientes nuevos" },
    { valor: "$347.428", etiqueta: "Inversión en publicidad" },
    { valor: "$17.371", etiqueta: "Costo de conseguir cada cliente nuevo", antes: "meta: hasta $50.000" },
    { valor: "12", etiqueta: "Provincias alcanzadas" },
  ],
  secciones: [
    {
      id: "punto-de-partida",
      titulo: "Un buen negocio que sólo crecía por contactos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Vendían bien a quienes ya los conocían: tienen una trayectoria de veinte años en el mercado. El problema era que no llegaban a los que no. Un comerciante del interior no tenía dónde ver los productos ni cómo hacer un pedido si no los conocía de antes o no levantaba el teléfono.",
        },
        {
          tipo: "p",
          texto:
            "La publicidad tampoco ayudaba. En los doce meses anteriores se habían invertido $252.090 con el botón de «promocionar publicación» de Instagram, y no quedó registrada ni una sola venta de esa inversión. Plata gastada sin saber qué volvía.",
        },
      ],
    },
    {
      id: "que-hicimos",
      titulo: "Qué hicimos, en orden",
      bloques: [
        {
          tipo: "pasos",
          items: [
            {
              titulo: "Contenido pensado para el comerciante",
              texto:
                "Mientras construíamos la tienda online mayorista, empezamos a comunicar lo que a sus clientes les importa: qué rota, qué margen deja, cómo reponer. Y mostramos volumen.",
            },
            {
              titulo: "Una tienda online mayorista con más de 2.000 productos",
              texto:
                "Un comerciante de cualquier provincia puede ver precios y hacer su pedido a cualquier hora.",
            },
            {
              titulo: "Anuncios, recién con la tienda lista",
              texto:
                "En agosto lanzamos campañas dirigidas a comerciantes de todo el país. Primero la casa en orden, después la publicidad.",
            },
          ],
        },
      ],
    },
    {
      id: "que-paso",
      titulo: "El doble del objetivo en el segundo mes",
      bloques: [
        {
          tipo: "p",
          texto:
            "Antes de empezar fijamos una meta: diez clientes nuevos por mes, pagando como mucho $50.000 por cada uno. Agosto fue el mes de aprendizaje de las campañas y trajo los primeros 4. En septiembre llegaron 20, y cada uno costó $17.371.",
        },
        {
          tipo: "p",
          texto:
            "Los anuncios llegaron a 431.328 personas en un solo mes: más del doble de lo que habían alcanzado sus redes sociales en todo el año anterior. Los clientes nuevos compraron directo en la tienda online y usaron WhatsApp únicamente para acordar el pago y el envío.",
        },
      ],
    },
    {
      id: "nacional",
      titulo: "De negocio local a negocio nacional",
      bloques: [
        {
          tipo: "p",
          texto:
            "En un mes, Mitre le vendió a clientes nuevos de 12 provincias: Misiones, Córdoba, Santa Fe, La Pampa, Chubut, Río Negro, Santiago del Estero, Chaco, La Rioja, Tierra del Fuego, Buenos Aires y CABA.",
        },
        {
          tipo: "p",
          texto:
            "De los 20 clientes nuevos, 12 son del interior del país y sólo 3 están dentro de su zona de reparto propio. Los otros 17 eran clientes que antes, simplemente, no podían comprarle.",
        },
      ],
    },
    {
      id: "reponen",
      titulo: "Y los clientes vuelven a comprar",
      bloques: [
        {
          tipo: "p",
          texto:
            "Un mayorista no compra una vez: repone. Eso es lo que hace que cada cliente nuevo valga mucho más que su primer pedido.",
        },
        {
          tipo: "p",
          texto:
            "Un comercio de Tierra del Fuego hizo su primer pedido en agosto por $1.500.000. En septiembre volvió y compró $983.703 más. Otros clientes nuevos ya reponen con frecuencia fija, cada 15 y cada 20 días.",
        },
      ],
    },
    {
      id: "dos-meses",
      titulo: "En dos meses",
      bloques: [
        {
          tipo: "p",
          texto:
            "Con $430.639 invertidos en publicidad entre agosto y septiembre, Mitre sumó 24 clientes nuevos que, sólo contando sus primeras compras, dejaron más de $10 millones.",
        },
        {
          tipo: "p",
          texto:
            "No fue una campaña que pegó. Fue ordenar el negocio para que un comerciante de cualquier punto del país lo encuentre, confíe y compre.",
        },
      ],
    },
  ],
  pregunta: "¿Tu negocio vende bien, pero depende de los mismos clientes de siempre?",
  invitacion: "Escribinos y te contamos cómo lo haríamos con el tuyo.",
};

/* --------------------------------------------------------------------------
   02 — EL CAJÓN DE LAS MEDIAS
   -------------------------------------------------------------------------- */

export const CAJON: Caso = {
  slug: "el-cajon-de-las-medias",
  cliente: "El Cajón de las Medias",
  rubro: "Mayorista de medias · sólo tienda online",
  titular: ["De estar por cerrar,", "a su mejor mes"],
  periodo: "Octubre 2026",
  resumen:
    "El Cajón de las Medias es un mayorista de medias que vende por su tienda online y no tiene local a la calle. En agosto de 2026 las ventas venían cayendo y el cierre era una posibilidad real. En octubre, su primer mes completo de campañas con nosotros, vendió más que en cualquier mes desde que tiene registros.",
  descripcion:
    "Cómo El Cajón de las Medias pasó de pensar en cerrar a su mejor mes registrado: 24 clientes nuevos, 4,4 veces las ventas del año anterior y más de la mitad de los pedidos del interior. Caso de +4 Creative Studio.",
  metricas: [
    { valor: "4,4×", etiqueta: "Ventas, contra octubre del año pasado" },
    { valor: "2,3×", etiqueta: "Ventas, contra agosto" },
    { valor: "24", etiqueta: "Clientes nuevos en el mes", antes: "antes, 6 por mes" },
    { valor: "$14.301", etiqueta: "Costo en pauta por cada cliente mayorista nuevo" },
    { valor: "56 %", etiqueta: "Pedidos que llegaron del interior", antes: "en agosto, 32 %" },
  ],
  secciones: [
    {
      id: "punto-de-partida",
      titulo: "Tenían cada vez menos clientes",
      bloques: [
        {
          tipo: "p",
          texto:
            "En la primera mitad de 2025 la tienda sumaba unos 17 clientes nuevos por mes. Un año después, apenas llegaba a 6. Sin clientes nuevos que reemplazaran a los que dejan de comprar, las ventas de 2026 venían un 26 % por debajo del año anterior.",
        },
        {
          tipo: "p",
          texto:
            "Ya hacían publicidad en Meta, pero no les traía resultados: plata que salía todos los meses sin un retorno medido. Por eso el objetivo inicial fue uno solo, frenar la caída. Y para lograrlo había que volver a conseguir clientes nuevos.",
        },
      ],
    },
    {
      id: "que-hicimos",
      titulo: "Qué hicimos, en orden",
      bloques: [
        {
          tipo: "pasos",
          items: [
            {
              titulo: "Un plan con metas medibles",
              texto:
                "Antes de gastar un peso definimos cuánto había que vender, cuántos clientes nuevos sumar y cuánto se podía pagar por cada uno.",
            },
            {
              titulo: "Publicidad desde cero",
              texto:
                "Lo que había no rendía, así que a mediados de septiembre lanzamos dos campañas nuevas, una por etapa: primero atraer visitas de potenciales clientes, después recordarle la tienda a quien ya la había visto.",
            },
            {
              titulo: "Combos pensados para el comerciante",
              texto:
                "En agosto no existían. En octubre ya se vendieron 7, y empujan pedidos más grandes.",
            },
          ],
        },
      ],
    },
    {
      id: "que-paso",
      titulo: "La meta de ventas, cumplida en el primer mes completo",
      bloques: [
        {
          tipo: "p",
          texto:
            "Septiembre fue el mes de arranque: las campañas estuvieron activas sólo dos semanas, pero con definiciones nuevas. Cambiamos la estructura comercial, el mensaje para los clientes, la lógica de productos, la de envío y la presentación general de la web. Las ventas subieron un 35 % respecto de agosto.",
        },
        {
          tipo: "p",
          texto:
            "Octubre fue el primer mes entero con publicidad. Las ventas superaron la meta del plan y le ganaron a mayo de 2025, que hasta entonces era su mejor mes. Entre septiembre y octubre la tienda vendió más del doble que en julio y agosto juntos, que por la estacionalidad del negocio deberían haber sido el pico del año.",
        },
      ],
    },
    {
      id: "no-fue-suerte",
      titulo: "Por qué no fue un mes de suerte",
      bloques: [
        {
          tipo: "puntos",
          items: [
            {
              titulo: "Lo vendieron clientes nuevos",
              texto:
                "De cada $10 vendidos en octubre, $7 vinieron de los 24 clientes que compraron por primera vez. El crecimiento no salió de exprimir a los de siempre.",
            },
            {
              titulo: "El negocio salió de su zona",
              texto:
                "En agosto, 3 de cada 10 pedidos llegaban del interior del país. En octubre, más de la mitad.",
            },
            {
              titulo: "Volvieron clientes que se habían ido",
              texto:
                "Entre septiembre y octubre regresaron 5 comercios que llevaban más de tres meses sin comprar. Uno de ellos volvió después de un año y medio.",
            },
          ],
        },
      ],
    },
    {
      id: "lo-que-sigue",
      titulo: "Lo que sigue",
      bloques: [
        {
          tipo: "p",
          texto:
            "No todo está resuelto, y eso también es parte del plan. El próximo paso es que cada cliente compre más por pedido y vuelva más seguido. Los combos van en esa dirección y ya muestran resultados.",
        },
        {
          tipo: "p",
          texto:
            "En dos meses, El Cajón de las Medias pasó de pensar en cerrar a tener su mejor mes registrado, y además subió un 50 % su ticket promedio. No fue magia: fue ordenar la publicidad, medir cada peso y hablarle al comerciante que todavía no lo conocía.",
        },
      ],
    },
  ],
  pregunta: "¿Tu negocio viene perdiendo clientes y no sabés por dónde empezar?",
  invitacion: "Escribinos y te contamos cómo lo encararíamos con el tuyo.",
};

export const CASOS: Caso[] = [MITRE, CAJON];

export function casoPorSlug(slug: string): Caso | undefined {
  return CASOS.find((caso) => caso.slug === slug);
}
