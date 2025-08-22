import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, PenLine, Timer, Brain, Trophy, FileDown, RotateCcw, CheckCircle2 } from "lucide-react";

// Tailwind only styling. shadcn/ui is optional; we keep dependencies minimal for portability.

/**
 * English Study App – 7th Grade (CL curriculum)
 * Features:
 * - Syllabus viewer (OAs + suggested vocabulary)
 * - Practice hub: Flashcards, Vocab Quiz, Reading Comprehension, Writing Prompts
 * - Session planner: Pomodoro-style timer + quick study plans
 * - Progress tracking (localStorage)
 * - Worksheet generator (print-friendly)
 *
 * Data below was extracted/summarized from the provided PDF temario (Séptimo Básico, Inglés).
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
      "happy",
      "angry",
      "sad",
      "tired",
      "excited",
      "nervous",
      "nice",
      "annoyed",
      "bored",
      "upset",
      "glad",
      "kind",
      "friendly",
    ],
    activities: [
      "play sports",
      "go out",
      "surf the net",
      "play console games",
      "chat on the phone",
      "hang out",
      "play football",
      "do karate",
      "do athletics",
      "go swimming",
      "go skating",
    ],
    expressions: [
      "afraid of",
      "make friends",
      "make plans",
      "make a mistake",
      "give advice",
      "I'm fed up with",
      "I'm sorry to hear that",
      "see you later",
      "see you soon",
      "I feel … because …",
    ],
    food: [
      "apple",
      "orange",
      "banana",
      "lemon",
      "grape",
      "tomato",
      "potato",
      "lettuce",
      "cabbage",
      "carrot",
      "meat",
      "chicken",
      "egg",
      "pasta",
      "pizza",
      "rice",
      "salad",
      "sandwich",
      "biscuit",
      "bread",
      "cake",
      "butter",
      "cheese",
      "chocolate",
      "ice cream",
      "coffee",
      "juice",
      "milk",
      "water",
      "tea",
    ],
    sports: [
      "football",
      "tennis",
      "basketball",
      "volleyball",
      "running",
      "climbing",
      "skating",
      "aerobics",
      "karate",
      "athletics",
      "gymnastics",
      "skateboarding",
    ],
    equipment: ["sneakers", "ball", "bat", "stick", "helmet"],
    places: ["court", "pitch", "stadium", "track", "pool"],
    environment: [
      "environment",
      "plastic",
      "glass",
      "metal",
      "second hand",
      "factory",
      "outdoors",
      "countryside",
      "wildfire",
      "earthquake",
      "forest",
      "lake",
      "sea",
      "pollution",
      "temperature",
      "smog",
      "waste",
      "cut down",
      "destroy",
      "contaminate",
      "natural resources",
      "protect",
      "save",
      "pollute",
      "global problems",
      "garbage",
      "plant trees",
      "trash",
      "litter",
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

// --- Components ---
function Pill({ children }) {
  return (
    <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700 text-xs mr-2 mb-2 inline-block">
      {children}
    </span>
  );
}

function SectionCard({ icon: Icon, title, children, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow p-4 sm:p-5 border border-gray-100"
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-lg font-semibold flex items-center gap-2 flex-wrap">
          {Icon && <Icon className="w-5 h-5" />} {title}
        </h3>
        <div className="flex gap-2 w-full sm:w-auto">{actions}</div>
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function Header() {
  return (
    <header className="mx-auto max-w-6xl px-3 sm:px-4 pt-6 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">English Study – 7° Básico</h1>
          <p className="text-gray-600 text-sm">
            Basado en el temario oficial. Practica vocabulario, lectura y escritura. Guarda tu avance.
          </p>
        </div>
        <div className="text-right text-xs text-gray-500 hidden sm:block">
          <p>Pro tip: usa “Imprimir” del navegador para fichas/guías.</p>
        </div>
      </div>
    </header>
  );
}

function Tabs({ value, onChange, items }) {
  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4">
      <div className="flex gap-2 bg-white rounded-xl p-1 shadow border border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none">
        {items.map((it) => (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={`px-4 py-2 rounded-lg transition text-sm font-medium flex-shrink-0 ${
              value === it.value ? "bg-sky-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {it.icon && <it.icon className="w-4 h-4" />} {it.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SyllabusView() {
  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 grid md:grid-cols-2 gap-4 mt-4">
      {SYLLABUS.objectives.map((oa) => (
        <SectionCard key={oa.id} icon={BookOpen} title={`${oa.title}`}>
          <p className="text-gray-700 mb-3 text-sm sm:text-base">{oa.desc}</p>
          <div className="flex flex-wrap">
            {oa.indicators.map((ind, idx) => (
              <Pill key={idx}>{ind}</Pill>
            ))}
          </div>
        </SectionCard>
      ))}
      <SectionCard icon={Brain} title="Vocabulario sugerido">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(SYLLABUS.vocabulary).map(([cat, words]) => (
            <div key={cat} className="bg-gray-50 rounded-xl p-3">
              <h4 className="font-semibold capitalize mb-2">{cat}</h4>
              <div className="flex flex-wrap">
                {words.map((w) => (
                  <Pill key={w}>{w}</Pill>
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
      cards: words.map((w) => ({ front: w, back: w })),
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

  return (
    <SectionCard icon={Brain} title="Flashcards de vocabulario">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="text-sm">Lista:</label>
        <select
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          value={deckId}
          onChange={(e) => setDeckId(e.target.value)}
        >
          {decks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIdx(Math.floor(Math.random() * deck.cards.length))}
          className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 w-full sm:w-auto"
        >
          Aleatorio
        </button>
      </div>
      <div className="flex flex-col items-center">
        <motion.div
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md h-64 sm:h-48 perspective"
          onClick={() => setFlipped((f) => !f)}
        >
          <div className={`relative w-full h-full text-center cursor-pointer`}>
            <div className={`absolute inset-0 backface-hidden flex items-center justify-center rounded-2xl shadow border ${
              flipped ? "hidden" : ""
            } bg-white text-2xl font-bold`}
            >
              {deck.cards[idx].front}
            </div>
            <div className={`absolute inset-0 backface-hidden flex items-center justify-center rounded-2xl shadow border ${
              flipped ? "" : "hidden"
            } bg-sky-50 text-2xl font-bold`}
            >
              {deck.cards[idx].back}
            </div>
          </div>
        </motion.div>
        <div className="mt-4 flex gap-2 w-full">
          <button className="px-4 py-2 rounded-lg bg-sky-600 text-white w-full sm:w-auto" onClick={next}>
            Siguiente
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function VocabQuiz({ onFinish }) {
  const allWords = Object.values(SYLLABUS.vocabulary).flat();
  const [questions, setQuestions] = useState(() => buildQuestions());
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function buildQuestions() {
    const qs = pickN(allWords, 8).map((word) => {
      const wrong = pickN(allWords.filter((w) => w !== word), 3);
      const opts = shuffle([word, ...wrong]);
      // Spanish hint via simple template (teacher can change later)
      const hint = `Selecciona la palabra que corresponde en inglés: “${word}”`;
      return { word, opts, hint, correct: opts.indexOf(word) };
    });
    return qs;
  }

  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0);
  }, [submitted, answers, questions]);

  return (
    <SectionCard icon={Trophy} title="Quiz de vocabulario (8 preguntas)" actions={[
      <button key="regen" className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2 w-full sm:w-auto" onClick={() => { setQuestions(buildQuestions()); setAnswers({}); setSubmitted(false); }}>
        <RotateCcw className="w-4 h-4"/> Nuevo
      </button>
    ]}>
      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li key={i} className="bg-white border rounded-xl p-3">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">P{i + 1}.</span> {q.hint}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.opts.map((opt, j) => {
                const selected = answers[i] === j;
                const isCorrect = submitted && j === q.correct;
                const isWrong = submitted && selected && j !== q.correct;
                return (
                  <button
                    key={j}
                    onClick={() => !submitted && setAnswers({ ...answers, [i]: j })}
                    className={`px-3 py-2 rounded-lg border text-left w-full ${
                      selected ? "border-sky-600" : "border-gray-200"
                    } ${submitted && isCorrect ? "bg-green-50" : ""} ${submitted && isWrong ? "bg-red-50" : ""}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {!submitted ? (
          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white w-full sm:w-auto"
          >
            Enviar
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <CheckCircle2 className="w-5 h-5" /> Puntaje: {score}/{questions.length}
            </div>
            <button
              onClick={() => {
                setQuestions(buildQuestions());
                setAnswers({});
                setSubmitted(false);
              }}
              className="px-3 py-2 rounded-lg bg-gray-100 w-full sm:w-auto"
            >
              Repetir
            </button>
            {onFinish && (
              <button onClick={() => onFinish(score, questions.length)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white w-full sm:w-auto">
                Guardar avance
              </button>
            )}
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
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="text-sm">Texto:</label>
        <select className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto" value={p.id} onChange={(e) => {
          const next = READING_PASSAGES.find((x) => x.id === Number(e.target.value));
          setP(next || READING_PASSAGES[0]);
          setAnswers({});
          setSubmitted(false);
        }}>
          {READING_PASSAGES.map((x) => (
            <option key={x.id} value={x.id}>{x.title}</option>
          ))}
        </select>
      </div>
      <article className="bg-gray-50 rounded-xl p-4 leading-relaxed mb-4 text-sm sm:text-base">
        {p.text}
      </article>
      <ol className="space-y-3">
        {p.questions.map((q, i) => (
          <li key={i} className="bg-white border rounded-xl p-3">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">P{i + 1}.</span> {q.q}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, j) => {
                const selected = answers[i] === j;
                const isCorrect = submitted && j === q.a;
                const isWrong = submitted && selected && j !== q.a;
                return (
                  <button
                    key={j}
                    onClick={() => !submitted && setAnswers({ ...answers, [i]: j })}
                    className={`px-3 py-2 rounded-lg border text-left w-full ${
                      selected ? "border-sky-600" : "border-gray-200"
                    } ${submitted && isCorrect ? "bg-green-50" : ""} ${submitted && isWrong ? "bg-red-50" : ""}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center gap-3">
        {!submitted ? (
          <button className="px-4 py-2 rounded-lg bg-sky-600 text-white w-full sm:w-auto" onClick={() => setSubmitted(true)}>
            Enviar
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <CheckCircle2 className="w-5 h-5" /> Puntaje: {score}/{p.questions.length}
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
    { id: 3, text: "Give advice to a friend who feels nervous before a test. Use expressions (give advice, I\\'m sorry to hear that, see you soon).", oa: "OA16 (expresiones comunes)" },
    { id: 4, text: "Explain a simple cause-and-effect situation (e.g., If you heat ice cream, it melts). Give two more examples.", oa: "OA16 (if, causa-efecto)" },
  ];

  const [sel, setSel] = useState(PROMPTS[0]);
  const [text, setText] = useState("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <SectionCard icon={PenLine} title="Escritura guiada (OA13–OA16)" actions={[
      <button key="print" onClick={() => window.print()} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2 w-full sm:w-auto">
        <FileDown className="w-4 h-4"/> Imprimir hoja
      </button>
    ]}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-sm">Indicación:</label>
        <select className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto" value={sel.id} onChange={(e) => setSel(PROMPTS.find(p => p.id === Number(e.target.value)) || PROMPTS[0])}>
          {PROMPTS.map((p) => (
            <option key={p.id} value={p.id}>{p.text.slice(0, 50)}…</option>
          ))}
        </select>
        <span className="text-xs text-gray-600">Alineación: {sel.oa}</span>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 text-sm mb-2">{sel.text}</div>
      <textarea
        className="w-full min-h-[180px] border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm sm:text-base"
        placeholder="Escribe tu texto aquí…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-2 text-sm text-gray-600">Palabras: {wordCount}</div>
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
      <div className="flex flex-wrap gap-2 mb-3">
        {presets.map((p) => (
          <button key={p.label} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm w-full sm:w-auto" onClick={() => { setMinutes(p.m); setSeconds(0); }}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="text-5xl font-bold tracking-widest text-center my-4">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        {!running ? (
          <button className="px-4 py-2 rounded-lg bg-sky-600 text-white w-full sm:w-auto" onClick={() => setRunning(true)}>
            Iniciar
          </button>
        ) : (
          <button className="px-4 py-2 rounded-lg bg-rose-600 text-white w-full sm:w-auto" onClick={() => setRunning(false)}>
            Pausar
          </button>
        )}
        <button className="px-4 py-2 rounded-lg bg-gray-100 w-full sm:w-auto" onClick={reset}>Reiniciar</button>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{sessions}</div>
          <div className="text-sm text-gray-600">Sesiones completadas</div>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{bestVocab}</div>
          <div className="text-sm text-gray-600">Mejor puntaje vocab</div>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <div className="text-3xl font-bold">{lastScore}</div>
          <div className="text-sm text-gray-600">Último puntaje vocab</div>
        </div>
      </div>
    </SectionCard>
  );
}

function PracticeHub({ onSaveProgress }) {
  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 grid md:grid-cols-2 gap-4 mt-4">
      <Flashcards />
      <VocabQuiz onFinish={(score, total) => onSaveProgress({ lastVocabScore: `${score}/${total}`, bestVocab: score })} />
      <ReadingComp />
      <WritingPrompts />
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("syllabus");
  const [progress, setProgress] = useProgress();

  const saveProgress = (patch) => {
    setProgress((p) => {
      const next = { ...p };
      if (patch.lastVocabScore) next.lastVocabScore = patch.lastVocabScore;
      if (typeof patch.bestVocab === "number") next.bestVocab = Math.max(p.bestVocab || 0, patch.bestVocab);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "syllabus", label: "Temario", icon: BookOpen },
          { value: "practice", label: "Práctica", icon: PenLine },
          { value: "sessions", label: "Sesiones", icon: Timer },
          { value: "progress", label: "Progreso", icon: Trophy },
        ]}
      />

      {tab === "syllabus" && <SyllabusView />}
      {tab === "practice" && <PracticeHub onSaveProgress={saveProgress} />}
      {tab === "sessions" && (
        <div className="mx-auto max-w-6xl px-3 sm:px-4 mt-4">
          <SessionPlanner onComplete={() => setProgress((p) => ({ ...p, sessions: (p.sessions || 0) + 1 }))} />
        </div>
      )}
      {tab === "progress" && (
        <div className="mx-auto max-w-6xl px-3 sm:px-4 mt-4">
          <ProgressView progress={progress} />
        </div>
      )}

      <footer className="mx-auto max-w-6xl px-3 sm:px-4 py-10 text-center text-xs text-gray-500">
        Hecho para estudiar desde el temario de 7° básico. Guarda en el navegador; no requiere internet.
      </footer>

      <style>{`
        .perspective { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
