import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const CONFIG = {
  nombrePrincipal: "XV Años de ",
  subtitulo: "Una celebración inolvidable",

  fechaEvento: {
    year: 2026,
    month: 7,
    day: 3,
    hour: 16,
    minute: 30,
  },

  ceremoniaHora: "16:30 hrs",
  ceremoniaLugar: "Misa en la capilla del jardín del salón",

  recepcionHora: "6:00 PM a 1:00 AM",
  recepcionLugar: "Salón / Jardín del evento",

  coloresReservados: "Champagne, plateado y dorado",
  codigoVestimenta: "Formal",
  vestimentaDetalle: "Caballeros: traje · Damas: vestido largo",

  mesaLiverpool: "52001538",
  mesaAmazon: "Pendiente por agregar",

  googleMapsUrl: "https://maps.google.com/",
  whatsappNumero: "527712168812",

  mensajeWhatsApp:
    "Hola, por este medio confirmo mi asistencia al evento.\n\nNombre:\nNúmero de personas:\nGracias.",

  musica: "/musica.mp3",

  galeria: [
    "/galeria-1.jpg",
    "/galeria-2.jpg",
    "/galeria-3.jpg",
    "/galeria-4.jpg",
  ],
};

function createLocalEventDate(eventDate) {
  return new Date(
    eventDate.year,
    eventDate.month - 1,
    eventDate.day,
    eventDate.hour,
    eventDate.minute,
    0
  );
}

function getTimeLeft(eventDate) {
  const target = createLocalEventDate(eventDate);
  const now = new Date();

  const difference = target.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      dias: "00",
      horas: "00",
      minutos: "00",
      segundos: "00",
    };
  }

  const totalSeconds = Math.floor(difference / 1000);

  const dias = Math.floor(totalSeconds / (60 * 60 * 24));
  const horas = Math.floor((totalSeconds / (60 * 60)) % 24);
  const minutos = Math.floor((totalSeconds / 60) % 60);
  const segundos = totalSeconds % 60;

  return {
    dias: String(dias).padStart(2, "0"),
    horas: String(horas).padStart(2, "0"),
    minutos: String(minutos).padStart(2, "0"),
    segundos: String(segundos).padStart(2, "0"),
  };
}

function App() {
  const audioRef = useRef(null);

  const [abierta, setAbierta] = useState(false);
  const [animacionApertura, setAnimacionApertura] = useState(false);
  const [musicaActiva, setMusicaActiva] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(CONFIG.fechaEvento));

  const whatsappLink = useMemo(() => {
    return `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(
      CONFIG.mensajeWhatsApp
    )}`;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(CONFIG.fechaEvento));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const abrirInvitacion = async () => {
  if (animacionApertura) return;

  setAnimacionApertura(true);

  try {
    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      await audioRef.current.play();
      setMusicaActiva(true);
    }
  } catch {
    setMusicaActiva(false);
  }

  setTimeout(() => {
    setAbierta(true);
  }, 1500);
};

  const toggleMusica = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setMusicaActiva(true);
      } catch {
        setMusicaActiva(false);
      }
    } else {
      audioRef.current.pause();
      setMusicaActiva(false);
    }
  };

  return (
    <main className="page">
      <audio ref={audioRef} src={CONFIG.musica} loop preload="auto" />

      <FloatingPetals />

      {abierta && (
        <button className="music-button" onClick={toggleMusica}>
          {musicaActiva ? "♫" : "♪"}
        </button>
      )}

      {!abierta ? (
        <section className={`cover ${animacionApertura ? "cover-opening" : ""}`}>
  <div className="sparkles"></div>

  <div className={`cover-card ${animacionApertura ? "card-opening" : ""}`}>
    <PetalExplosion active={animacionApertura} />

    <p className="eyebrow">Estás cordialmente invitado</p>

    <RoseSeal />

    <h1>{CONFIG.nombrePrincipal}</h1>
    <p className="subtitle">{CONFIG.subtitulo}</p>

    <div className="line"></div>

    <p className="small-text">
      Champagne · Dorado · Plateado · Rosas
    </p>

    <button
      className="main-button open-button"
      onClick={abrirInvitacion}
      disabled={animacionApertura}
    >
      {animacionApertura ? "Abriendo..." : "Abrir invitación"}
    </button>
  </div>
</section>
      ) : (
        <section className="invitation">
          <header className="hero">
            <div className="hero-content">
              <p className="eyebrow">Nos complace invitarte</p>
              <h1>{CONFIG.nombrePrincipal}</h1>
              <p className="subtitle">
                Con gran alegría queremos compartir contigo este momento tan
                especial.
              </p>
            </div>
          </header>

          <Reveal>
            <section className="section countdown-section">
              <p className="section-label">Faltan</p>
              <h2>Cuenta regresiva</h2>

              <div className="countdown">
                <TimeBox value={timeLeft.dias} label="Días" />
                <TimeBox value={timeLeft.horas} label="Horas" />
                <TimeBox value={timeLeft.minutos} label="Minutos" />
                <TimeBox value={timeLeft.segundos} label="Segundos" />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="section message-section">
              <p className="section-label">Con cariño</p>
              <h2>Un momento especial</h2>
              <p>
                Hay momentos que se guardan para siempre en el corazón. Por eso,
                queremos compartir contigo esta celebración llena de amor,
                alegría y elegancia.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="section cards-grid">
              <InfoCard
                title="Ceremonia religiosa"
                main={CONFIG.ceremoniaHora}
                text={CONFIG.ceremoniaLugar}
              />

              <InfoCard
                title="Recepción"
                main={CONFIG.recepcionHora}
                text={CONFIG.recepcionLugar}
              />

              <InfoCard
                title="Código de vestimenta"
                main={CONFIG.codigoVestimenta}
                text={CONFIG.vestimentaDetalle}
              />

              <InfoCard
                title="Mesa de regalos"
                main={`Liverpool: ${CONFIG.mesaLiverpool}`}
                text={`Amazon: ${CONFIG.mesaAmazon}`}
              />
            </section>
          </Reveal>

          <Reveal>
            <section className="section dress-section">
              <p className="section-label">Colores reservados</p>
              <h2>Paleta del evento</h2>
              <p>
                Se reservan los tonos champagne, dorado y plateado para detalles
                especiales del evento.
              </p>

              <div className="color-palette">
                <div>
                  <span className="color champagne"></span>
                  <p>Champagne</p>
                </div>
                <div>
                  <span className="color gold"></span>
                  <p>Dorado</p>
                </div>
                <div>
                  <span className="color silver"></span>
                  <p>Plateado</p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="section gallery-section">
              <p className="section-label">Detalles</p>
              <h2>Galería</h2>

              <div className="gallery-grid">
                {CONFIG.galeria.map((imagen, index) => (
                  <div
                    className="gallery-item"
                    key={imagen}
                    style={{ backgroundImage: `url(${imagen})` }}
                  >
                    <span>0{index + 1}</span>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="section location-section">
              <p className="section-label">Ubicación</p>
              <h2>Te esperamos</h2>
              <p>
                Acompáñanos en este día tan especial. Puedes abrir la ubicación
                directamente en Google Maps.
              </p>

              <a
                href={CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button"
              >
                Ver ubicación
              </a>
            </section>
          </Reveal>

          <Reveal>
            <section className="section confirm-section">
              <p className="section-label">Confirmación</p>
              <h2>Confirma tu asistencia</h2>
              <p>
                Agradeceremos nos confirmes tu asistencia por WhatsApp para
                tener todo preparado con mucho cariño.
              </p>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                Confirmar por WhatsApp
              </a>
            </section>
          </Reveal>

          <footer className="footer">
            <p>Gracias por ser parte de este momento especial.</p>
          </footer>
        </section>
      )}
    </main>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="time-box">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function InfoCard({ title, main, text }) {
  return (
    <article className="info-card">
      <div className="flower-corner"></div>
      <p>{title}</p>
      <h3>{main}</h3>
      <span>{text}</span>
    </article>
  );
}

function FloatingPetals() {
  return (
    <div className="petals-container">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} className={`petal petal-${index + 1}`}>
          ✦
        </span>
      ))}
    </div>
  );
}

function Reveal({ children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "show" : ""}`}>
      {children}
    </div>
  );
}
function RoseSeal() {
  return (
    <div className="rose-seal" aria-hidden="true">
      <div className="rose-glow"></div>

      <svg viewBox="0 0 180 180" className="rose-svg">
        <defs>
          <linearGradient id="goldRose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2bd" />
            <stop offset="45%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9b722f" />
          </linearGradient>

          <linearGradient id="silverLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#cfcfd1" />
            <stop offset="100%" stopColor="#8f9094" />
          </linearGradient>
        </defs>

        <circle cx="90" cy="90" r="76" className="rose-ring" />

        <path
          className="rose-petal"
          d="M90 46C70 48 58 63 63 79C68 94 84 96 90 84C96 96 112 94 117 79C122 63 110 48 90 46Z"
        />
        <path
          className="rose-petal petal-two"
          d="M65 83C47 91 43 112 58 124C73 136 89 123 84 106C70 108 61 99 65 83Z"
        />
        <path
          className="rose-petal petal-three"
          d="M115 83C133 91 137 112 122 124C107 136 91 123 96 106C110 108 119 99 115 83Z"
        />
        <path
          className="rose-center"
          d="M90 72C77 75 75 91 87 98C100 106 111 92 103 81C100 76 96 73 90 72Z"
        />

        <path
          className="rose-stem"
          d="M90 105C88 126 87 139 83 154"
        />
        <path
          className="rose-leaf"
          d="M86 128C65 120 52 130 45 145C63 148 77 143 86 128Z"
        />
        <path
          className="rose-leaf leaf-two"
          d="M94 134C113 124 129 132 138 145C121 151 103 147 94 134Z"
        />
      </svg>
    </div>
  );
}

function PetalExplosion({ active }) {
  return (
    <div className={`petal-explosion ${active ? "petal-explosion-active" : ""}`}>
      {Array.from({ length: 24 }).map((_, index) => (
        <span key={index} className={`burst-petal burst-petal-${index + 1}`} />
      ))}
    </div>
  );
}
export default App;