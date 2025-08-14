const questions = [
    {
        id: 1,
        title: "Gasto público y déficit",
        text: "¿El próximo gobierno debería reducir los gastos del Estado para mejorar la situación económica del país?"
    },
    {
        id: 2,
        title: "Empresas estatales deficitarias",
        text: "¿El gobierno debería cerrar las empresas públicas que tuvieron pérdidas durante mucho tiempo?"
    },
    {
        id: 3,
        title: "Litio y soberanía",
        text: "¿Bolivia debería encargarse por completo de sus recursos de litio, sin dejar que empresas extranjeras tengan mucho control?"
    },
    {
        id: 4,
        title: "Reducción de la participación estatal en la economía",
        text: "¿El gobierno debería participar menos en la economía y dejar más espacio a las empresas privadas?"
    },
    {
        id: 5,
        title: "Uso de semillas transgénicas",
        text: "¿El próximo gobierno debería permitir que los agricultores usen semillas transgénicas para mejorar su producción?"
    },
    {
        id: 6,
        title: "Bonos sociales",
        text: "¿El próximo gobierno debería seguir dando bonos y ayudas económicas para apoyar a las personas más necesitadas?"
    },
    {
        id: 7,
        title: "Interrupción voluntaria del embarazo",
        text: "¿Bolivia debería permitir el aborto en cualquier caso?"
    },
    {
        id: 8,
        title: "Reconocimiento legal de parejas del mismo sexo",
        text: "¿El próximo gobierno debería permitir que las parejas del mismo sexo tengan los mismos derechos que las parejas heterosexuales, incluyendo formar una familia?"
    },
    {
        id: 9,
        title: "Producción de coca y narcotráfico",
        text: "¿Bolivia debería reducir la cantidad de cultivos de coca que exceden el límite legal para combatir el narcotráfico?"
    },
    {
        id: 10,
        title: "Subvención a los carburantes",
        text: "¿El próximo gobierno debería reducir el dinero que usa para mantener bajos los precios de la gasolina y el diésel?"
    },
    {
        id: 11,
        title: "Autonomía regional y descentralización",
        text: "¿Bolivia debería dar más recursos y decisiones a los gobiernos departamentales y municipales para que puedan resolver mejor sus propios problemas?"
    },
    {
        id: 12,
        title: "Límite a la reelección presidencial",
        text: "¿Se debe respetar la regla de solo dos mandatos (continuos o discontinuos) para ser presidente, sin permitir reelección indefinida?"
    },
    {
        id: 13,
        title: "Amnistía política y reconciliación",
        text: "¿Se debería liberar a los líderes opositores presos por la crisis de 2019–2020, para ayudar a la reconciliación en el país?"
    },
    {
        id: 14,
        title: "Independencia del sistema judicial",
        text: "¿El sistema judicial debe ser reformado para garantizar que funcione de manera independiente del poder político?"
    },
    {
        id: 15,
        title: "Relación con Estados Unidos",
        text: "¿Bolivia debe fortalecer sus lazos económicos y políticos con Estados Unidos para impulsar el comercio y la cooperación internacional?"
    },
    {
        id: 16,
        title: "Incendios y medio ambiente",
        text: "¿El gobierno debería prohibir las quemas agrícolas que están provocando incendios y deforestación?"
    },
    {
        id: 17,
        title: "Regularización de vehículos indocumentados",
        text: "¿El próximo gobierno debería permitir que los autos \"chutos\" puedan registrarse y pagar impuestos?"
    },
    {
        id: 18,
        title: "Bloqueo de caminos",
        text: "¿Se debería castigar con cárcel a quienes bloqueen caminos como forma de protesta, para no afectar a la población?"
    },
    {
        id: 19,
        title: "Procesos judiciales a Evo Morales",
        text: "¿Evo Morales debería ser encarcelado por los delitos de los que se le acusa?"
    },
    {
        id: 20,
        title: "Contenidos escolares",
        text: "¿En los colegios se debería dejar de enseñar contenidos con ideas descolonizadoras o que cuestionan el rol tradicional de hombres y mujeres?"
    }
];


const candidates = [
    {
        id: 1,
        name: "Samuel Doria Medina",
        party: "UNIDAD",
        photo: "images/7-samuel-doria-medina.jpeg",
        initials: "SD"
    },
    {
        id: 2,
        name: "Tuto Quiroga",
        party: "Libre – Libertad y Democracia",
        photo: "images/4-jorge-quiroga.jpg",
        initials: "TQ"
    },
    {
        id: 3,
        name: "Manfred Reyes Villa",
        party: "APB Súmate",
        photo: "images/3-manfred-reyes-villa.jpg",
        initials: "MR"
    },
    {
        id: 4,
        name: "Rodrigo Paz",
        party: "Partido Demócrata Cristiano",
        photo: "images/8-rodrigo-paz.jpg",
        initials: "RP"
    },
    {
        id: 5,
        name: "Jhonny Fernández",
        party: "Fuerza del Pueblo",
        photo: "images/5-jhonny-fernandez.jpg",
        initials: "JF"
    },
    {
        id: 6,
        name: "Andrónico Rodríguez",
        party: "Alianza Popular",
        photo: "images/1-andronico-rodriguez.jpg",
        initials: "AR"
    },
    {
        id: 7,
        name: "Eduardo del Castillo",
        party: "Movimiento al Socialismo",
        photo: "images/6-eduardo-del-castillo.png",
        initials: "EC"
    },
    {
        id: 8,
        name: "Pavel Aracena",
        party: "Libertad y Progreso ADN",
        photo: "images/2-pavel-aracena.webp",
        initials: "PA"
    }
];

// Bloques temáticos de preguntas (5 preguntas por bloque)
const thematicBlocks = [
    {
        id: 1,
        title: "Economía",
        questions: [1, 2, 3, 4, 5], // IDs de preguntas
        description: "Políticas económicas, fiscales y de desarrollo"
    },
    {
        id: 2,
        title: "Social",
        questions: [6, 7, 8, 9, 10],
        description: "Derechos humanos, políticas sociales y justicia social"
    },
    {
        id: 3,
        title: "Político",
        questions: [11, 12, 13, 14, 15],
        description: "Autonomía, democracia, justicia y relaciones internacionales"
    },
    {
        id: 4,
        title: "Coyuntural",
        questions: [16, 17, 18, 19, 20],
        description: "Temas actuales, medio ambiente y contenidos educativos"
    }
];


const glossary = {
    "descentralización": {
        title: "Descentralización",
        text: "Proceso de transferir poder y responsabilidades del gobierno central a los gobiernos regionales y locales, permitiendo mayor autonomía en la toma de decisiones."
    },
    "neoliberalismo": {
        title: "Neoliberalismo",
        text: "Doctrina económica que defiende la liberalización de la economía, la privatización de empresas públicas y la reducción del gasto público."
    },
    "soberanía": {
        title: "Soberanía",
        text: "Autoridad suprema del poder público. En el contexto nacional, se refiere a la independencia de un estado para gobernarse a sí mismo."
    },
    "populismo": {
        title: "Populismo",
        text: "Estrategia política que busca el apoyo popular apelando directamente al pueblo, a menudo criticando a las élites establecidas."
    },
    "extractivismo": {
        title: "Extractivismo",
        text: "Modelo económico basado en la extracción de recursos naturales en gran escala, principalmente para la exportación."
    },
    "autonomía": {
        title: "Autonomía",
        text: "Capacidad de una región o entidad para gobernarse a sí misma dentro del marco de un estado más amplio."
    },
    "plurinacional": {
        title: "Estado Plurinacional",
        text: "Modelo de estado que reconoce la existencia de múltiples naciones y culturas dentro de un mismo territorio nacional."
    },
    "democracia": {
        title: "Democracia",
        text: "Sistema de gobierno en el que el poder político es ejercido por el pueblo, generalmente a través de representantes elegidos mediante votación."
    },
    "constitución": {
        title: "Constitución",
        text: "Ley fundamental de un estado que establece los principios básicos de organización política y los derechos fundamentales de los ciudadanos."
    },
    "referendum": {
        title: "Referéndum",
        text: "Consulta popular en la que los ciudadanos votan directamente sobre una propuesta de ley o decisión política específica."
    },
    "privatización": {
        title: "Privatización",
        text: "Proceso de transferir la propiedad de empresas o servicios del sector público al sector privado."
    },
    "subsidio": {
        title: "Subsidio",
        text: "Ayuda económica proporcionada por el estado para apoyar actividades consideradas de interés público o social."
    }
};


const candidateScores = [
    // Samuel Doria (Candidato 1)
    [2, 2, -1, 2, 2, 1, -2, 2, 1, 2, 2, 2, 2, 2, 2, -1, 0, 1, 2, 0],
    // Tuto Quiroga (Candidato 2)  
    [2, 2, -2, 2, 2, 1, 0, 2, 2, 1, 2, 2, 2, 2, 2, -1, 0, 2, 2, 0],
    // Manfred Reyes (Candidato 3)
    [2, 2, -1, 1, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0],
    // Rodrigo Paz (Candidato 4)
    [1, 1, 1, 1, 1, 0, -1, 1, -1, 0, 1, 2, 1, 1, 1, 1, 2, 1, 2, 0],
    // Jhonny Fernández (Candidato 5)
    [0, 1, 1, 2, 1, 1, 0, 1, 0, 0, 2, 1, 0, 2, 1, 1, 0, 1, 0, 0],
    // Andrónico Rodríguez (Candidato 6)
    [-1, 0, 2, 0, -2, 1, 0, 0, -1, 1, -1, -2, -2, -1, -2, 2, -2, -2, -2, -2],
    // Eduardo del Castillo (Candidato 7)
    [-1, -1, 2, -1, 0, 2, 2, 1, -2, 0, -1, -2, -2, -1, -2, 1, 2, 1, 2, 0],
    // Pavel Aracena (Candidato 8)
    [2, 2, 1, 2, 0, -2, -2, -2, -1, 2, 2, 0, 0, 2, 1, 1, 0, 2, 2, 0]
];


window.testData = {
    questions,
    candidates,
    candidateScores,
    glossary,
    thematicBlocks
};
