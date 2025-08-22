import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PenLine,
  Timer,
  Brain,
  Trophy,
  FileDown,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
  Volume2,
} from "lucide-react";

/**
 * English Study App – 7th Grade (bilingüe EN–ES)
 * Cambios:
 *  - Vocabulario ahora es { en, es }
 *  - Flashcards muestran traducción (con audio opcional)
 *  - Quiz con dirección EN→ES o ES→EN
 *  - Estilos y estructura compatibles con móvil
 */

const SYLLABUS = {
  objectives: [
    {
      id: "OA9",
      title: "Comprensión de lectura (OA9)",
      desc:
        "Demostrar comprensión de ideas generales e información explícita en textos simples y auténticos (experiencias personales, temas de otras asignaturas, actualidad, otras culturas).",
      indicators: [
        "Identifican la idea general.",
        "Identifican información explícita.",
        "Responden preguntas sobre información general y explícita.",
        "Plantean una postura frente a información del texto.",
      ],
    },
    {
      id: "OA10",
      title: "Comprensión de textos no literarios (OA10)",
      desc:
        "Demostrar comprensión de descripciones, instrucciones, avisos, emails, diálogos, páginas web, biografías, gráficos.",
      indicators: [
        "Identifican ideas generales y detalles.",
        "Distinguen hecho/opinión y causa/efecto.",
        "Reconocen conectores (first, next, finally, because, while, before/after, too).",
        "Identifican vocabulario temático y expresiones frecuentes.",
      ],
    },
    {
      id: "OA13",
      title: "Expresión escrita creativa (OA13)",
      desc:
        "Escribir historias e información relevante (experiencias personales, contenidos interdisciplinarios, problemas globales, cultura de otros países, textos leídos).",
      indicators: [
        "Describen información relevante.",
        "Redactan opiniones con apoyo de imágenes.",
        "Comparten información sobre temas del año.",
      ],
    },
    {
      id: "OA16",
      title: "Uso del lenguaje en textos escritos (OA16)",
      desc:
        "Funciones: cantidades (there is/are, many/much), describir objetos/deportes, actividades, obligación/prohibición (must/mustn’t), claridad con expresiones comunes, tiempo/modo (yesterday, quietly), causa/efecto (if), preguntas en presente/pasado, acciones simultáneas/interrumpidas (Past Continuous), conectores (first/next/finally; before/after).",
      indicators: [
        "Completan ideas con expresiones comunes (make friends, see you soon, take a break).",
        "Describen rutinas, hobbies y acciones realizadas.",
        "Describen acciones simultáneas o interrumpidas en pasado.",
        "Responden preguntas en presente y pasado justificando opiniones.",
      ],
    },
  ],
  vocabulary: {
    emotions: [
      { en: "happy", es: "feliz" },
      { en: "angry", es: "enojado/a" },
      { en: "sad", es: "triste" },
      { en: "tired", es: "cansado/a" },
      { en: "excited", es: "emocionado/a" },
      { en: "nervous", es: "nervioso/a" },
      { en: "nice", es: "amable" },
      { en: "annoyed", es: "molesto/a" },
      { en: "bored", es: "aburrido/a" },
      { en: "upset", es: "disgustado/a" },
      { en: "glad", es: "contento/a" },
      { en: "kind", es: "bondadoso/a" },
      { en: "friendly", es: "amistoso/a" },
    ],
    activities: [
      { en: "play sports", es: "hacer deporte" },
      { en: "go out", es: "salir" },
      { en: "surf the net", es: "navegar por internet" },
      { en: "play console games", es: "jugar en consola" },
      { en: "chat on the phone", es: "hablar por teléfono" },
      { en: "hang out", es: "pasar el rato" },
      { en: "play football", es: "jugar fútbol" },
      { en: "do karate", es: "hacer kárate" },
      { en: "do athletics", es: "hacer atletismo" },
      { en: "go swimming", es: "ir a nadar" },
      { en: "go skating", es: "ir a patinar" },
    ],
    expressions: [
      { en: "afraid of", es: "tener miedo de" },
      { en: "make friends", es: "hacer amigos" },
      { en: "make plans", es: "hacer planes" },
      { en: "make a mistake", es: "cometer un error" },
      { en: "give advice", es: "dar consejos" },
      { en: "I'm fed up with", es: "estoy harto de" },
      { en: "I'm sorry to hear that", es: "siento escuchar eso" },
      { en: "see you later", es: "hasta luego" },
      { en: "see you soon", es: "nos vemos pronto" },
      { en: "I feel … because …", es: "me siento … porque …" },
    ],
    food: [
      { en: "apple", es: "manzana" },
      { en: "orange", es: "naranja" },
      { en: "banana", es: "plátano" },
      { en: "lemon", es: "limón" },
      { en: "grape", es: "uva" },
      { en: "tomato", es: "tomate" },
      { en: "potato", es: "papa" },
      { en: "lettuce", es: "lechuga" },
      { en: "cabbage", es: "repollo" },
      { en: "carrot", es: "zanahoria" },
      { en: "meat", es: "carne" },
      { en: "chicken", es: "pollo" },
      { en: "egg", es: "huevo" },
      { en: "pasta", es: "pasta" },
      { en: "pizza", es: "pizza" },
      { en: "rice", es: "arroz" },
      { en: "salad", es: "ensalada" },
      { en: "sandwich", es: "sándwich" },
      { en: "biscuit", es: "galleta" },
      { en: "bread", es: "pan" },
      { en: "cake", es: "torta" },
      { en: "butter", es: "mantequilla" },
      { en: "cheese", es: "queso" },
      { en: "chocolate", es: "chocolate" },
      { en: "ice cream", es: "helado" },
      { en: "coffee", es: "café" },
      { en: "juice", es: "jugo" },
      { en: "milk", es: "leche" },
      { en: "water", es: "agua" },
      { en: "tea", es: "té" },
    ],
    sports: [
      { en: "football", es: "fútbol" },
      { en: "tennis", es: "tenis" },
      { en: "basketball", es: "básquetbol" },
      { en: "volleyball", es: "vóleibol" },
      { en: "running", es: "correr" },
      { en: "climbing", es: "escalada" },
      { en: "skating", es: "patinaje" },
      { en: "aerobics", es: "aeróbica" },
      { en: "karate", es: "kárate" },
      { en: "athletics", es: "atletismo" },
      { en: "gymnastics", es: "gimnasia" },
      { en: "skateboarding", es: "andar en skate" },
    ],
    equipment: [
      { en: "sneakers", es: "zapatillas" },
      { en: "ball", es: "pelota" },
      { en: "bat", es: "bate" },
      { en: "stick", es: "palo" },
      { en: "helmet", es: "casco" },
    ],
    places: [
      { en: "court", es: "cancha" },
      { en: "pitch", es: "campo" },
      { en: "stadium", es: "estadio" },
      { en: "track", es: "pista" },
      { en: "pool", es: "piscina" },
    ],
    environment: [
      { en: "environment", es: "medio ambiente" },
      { en: "plastic", es: "plástico" },
      { en: "glass", es: "vidrio" },
      { en: "metal", es: "metal" },
      { en: "second hand", es: "de segunda mano" },
      { en: "factory", es: "fábrica" },
      { en: "outdoors", es: "al aire libre" },
      { en: "countryside", es: "campo" },
      { en: "wildfire", es: "incendio forestal" },
      { en: "earthquake", es: "terremoto" },
      { en: "forest", es: "bosque" },
      { en: "lake", es: "lago" },
      { en: "sea", es: "mar" },
      { en: "pollution", es: "contaminación" },
      { en: "temperature", es: "temperatura" },
      { en: "smog", es: "smog" },
      { en: "waste", es: "residuos" },
      { en: "cut down", es: "talar" },
      { en: "destroy", es: "destruir" },
      { en: "contaminate", es: "contaminar" },
      { en: "natural resources", es: "recursos naturales" },
      { en: "protect", es: "proteger" },
      { en: "save", es: "ahorrar/salvar" },
      { en: "pollute", es: "contaminar" },
      { en: "global problems", es: "problemas globales" },
      { en: "garbage", es: "basura" },
      { en: "plant trees", es: "plantar árboles" },
      { en: "trash", es: "basura" },
      { en: "litter", es: "arrojar basura" },
    ],
  },
};

const READING_PASSAGES = [
  {
    id: 1,
    title: "A School Recycling Day",
    text:
      "Last Friday, our class organized a recycling day. First, we collected plastic bottles and paper from every room. Next, we made posters to explain why recycling matters. Finally, we visited the science lab to weigh all the materials. We saved 20 kilograms of paper!",
    questions: [
      {
        q: "What is the main idea of the text?",
        options: [
          "Students organized a recycling activity at school.",
          "Students visited a museum.",
          "Students played sports all day.",
          "Students had a math competition.",
        ],
        a: 0,
      },
      {
        q: "Which happened SECOND?",
        options: [
          "They visited the science lab.",
          "They collected bottles and paper.",
          "They made posters.",
          "They weighed 20 kilograms of plastic.",
        ],
        a: 2,
      },
      {
        q: "How much paper did they save?",
        options: ["20 kilograms", "20 grams", "200 kilograms", "2 kilograms"],
        a: 0,
      },
    ],
  },
  {
    id: 2,
    title: "Weekend Sports Club",
    text:
      "Every Saturday morning, I go to the sports club with my friends. I usually play basketball, but last weekend I tried climbing. While I was climbing, my sister was running on the track. It was fun but a little scary!",
    questions: [
      {
        q: "What sport did the writer try last weekend?",
        options: ["Running", "Climbing", "Basketball", "Swimming"],
        a: 1,
      },
      {
        q: "What was the sister doing while the writer was climbing?",
        options: ["Running", "Skating", "Basketball", "Karate"],
        a: 0,
      },
      {
        q: "How did the writer feel about climbing?",
        options: ["Bored", "Annoyed", "Scared but fun", "Angry"],
        a: 2,
      },
    ],
  },
  {
    id: 3,
    title: "A Healthy Picnic",
    text:
      "My family had a picnic in the countryside yesterday. We ate salad, fruit, and sandwiches. My mom said we mustn't leave any litter, so we took our garbage home. Before we left, we planted two trees.",
    questions: [
      {
        q: "Where did the family have a picnic?",
        options: ["At school", "In the countryside", "At a stadium", "At a mall"],
        a: 1,
      },
      {
        q: "What MUSTN'T they do?",
        options: ["Plant trees", "Eat sandwiches", "Leave litter", "Drink water"],
        a: 2,
      },
      {
        q: "What did they do before they left?",
        options: ["Played basketball", "Planted two trees", "Went swimming", "Made posters"],
        a: 1,
      },
    ],
  },
];

// --- Utilities ---
const pickN = (arr, n) => {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
};
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// --- Progress Store (localStorage) ---
const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eng7_progress") || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem("eng7_progress", JSON.stringify(progress));
  }, [progress]);
  return [progress, setProgress];
};

// --- Small helpers ---
const supportsSpeech = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

const speak = (text, lang = "en-US") => {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
};

// --- UI Primitives ---
function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function SectionCard({ icon: Icon, title, children, actions }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="section-card">
      <div className="section-card-header">
        <h3 className="section-card-title">{Icon && <Icon className="icon-sm" />} {title}</h3>
        <div className="section-card-actions">{actions}</div>
      </div>
      <div className="section-content">{children}</div>
    </motion.div>
  );
}

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="header">
      <div className="header-top">
        <div>
          <h1 className="header-title">English Study – 7° Básico</h1>
          <p className="header-subtitle">Bilingüe EN–ES. Practica vocabulario, lectura y escritura. Guarda tu avance.</p>
          <p className="protip">Tip: puedes “Imprimir” para obtener fichas o guías.</p>
        </div>
        <button className="theme-toggle" onClick={toggleDarkMode} aria-label="Cambiar tema">
          {darkMode ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
        </button>
      </div>
    </header>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs">
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={`tab-button${value === it.value ? " active" : ""}`}
        >
          <span className="inline-flex items-center gap-1">
            {it.icon && <it.icon className="icon-sm" />} {it.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SyllabusView() {
  return (
    <div className="section-grid grid-2">
      {SYLLABUS.objectives.map((oa) => (
        <SectionCard key={oa.id} icon={BookOpen} title={`${oa.title}`}>
          <p>{oa.desc}</p>
          <div className="flex-row">
            {oa.indicators.map((ind, idx) => (
              <Pill key={idx}>{ind}</Pill>
            ))}
          </div>
        </SectionCard>
      ))}
      <SectionCard icon={Brain} title="Vocabulario sugerido (EN — ES)">
        <div className="section-grid grid-3">
          {Object.entries(SYLLABUS.vocabulary).map(([cat, words]) => (
            <div key={cat} className="section-card" style={{ padding: '12px' }}>
              <h4 className="section-card-title" style={{ fontSize: '1rem', marginBottom: '8px', textTransform: 'capitalize' }}>
                {cat}
              </h4>
              <div className="flex-row">
                {words.map((w) => (
                  <Pill key={`${w.en}-${w.es}`}>{w.en} — {w.es}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function Flashcards() {
  const decks = useMemo(() => {
    return Object.entries(SYLLABUS.vocabulary).map(([cat, words]) => ({
      id: cat,
      name: cat,
      cards: words.map((w) => ({ en: w.en, es: w.es })),
    }));
  }, []);

  const [deckId, setDeckId] = useState(decks[0]?.id);
  const deck = decks.find((d) => d.id === deckId) || decks[0];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setIdx(0);
    setFlipped(false);
  }, [deckId]);

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i + 1) % deck.cards.length);
  };

  const current = deck.cards[idx];

  return (
    <SectionCard icon={Brain} title="Flashcards de vocabulario (toca para ver la traducción)" actions={
      supportsSpeech() ? (
        <button className="button-secondary" onClick={() => speak(current.en, "en-US")}>
          <Volume2 className="icon-sm" /> Escuchar
        </button>
      ) : null
    }>
      <div className="flex-row" style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '0.875rem' }}>Lista:</label>
        <select className="select" value={deckId} onChange={(e) => setDeckId(e.target.value)}>
          {decks.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button onClick={() => setIdx(Math.floor(Math.random() * deck.cards.length))} className="button-secondary">
          Aleatorio
        </button>
      </div>

      <div className="flashcard-container">
        <motion.div
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          className="flashcard-box"
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="card" style={{ position: 'absolute' }} hidden={flipped}>
            {current.en}
          </div>
          <div className="card back" style={{ position: 'absolute' }} hidden={!flipped}>
            {current.es}
          </div>
        </motion.div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button className="button-primary" onClick={next}>Siguiente</button>
          {supportsSpeech() && flipped && (
            <button className="button-secondary" onClick={() => speak(current.es, "es-ES")}>
              <Volume2 className="icon-sm" /> Escuchar ES
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function VocabQuiz({ onFinish }) {
  // Flatten to a single bilingual list
  const allPairs = useMemo(() => Object.values(SYLLABUS.vocabulary).flat(), []);
  const [dir, setDir] = useState("EN-ES"); // "EN-ES" or "ES-EN"
  const [questions, setQuestions] = useState(() => buildQuestions("EN-ES"));
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function buildQuestions(direction) {
    const qs = pickN(allPairs, 8).map((pair) => {
      const wrong = pickN(allPairs.filter((w) => w.en !== pair.en), 3);
      if (direction === "EN-ES") {
        const opts = shuffle([pair.es, ...wrong.map((w) => w.es)]);
        return {
          prompt: pair.en,
          promptLang: "en",
          opts,
          correct: opts.indexOf(pair.es),
          pair,
          hint: `Elige la traducción en español para: “${pair.en}”`,
        };
      } else {
        const opts = shuffle([pair.en, ...wrong.map((w) => w.en)]);
        return {
          prompt: pair.es,
          promptLang: "es",
          opts,
          correct: opts.indexOf(pair.en),
          pair,
          hint: `Choose the English word for: “${pair.es}”`,
        };
      }
    });
    return qs;
  }

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
  }, [submitted, answers, questions]);

  const resetQuiz = (newDir = dir) => {
    setQuestions(buildQuestions(newDir));
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <SectionCard
      icon={Trophy}
      title="Quiz de vocabulario (8 preguntas)"
      actions={[
        <select
          key="dir"
          className="select"
          value={dir}
          onChange={(e) => {
            const d = e.target.value;
            setDir(d);
            resetQuiz(d);
          }}
          title="Dirección del quiz"
        >
          <option>EN-ES</option>
          <option>ES-EN</option>
        </select>,
        <button key="regen" className="button-secondary" onClick={() => resetQuiz()}>
          <RotateCcw className="icon-sm" /> Nuevo
        </button>,
      ]}
    >
      <ol className="quiz-list">
        {questions.map((q, i) => (
          <li key={i} className="quiz-card">
            <p style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600' }}>P{i + 1}.</span> {q.hint}
            </p>

            <div className="option-grid" style={{ marginBottom: '8px' }}>
              {q.opts.map((opt, j) => {
                const selected = answers[i] === j;
                const isCorrect = submitted && j === q.correct;
                const isWrong = submitted && selected && j !== q.correct;
                return (
                  <button
                    key={j}
                    onClick={() => !submitted && setAnswers({ ...answers, [i]: j })}
                    className={`option-button${selected ? ' selected' : ''}${submitted && isCorrect ? ' correct' : ''}${submitted && isWrong ? ' wrong' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div style={{ fontSize: '0.8rem', color: 'var(--fg-secondary)' }}>
                Correcta: <strong>{dir === "EN-ES" ? q.pair.es : q.pair.en}</strong> ({q.pair.en} — {q.pair.es})
              </div>
            )}
          </li>
        ))}
      </ol>

      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} className="button-primary">Enviar</button>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803d', fontWeight: '600' }}>
              <CheckCircle2 className="icon-sm" /> Puntaje: {score}/{questions.length}
            </div>
            <button onClick={() => resetQuiz()} className="button-secondary">Repetir</button>
            {/* onFinish is optional */}
          </>
        )}
      </div>
    </SectionCard>
  );
}

function ReadingComp() {
  const [p, setP] = useState(READING_PASSAGES[0]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    if (!submitted) return 0;
    return p.questions.reduce((acc, q, i) => (answers[i] === q.a ? acc + 1 : acc), 0);
  }, [submitted, answers, p]);

  return (
    <SectionCard icon={BookOpen} title="Comprensión lectora (OA9–OA10)">
      <div className="flex-row" style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '0.875rem' }}>Texto:</label>
        <select
          className="select"
          value={p.id}
          onChange={(e) => {
            const next = READING_PASSAGES.find((x) => x.id === Number(e.target.value));
            setP(next || READING_PASSAGES[0]);
            setAnswers({});
            setSubmitted(false);
          }}
        >
          {READING_PASSAGES.map((x) => (
            <option key={x.id} value={x.id}>{x.title}</option>
          ))}
        </select>
      </div>

      <article className="section-card" style={{ marginBottom: '16px' }}>{p.text}</article>

      <ol className="quiz-list">
        {p.questions.map((q, i) => (
          <li key={i} className="quiz-card">
            <p style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>P{i + 1}.</span> {q.q}
            </p>
            <div className="option-grid">
              {q.options.map((opt, j) => {
                const selected = answers[i] === j;
                const isCorrect = submitted && j === q.a;
                const isWrong = submitted && selected && j !== q.a;
                return (
                  <button
                    key={j}
                    onClick={() => !submitted && setAnswers({ ...answers, [i]: j })}
                    className={`option-button${selected ? ' selected' : ''}${submitted && isCorrect ? ' correct' : ''}${submitted && isWrong ? ' wrong' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!submitted ? (
          <button className="button-primary" onClick={() => setSubmitted(true)}>Enviar</button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803d', fontWeight: '600' }}>
            <CheckCircle2 className="icon-sm" /> Puntaje: {score}/{p.questions.length}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

function WritingPrompts() {
  const PROMPTS = [
    { id: 1, text: "Write about a personal experience where you helped the environment. Use first/next/finally and at least 80 words.", oa: "OA13, OA16 (conectores, pasado)" },
    { id: 2, text: "Describe your favorite sport or hobby. Include equipment, place, and how often you practice.", oa: "OA16 (rutinas, deportes, frecuencia)" },
    { id: 3, text: "Give advice to a friend who feels nervous before a test. Use expressions (give advice, I'm sorry to hear that, see you soon).", oa: "OA16 (expresiones comunes)" },
    { id: 4, text: "Explain a simple cause-and-effect situation (e.g., If you heat ice cream, it melts). Give two more examples.", oa: "OA16 (if, causa-efecto)" },
  ];
  const [sel, setSel] = useState(PROMPTS[0]);
  const [text, setText] = useState("");
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <SectionCard
      icon={PenLine}
      title="Escritura guiada (OA13–OA16)"
      actions={[
        <button key="print" onClick={() => window.print()} className="button-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FileDown className="icon-sm" /> Imprimir hoja
        </button>,
      ]}
    >
      <div className="flex-row" style={{ marginBottom: '12px' }}>
        <label style={{ fontSize: '0.875rem' }}>Indicación:</label>
        <select className="select" value={sel.id} onChange={(e) => setSel(PROMPTS.find((p) => p.id === Number(e.target.value)) || PROMPTS[0])}>
          {PROMPTS.map((p) => <option key={p.id} value={p.id}>{p.text.slice(0, 50)}…</option>)}
        </select>
        <span style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)' }}>Alineación: {sel.oa}</span>
      </div>
      <div className="section-card" style={{ marginBottom: '12px', fontSize: '0.875rem' }}>{sel.text}</div>
      <textarea className="textarea" placeholder="Escribe tu texto aquí…" value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--fg-secondary)' }}>Palabras: {wordCount}</div>
    </SectionCard>
  );
}

function SessionPlanner({ onComplete }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          setMinutes((m) => {
            if (m === 0) {
              clearInterval(id);
              setRunning(false);
              onComplete && onComplete();
              return 0;
            }
            return m - 1;
          });
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setMinutes(25);
    setSeconds(0);
    setRunning(false);
  };

  const presets = [
    { label: "Vocab 10' + Lectura 15'", m: 25 },
    { label: "Escritura 20' + Corrección 10'", m: 30 },
    { label: "Repaso rápido 15'", m: 15 },
  ];

  return (
    <SectionCard icon={Timer} title="Sesión de estudio (Pomodoro)">
      <div className="flex-row" style={{ marginBottom: '12px' }}>
        {presets.map((p) => (
          <button key={p.label} className="button-secondary" onClick={() => { setMinutes(p.m); setSeconds(0); }}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="timer-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        {!running ? (
          <button className="button-primary" onClick={() => setRunning(true)}>Iniciar</button>
        ) : (
          <button className="button-primary" style={{ backgroundColor: '#dc2626' }} onClick={() => setRunning(false)}>Pausar</button>
        )}
        <button className="button-secondary" onClick={reset}>Reiniciar</button>
      </div>
    </SectionCard>
  );
}

function ProgressView({ progress }) {
  const sessions = progress.sessions || 0;
  const bestVocab = progress.bestVocab || 0;
  const lastScore = progress.lastVocabScore || 0;
  return (
    <SectionCard icon={Trophy} title="Progreso">
      <div className="progress-grid">
        <div className="progress-card">
          <div className="value">{sessions}</div>
          <div className="label">Sesiones completadas</div>
        </div>
        <div className="progress-card">
          <div className="value">{bestVocab}</div>
          <div className="label">Mejor puntaje vocab</div>
        </div>
        <div className="progress-card">
          <div className="value">{lastScore}</div>
          <div className="label">Último puntaje vocab</div>
        </div>
      </div>
    </SectionCard>
  );
}

function PracticeHub({ onSaveProgress }) {
  return (
    <div className="section-grid grid-2">
      <Flashcards />
      <VocabQuiz onFinish={(score, total) => onSaveProgress({ lastVocabScore: `${score}/${total}`, bestVocab: score })} />
      <ReadingComp />
      <WritingPrompts />
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('syllabus');
  const [progress, setProgress] = useProgress();
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try { localStorage.setItem('theme', darkMode ? 'dark' : 'light'); } catch {}
  }, [darkMode]);

  const saveProgress = (patch) => {
    setProgress((p) => {
      const next = { ...p };
      if (patch.lastVocabScore) next.lastVocabScore = patch.lastVocabScore;
      if (typeof patch.bestVocab === 'number') next.bestVocab = Math.max(p.bestVocab || 0, patch.bestVocab);
      return next;
    });
  };

  return (
    <div className="app-container">
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode((d) => !d)} />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'syllabus', label: 'Temario', icon: BookOpen },
          { value: 'practice', label: 'Práctica', icon: PenLine },
          { value: 'sessions', label: 'Sesiones', icon: Timer },
          { value: 'progress', label: 'Progreso', icon: Trophy },
        ]}
      />

      {tab === 'syllabus' && <SyllabusView />}
      {tab === 'practice' && <PracticeHub onSaveProgress={saveProgress} />}
      {tab === 'sessions' && (
        <div className="section-grid">
          <SessionPlanner onComplete={() => setProgress((p) => ({ ...p, sessions: (p.sessions || 0) + 1 }))} />
        </div>
      )}
      {tab === 'progress' && (
        <div className="section-grid">
          <ProgressView progress={progress} />
        </div>
      )}

      <footer className="footer">
        Hecho para estudiar desde el temario de 7° básico. Guarda en el navegador; no requiere internet.
      </footer>

      <style>{`
:root {
  --bg: #f8fafc;
  --bg-secondary: #ffffff;
  --fg: #1f2937;
  --fg-secondary: #4b5563;
  --primary: #0369a1;
  --primary-light: #e0f2fe;
  --border: #e5e7eb;
  --card-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.dark {
  --bg: #0f172a;
  --bg-secondary: #1e293b;
  --fg: #f1f5f9;
  --fg-secondary: #94a3b8;
  --primary: #38bdf8;
  --primary-light: #0ea5e9;
  --border: #334155;
  --card-shadow: 0 1px 4px rgba(0,0,0,0.5);
}
body {
  display: block;
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--fg);
  font-family: system-ui, sans-serif;
}
.app-container { background: var(--bg); color: var(--fg); min-height: 100vh; display: flex; flex-direction: column; }
.header { max-width: 1200px; margin: 0 auto; padding: 24px 16px 12px 16px; }
.header-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
.header-title { font-size: 1.5rem; font-weight: bold; margin: 0; }
.header-subtitle { font-size: 0.875rem; color: var(--fg-secondary); margin-top: 4px; }
.protip { font-size: 0.75rem; color: var(--fg-secondary); margin-top: 8px; }
.theme-toggle { background: var(--primary); color: white; border: none; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.theme-toggle:hover { background: var(--primary-light); color: var(--primary); }
.tabs { max-width: 1200px; margin: 0 auto; padding: 0 16px; margin-top: 8px; display: flex; gap: 4px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; }
.tab-button { flex: 1; padding: 8px; font-size: 0.875rem; border: none; background: transparent; color: var(--fg); cursor: pointer; border-radius: 8px; }
.tab-button.active { background: var(--primary); color: white; }
.section-grid { max-width: 1200px; margin: 0 auto; padding: 16px; display: grid; gap: 16px; }
.grid-2 { grid-template-columns: 1fr; }
.grid-3 { grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
}
.section-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 16px; padding: 16px; box-shadow: var(--card-shadow); }
.section-card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.section-card-title { font-size: 1.125rem; font-weight: 600; display: flex; align-items: center; gap: 8px; margin: 0; }
.section-card-actions { display: flex; gap: 8px; }
.pill { display: inline-block; padding: 2px 6px; margin: 2px; font-size: 0.75rem; border-radius: 9999px; background: var(--primary-light); color: var(--primary); }
.button-primary { background: var(--primary); color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.button-primary:hover { background: var(--primary-light); color: var(--primary); }
.button-secondary { background: var(--bg-secondary); color: var(--fg); border: 1px solid var(--border); padding: 6px 10px; border-radius: 8px; cursor: pointer; }
.button-secondary:hover { background: var(--border); }
.flex-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.select { padding: 6px 8px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-secondary); color: var(--fg); }
.flashcard-container { display: flex; flex-direction: column; align-items: center; }
.flashcard-box { width: 100%; max-width: 300px; height: 180px; position: relative; perspective: 1000px; }
.flashcard-box .card { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--card-shadow); text-align: center; font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); backface-visibility: hidden; }
.flashcard-box .card.back { background: var(--primary-light); }
.quiz-list { list-style: none; padding: 0; margin: 0; }
.quiz-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 12px; margin-bottom: 12px; }
.option-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.option-button { padding: 6px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-secondary); text-align: left; cursor: pointer; }
.option-button.selected { border-color: var(--primary); }
.option-button.correct { background: #dcfce7; }
.option-button.wrong { background: #fee2e2; }
.textarea { width: 100%; min-height: 180px; border: 1px solid var(--border); border-radius: 12px; padding: 12px; font-size: 0.875rem; background: var(--bg-secondary); color: var(--fg); }
.timer-display { font-size: 2.5rem; font-weight: bold; letter-spacing: 0.1em; text-align: center; margin: 16px 0; }
.progress-grid { display: grid; gap: 8px; }
@media (min-width: 640px) { .progress-grid { grid-template-columns: repeat(3, 1fr); } }
.progress-card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 12px; text-align: center; }
.progress-card .value { font-size: 1.5rem; font-weight: bold; }
.progress-card .label { font-size: 0.875rem; color: var(--fg-secondary); }
.footer { max-width: 1200px; margin: 0 auto; padding: 40px 16px; font-size: 0.75rem; color: var(--fg-secondary); text-align: center; }
.icon-sm { width: 20px; height: 20px; }
.perspective { perspective: 1000px; }
.backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
