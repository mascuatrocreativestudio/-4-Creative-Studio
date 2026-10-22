/**
 * TEXTOS LEGALES — Términos y condiciones, Privacidad y Cookies.
 *
 * Los tres documentos viven acá, en una sola estructura, y los renderiza un
 * único componente (components/legal/LegalDoc). Así se corrige una cláusula sin
 * tocar markup, y los tres no pueden desincronizarse entre sí.
 *
 * ⚠️ IMPORTANTE — ESTOS TEXTOS DESCRIBEN LO QUE EL SITIO HACE DE VERDAD.
 *
 * Se escribieron después de auditar el código, no a partir de una plantilla:
 *
 *   · No hay cookies, ni analítica, ni píxeles, ni scripts de terceros. Se
 *     verificó en el código y en las cabeceras de producción (sin Set-Cookie).
 *   · Las tipografías las sirve el propio dominio: next/font/google las
 *     incorpora al compilar, el navegador del visitante no le pide nada a
 *     Google.
 *   · Los únicos datos personales que se recogen son los tres campos del
 *     formulario del cierre (nombre, email, teléfono), que viajan a una planilla
 *     de Google, y los registros técnicos que genera el hosting.
 *
 * Si alguna de esas tres cosas cambia —se agrega analítica, se incrusta un
 * video, se suma un campo al formulario— hay que actualizar estos textos EN EL
 * MISMO COMMIT. Un documento legal que describe algo que ya no pasa es peor que
 * no tenerlo.
 */

import { EMAIL, SITE_NAME } from "./site";

/* --------------------------------------------------------------------------
   IDENTIFICACIÓN DEL RESPONSABLE

   Lo único que falta completar. Los campos en null simplemente no se imprimen,
   así que hoy las páginas identifican al Estudio por su marca y su correo —que
   es verdadero y suficiente para que los documentos funcionen— y se vuelven más
   precisas en el momento en que se carguen los datos registrales.
   -------------------------------------------------------------------------- */

export const TITULAR = {
  /** Nombre comercial. */
  marca: SITE_NAME,

  /** ⚠️ COMPLETAR: razón social o nombre y apellido del titular. */
  razonSocial: null as string | null,

  /** ⚠️ COMPLETAR: CUIT / CUIL del titular. */
  cuit: null as string | null,

  /** ⚠️ COMPLETAR: domicilio legal. Ej.: "Av. Siempre Viva 1234, CABA". */
  domicilio: null as string | null,

  /**
   * ⚠️ COMPLETAR: tribunales competentes.
   * Ej.: "los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires".
   * Mientras esté en null se usa la fórmula general de la República Argentina,
   * que es válida pero menos precisa.
   */
  jurisdiccion: null as string | null,

  email: EMAIL,
} as const;

/** Fecha de última revisión. Actualizar al cambiar cualquiera de los textos. */
export const ACTUALIZADO = "22 de octubre de 2026";

/**
 * Frase de identificación del responsable. Crece sola cuando se completen los
 * datos de TITULAR, sin dejar huecos ni corchetes a la vista.
 */
function responsable(): string {
  const datos = [
    TITULAR.razonSocial,
    TITULAR.cuit && `CUIT ${TITULAR.cuit}`,
    TITULAR.domicilio && `con domicilio en ${TITULAR.domicilio}`,
  ].filter(Boolean);

  if (!datos.length) return `${TITULAR.marca}`;
  return `${TITULAR.marca} (${datos.join(", ")})`;
}

const JURISDICCION =
  TITULAR.jurisdiccion ?? "los tribunales ordinarios competentes de la República Argentina";

/* --------------------------------------------------------------------------
   ESTRUCTURA
   -------------------------------------------------------------------------- */

/**
 * Un bloque de texto.
 *
 * `nota` es para los párrafos que la ley obliga a reproducir textualmente
 * (las leyendas de la Ley 25.326): se destacan para que se lean como cita y no
 * como redacción propia.
 */
export type Bloque =
  | { tipo: "p"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "nota"; texto: string };

export type Seccion = {
  id: string;
  titulo: string;
  bloques: Bloque[];
};

export type Documento = {
  /** Ruta: /terminos, /privacidad, /cookies. */
  slug: string;
  /** Rótulo corto para la navegación entre los tres documentos. */
  nombreCorto: string;
  eyebrow: string;
  /** Una línea por renglón del titular. */
  title: string[];
  /** Bajada de la página. */
  resumen: string;
  /** meta description. */
  descripcion: string;
  secciones: Seccion[];
};

/* --------------------------------------------------------------------------
   01 — TÉRMINOS Y CONDICIONES
   -------------------------------------------------------------------------- */

export const TERMINOS: Documento = {
  slug: "terminos",
  nombreCorto: "Términos y condiciones",
  eyebrow: "LEGAL",
  title: ["Términos", "y condiciones"],
  resumen:
    "Las reglas de uso de este sitio: qué es, qué podés hacer acá, de quién es lo que ves y qué no prometemos.",
  descripcion:
    "Términos y condiciones de uso del sitio de +4 Creative Studio: objeto, uso permitido, propiedad intelectual, responsabilidad y jurisdicción.",
  secciones: [
    {
      id: "quienes-somos",
      titulo: "Quiénes somos",
      bloques: [
        {
          tipo: "p",
          texto: `Este sitio es operado por ${responsable()}. En adelante lo llamamos «el Estudio» o «nosotros», y a quien visita el sitio, «usted» o «el usuario».`,
        },
        {
          tipo: "p",
          texto: `Para cualquier cuestión relacionada con estos términos puede escribirnos a ${EMAIL}.`,
        },
      ],
    },
    {
      id: "que-es-este-sitio",
      titulo: "Qué es este sitio",
      bloques: [
        {
          tipo: "p",
          texto:
            "Es un sitio institucional e informativo: presenta al Estudio, su método de trabajo y los servicios que ofrece. No es una tienda. No se venden productos ni servicios en línea, no hay carrito, no se procesan pagos y no se piden datos de tarjetas en ninguna parte.",
        },
        {
          tipo: "p",
          texto:
            "La información sobre servicios, alcances y formas de trabajo es descriptiva y no constituye una oferta vinculante. Cada trabajo se cotiza y se acuerda por separado, en una propuesta escrita aceptada por las partes. Si algo de esa propuesta difiere de lo que dice el sitio, prevalece la propuesta.",
        },
      ],
    },
    {
      id: "aceptacion",
      titulo: "Aceptación de estos términos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Al navegar este sitio usted acepta estos términos. Si no está de acuerdo con alguno de ellos, le pedimos que no lo use.",
        },
        {
          tipo: "p",
          texto:
            "Podemos actualizarlos cuando cambie el sitio o la normativa aplicable. La versión vigente es siempre la publicada en esta página, con su fecha de última actualización al pie.",
        },
      ],
    },
    {
      id: "uso-permitido",
      titulo: "Uso permitido",
      bloques: [
        {
          tipo: "p",
          texto:
            "Puede navegar el sitio, leer su contenido, compartir sus enlaces y usar el formulario y los medios de contacto para comunicarse con nosotros. En cambio, no está permitido:",
        },
        {
          tipo: "lista",
          items: [
            "Usar el sitio con fines ilícitos o contrarios a estos términos.",
            "Intentar acceder a partes no públicas, vulnerar medidas de seguridad o interferir en el funcionamiento del sitio.",
            "Extraer contenido de forma masiva o automatizada —robots, scraping, copias espejo— sin nuestra autorización escrita.",
            "Introducir código malicioso o cualquier cosa que pueda dañar el sitio o a quienes lo visitan.",
            "Suplantar la identidad de otra persona al usar el formulario.",
          ],
        },
      ],
    },
    {
      id: "formulario",
      titulo: "El formulario de contacto",
      bloques: [
        {
          tipo: "p",
          texto:
            "El formulario del final de la página pide nombre, correo electrónico y teléfono, y sirve para una sola cosa: que podamos responderle. Completarlo no genera ninguna obligación —ni para usted de contratar, ni para nosotros de aceptar un trabajo— y tampoco perfecciona ningún contrato.",
        },
        {
          tipo: "p",
          texto:
            "Al enviarlo usted declara que los datos son verdaderos, que le pertenecen y que es mayor de 18 años. Si nos deja datos de otra persona, debe contar con su autorización para hacerlo.",
        },
        {
          tipo: "p",
          texto:
            "Qué hacemos con esos datos, con quién los compartimos y cómo pedir que los borremos está explicado en la Política de privacidad.",
        },
      ],
    },
    {
      id: "propiedad-intelectual",
      titulo: "Propiedad intelectual",
      bloques: [
        {
          tipo: "p",
          texto:
            "El diseño, el código, los textos, las imágenes, las animaciones, la marca «+4 Creative Studio» y el resto del contenido del sitio son de nuestra titularidad o se usan con autorización de su titular, y están protegidos por la Ley 11.723 de Propiedad Intelectual y por la normativa de marcas.",
        },
        {
          tipo: "p",
          texto:
            "Puede compartir el enlace del sitio y citar fragmentos breves indicando la fuente. No puede reproducir, copiar, modificar, distribuir ni reutilizar su contenido —en particular el diseño y el código— con fines comerciales sin nuestra autorización escrita.",
        },
        {
          tipo: "p",
          texto:
            "Los trabajos de clientes que se muestran en el sitio se publican con su conformidad. Las marcas de terceros que aparezcan pertenecen a sus respectivos titulares y se mencionan únicamente para identificarlas.",
        },
      ],
    },
    {
      id: "enlaces",
      titulo: "Enlaces a sitios de terceros",
      bloques: [
        {
          tipo: "p",
          texto:
            "El sitio enlaza a servicios que no controlamos, como WhatsApp e Instagram. Al seguir esos enlaces usted sale de nuestro sitio y pasa a regirse por los términos y las políticas de privacidad de esas plataformas. No respondemos por sus contenidos, su disponibilidad ni por el tratamiento que hagan de sus datos.",
        },
      ],
    },
    {
      id: "disponibilidad",
      titulo: "Disponibilidad del sitio",
      bloques: [
        {
          tipo: "p",
          texto:
            "Procuramos que el sitio esté disponible y actualizado, pero se ofrece tal como está. Podemos modificarlo, suspenderlo o darlo de baja, total o parcialmente, por mantenimiento, por razones técnicas o por decisión propia.",
        },
        {
          tipo: "p",
          texto:
            "El sitio depende de servicios de terceros —alojamiento, red, infraestructura—, de modo que no podemos garantizar un funcionamiento ininterrumpido ni libre de errores.",
        },
      ],
    },
    {
      id: "responsabilidad",
      titulo: "Responsabilidad",
      bloques: [
        {
          tipo: "p",
          texto:
            "El contenido del sitio es informativo y general. No es asesoramiento profesional para un caso concreto y no reemplaza una propuesta ni un acuerdo escrito.",
        },
        {
          tipo: "p",
          texto:
            "En la máxima medida que permita la ley aplicable, no respondemos por los daños derivados del uso o de la imposibilidad de uso del sitio, de errores en su contenido ni de interrupciones del servicio. Nada de lo dicho acá limita los derechos que las normas de orden público —en particular la Ley 24.240 de Defensa del Consumidor— reconozcan al usuario.",
        },
      ],
    },
    {
      id: "datos-personales",
      titulo: "Protección de datos personales",
      bloques: [
        {
          tipo: "p",
          texto:
            "El tratamiento de los datos personales que recibimos a través del sitio está explicado en la Política de privacidad y en la Política de cookies, que forman parte de estos términos.",
        },
      ],
    },
    {
      id: "ley-aplicable",
      titulo: "Ley aplicable y jurisdicción",
      bloques: [
        {
          tipo: "p",
          texto: `Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia serán competentes ${JURISDICCION}, sin perjuicio del derecho del consumidor a demandar ante el tribunal de su propio domicilio cuando la ley se lo reconozca.`,
        },
      ],
    },
    {
      id: "contacto",
      titulo: "Contacto",
      bloques: [
        {
          tipo: "p",
          texto: `Por cualquier consulta sobre estos términos, escribinos a ${EMAIL}.`,
        },
      ],
    },
  ],
};

/* --------------------------------------------------------------------------
   02 — POLÍTICA DE PRIVACIDAD
   -------------------------------------------------------------------------- */

export const PRIVACIDAD: Documento = {
  slug: "privacidad",
  nombreCorto: "Política de privacidad",
  eyebrow: "LEGAL",
  title: ["Política de", "privacidad"],
  resumen:
    "Pedimos tres datos, los usamos para responderte y no los vendemos. Acá está el detalle completo: qué recogemos, dónde queda, cuánto tiempo y cómo pedir que lo borremos.",
  descripcion:
    "Cómo trata +4 Creative Studio los datos personales del formulario de contacto: qué recoge, con qué base legal, con quién los comparte, cuánto los conserva y cómo ejercer los derechos de la Ley 25.326.",
  secciones: [
    {
      id: "responsable",
      titulo: "Quién es el responsable",
      bloques: [
        {
          tipo: "p",
          texto: `Los datos personales que se recogen en este sitio son tratados por ${responsable()}, responsable de la base de datos.`,
        },
        {
          tipo: "p",
          texto: `Para cualquier cuestión sobre sus datos, incluido el ejercicio de los derechos que se explican más abajo, puede escribirnos a ${EMAIL}.`,
        },
      ],
    },
    {
      id: "que-datos",
      titulo: "Qué datos recogemos",
      bloques: [
        {
          tipo: "p",
          texto: "Hay dos cosas distintas, y conviene no confundirlas.",
        },
        {
          tipo: "lista",
          items: [
            "Los que usted nos da. Si completa el formulario del final de la página: nombre, dirección de correo electrónico y teléfono. Los tres son necesarios para poder responderle. Darlos es voluntario: si prefiere no dejarlos, puede escribirnos por WhatsApp, por Instagram o por correo electrónico.",
            "Los que genera la visita. Como cualquier sitio web, nuestro servidor registra datos técnicos de cada solicitud: dirección IP, fecha y hora, tipo de navegador y de dispositivo, página solicitada y página de origen. Esos registros los genera y conserva nuestro proveedor de alojamiento para que el sitio funcione y para detectar abusos o ataques. No los usamos para identificar a nadie ni para publicidad.",
          ],
        },
        {
          tipo: "p",
          texto:
            "No recogemos nada más. El sitio no usa cookies, no tiene herramientas de analítica, no tiene píxeles publicitarios y no construye perfiles de navegación. Tampoco compramos ni alquilamos bases de datos de terceros.",
        },
      ],
    },
    {
      id: "para-que",
      titulo: "Para qué los usamos",
      bloques: [
        { tipo: "p", texto: "Los datos del formulario se usan únicamente para:" },
        {
          tipo: "lista",
          items: [
            "Responder su consulta y mantener la conversación que se inicie a partir de ella.",
            "Enviarle una propuesta o un presupuesto, si eso es lo que pidió.",
            "Contactarlo por el medio que nos dejó, para lo anterior.",
          ],
        },
        {
          tipo: "p",
          texto:
            "No los usamos para enviar publicidad ni newsletters sin su consentimiento previo, no los vendemos, no los cedemos a anunciantes y no los sometemos a decisiones automatizadas.",
        },
      ],
    },
    {
      id: "base-legal",
      titulo: "Con qué base legal",
      bloques: [
        {
          tipo: "p",
          texto:
            "Con su consentimiento libre, expreso e informado, que usted presta al completar y enviar el formulario, en los términos del artículo 5 de la Ley 25.326 de Protección de los Datos Personales. Puede retirarlo en cualquier momento, sin que eso afecte la licitud del tratamiento anterior.",
        },
        {
          tipo: "p",
          texto:
            "Los registros técnicos del servidor se tratan por nuestro interés legítimo en mantener el sitio seguro y en funcionamiento.",
        },
      ],
    },
    {
      id: "terceros",
      titulo: "Quién más accede a los datos",
      bloques: [
        {
          tipo: "p",
          texto:
            "No publicamos los datos ni los compartimos con terceros con fines comerciales. Sí los tratan, por encargo nuestro y sólo para prestarnos su servicio, los siguientes proveedores:",
        },
        {
          tipo: "lista",
          items: [
            "Google LLC. Los datos del formulario llegan a una planilla de Google Sheets y nos avisan por correo electrónico. Es el lugar donde queda registrada la consulta.",
            "Vercel Inc. Aloja el sitio y genera los registros técnicos de cada visita.",
            "Meta Platforms, Inc. Sólo si usted elige escribirnos por WhatsApp o contactarnos por Instagram. En ese caso la conversación ocurre dentro de esas plataformas y se rige por sus propias políticas.",
          ],
        },
        {
          tipo: "p",
          texto:
            "Esos proveedores están radicados en los Estados Unidos, de modo que el envío de los datos implica una transferencia internacional en los términos del artículo 12 de la Ley 25.326. Los elegimos por sus condiciones contractuales de seguridad y protección de datos, y lo que se les transfiere se limita a lo descripto más arriba.",
        },
        {
          tipo: "p",
          texto:
            "También podríamos tener que entregar datos si lo requiere una autoridad judicial o administrativa competente.",
        },
      ],
    },
    {
      id: "conservacion",
      titulo: "Cuánto tiempo los conservamos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Los datos del formulario se conservan mientras exista una relación o un interés comercial concreto y, como máximo, veinticuatro meses desde el último contacto. Cumplido ese plazo se eliminan, salvo que exista un contrato en curso o una obligación legal de conservarlos.",
        },
        {
          tipo: "p",
          texto: "Si usted pide la baja antes, los borramos al recibir el pedido.",
        },
      ],
    },
    {
      id: "derechos",
      titulo: "Sus derechos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Puede pedirnos en cualquier momento acceder a sus datos, rectificarlos, actualizarlos o suprimirlos, y retirar el consentimiento que nos dio.",
        },
        {
          tipo: "p",
          texto: `Para hacerlo, escriba a ${EMAIL} desde la dirección que nos dejó, o indicando algún dato que nos permita ubicar su consulta. Respondemos dentro de los plazos de la Ley 25.326: diez días corridos para los pedidos de acceso y cinco días hábiles para los de rectificación, actualización o supresión.`,
        },
        {
          tipo: "nota",
          texto:
            "El titular de los datos personales tiene la facultad de ejercer el derecho de acceso al mismo en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326.",
        },
        {
          tipo: "nota",
          texto:
            "La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.",
        },
      ],
    },
    {
      id: "seguridad",
      titulo: "Seguridad",
      bloques: [
        {
          tipo: "p",
          texto:
            "El sitio se sirve íntegramente por conexión cifrada (HTTPS) y el acceso a la planilla donde quedan las consultas está restringido a las cuentas del Estudio que necesitan verla. Aun así, ningún sistema es infalible: si detectáramos un incidente que afecte sus datos, lo comunicaríamos a los afectados y a la autoridad de control cuando corresponda.",
        },
      ],
    },
    {
      id: "menores",
      titulo: "Menores de edad",
      bloques: [
        {
          tipo: "p",
          texto: `El sitio y sus servicios están dirigidos a empresas y a personas mayores de 18 años. No recogemos deliberadamente datos de menores de edad; si creyera que eso ocurrió, escribinos a ${EMAIL} y los eliminamos.`,
        },
      ],
    },
    {
      id: "cambios",
      titulo: "Cambios en esta política",
      bloques: [
        {
          tipo: "p",
          texto:
            "Si cambiamos lo que hacemos con los datos, actualizamos esta página junto con su fecha. Si el cambio fuera sustancial y afectara datos ya recogidos, lo informaríamos por el medio de contacto que tengamos.",
        },
      ],
    },
  ],
};

/* --------------------------------------------------------------------------
   03 — POLÍTICA DE COOKIES
   -------------------------------------------------------------------------- */

export const COOKIES: Documento = {
  slug: "cookies",
  nombreCorto: "Política de cookies",
  eyebrow: "LEGAL",
  title: ["Política", "de cookies"],
  resumen:
    "Este sitio no usa cookies. Ni propias, ni de terceros, ni de analítica. Esta página explica qué significa eso y qué pasa, técnicamente, cuando lo visitás.",
  descripcion:
    "El sitio de +4 Creative Studio no utiliza cookies, analítica ni píxeles de seguimiento. Acá se explica qué ocurre técnicamente durante una visita.",
  secciones: [
    {
      id: "que-es",
      titulo: "Qué es una cookie",
      bloques: [
        {
          tipo: "p",
          texto:
            "Una cookie es un archivo mínimo que un sitio web guarda en su navegador para reconocerlo en visitas posteriores. Sirven para recordar preferencias, mantener abierta una sesión o —el uso más extendido— medir y perfilar la navegación con fines estadísticos o publicitarios.",
        },
      ],
    },
    {
      id: "no-usamos",
      titulo: "Este sitio no usa cookies",
      bloques: [
        {
          tipo: "p",
          texto:
            "No instalamos cookies propias ni de terceros, ni ninguna otra técnica equivalente de almacenamiento o seguimiento en su navegador. En concreto, este sitio no tiene:",
        },
        {
          tipo: "lista",
          items: [
            "Cookies ni almacenamiento local para reconocerlo entre visitas.",
            "Herramientas de analítica o de medición de audiencia.",
            "Píxeles ni etiquetas publicitarias de ninguna plataforma.",
            "Botones sociales ni contenido incrustado de otros sitios que puedan rastrearlo.",
          ],
        },
        {
          tipo: "p",
          texto:
            "Por eso no verá un banner de consentimiento ni un panel de configuración de cookies: no hay nada que consentir ni que configurar.",
        },
      ],
    },
    {
      id: "que-si-pasa",
      titulo: "Qué sí ocurre cuando visita el sitio",
      bloques: [
        {
          tipo: "p",
          texto: "Para que quede claro, hay dos cosas técnicas que pasan y que no son cookies:",
        },
        {
          tipo: "lista",
          items: [
            "Registros del servidor. Nuestro proveedor de alojamiento anota cada solicitud —dirección IP, fecha y hora, navegador, página pedida— para que el sitio funcione y se mantenga seguro. Es información que queda del lado del servidor, no en su navegador, y está explicada en la Política de privacidad.",
            "Tipografías propias. Las fuentes del sitio se sirven desde nuestro propio dominio: se incorporan al sitio cuando se compila, así que su navegador no le pide nada a servidores de terceros para mostrarlas.",
          ],
        },
      ],
    },
    {
      id: "enlaces-externos",
      titulo: "Enlaces externos",
      bloques: [
        {
          tipo: "p",
          texto:
            "Si desde acá hace clic hacia WhatsApp, Instagram o cualquier otro sitio, esas plataformas sí usan sus propias cookies y tecnologías de seguimiento, con sus propias políticas. Lo que ocurra una vez que salió de este sitio queda fuera de nuestro alcance.",
        },
      ],
    },
    {
      id: "si-cambia",
      titulo: "Si esto cambia",
      bloques: [
        {
          tipo: "p",
          texto:
            "Si en el futuro incorporamos analítica o cualquier herramienta que necesite cookies, actualizamos esta página antes de hacerlo y, cuando la ley lo exija, pedimos su consentimiento previo: nada que no sea estrictamente necesario se cargaría antes de que usted lo acepte.",
        },
      ],
    },
    {
      id: "como-controlar",
      titulo: "Cómo controlar las cookies en su navegador",
      bloques: [
        {
          tipo: "p",
          texto:
            "Aunque acá no haga falta, puede revisar, bloquear y borrar las cookies de cualquier sitio desde la configuración de su navegador —en Chrome, Safari, Firefox y Edge está dentro de la sección de privacidad— o navegar en una ventana privada. Tenga en cuenta que bloquear cookies de forma general puede afectar el funcionamiento de otros sitios, no el de este.",
        },
      ],
    },
  ],
};

/** Los tres, en el orden en que se enlazan entre sí y al pie del sitio. */
export const DOCUMENTOS: Documento[] = [TERMINOS, PRIVACIDAD, COOKIES];

/** Enlaces legales para el cierre de la home y los pies de página. */
export const LEGAL_LINKS = DOCUMENTOS.map((doc) => ({
  label: doc.nombreCorto,
  href: `/${doc.slug}`,
}));
