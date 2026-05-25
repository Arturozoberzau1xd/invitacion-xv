import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { FaAmazon, FaGift } from "react-icons/fa";

const CONFIG = {
  nombrePrincipal: "XV Años de Zury Urbina Benitez", 
  subtitulo: "Una celebración inolvidable",

  fechaEvento: {
    year: 2026,
    month: 7,
    day: 3,
    hour: 4,      
    minute: 0,    
  },

  ceremoniaHora: "16:30 hrs",
  recepcionHora: "6:00 PM a 1:00 AM",
  coloresReservados: "Champagne, plateado y dorado",
  codigoVestimenta: "Formal",
  vestimentaDetalle: [
    "Damas: Vestido largo",
    "Caballeros: Traje"
  ],

  /* Configuración de Padres y Padrinos */
  padres: [
    "Zivec Nelly Benítez Tavera",
    "Iván Urbina Hernández"
  ],
  padrinos: [
    "María de los Ángeles Eguiluz Tapia",
    "Juan Manuel Batres Campos"
  ],

  mesaLiverpool: "52001538",
  mesaAmazon: "https://www.amazon.com.mx/registries/gl/guest-view/UHVCJY8JA5M6?ref_=cm_sw_r_cp_ud_ggr-subnajv-share_YY4MNYPR7ZQCT468K9EE",
  mesaHierro: "https://www.elpalaciodehierro.com/celebra#/event/5000158",

  googleMapsUrl: "https://maps.app.goo.gl/dZLQFZMEBWcAn8mK7?g_st=ac",
  whatsappNumero: "527712168812",

  mensajeWhatsApp:
    "Hola, por este medio confirmo mi asistencia a los XV de Zury.\n\nNombre:\nNúmero de personas:\nNombre de familia:\nGracias.",

  musica: "/musica.mp3", 

  galeria: [
    "/galeria-1.jpg",
    "/galeria-2.jpg",
    "/galeria-3.jpg",
    "/galeria-4.jpg",
  ],
};

const CURSIVE_STYLE = {
  fontFamily: "'Brush Script MT', 'Great Vibes', 'Dancing Script', 'Lucida Handwriting', cursive",
  fontWeight: "normal",
  textTransform: "none",
  letterSpacing: "0",
  lineHeight: "1.2",
  textAlign: "center"
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
    return { dias: "00", horas: "00", minutos: "00", segundos: "00" };
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
  const [isAnimatingLogo, setIsAnimatingLogo] = useState(false);

  const whatsappLink = useMemo(() => {
    return `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(CONFIG.mensajeWhatsApp)}`;
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
    setTimeout(() => { setAbierta(true); }, 1500);
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

  const handleLogoClick = () => {
    setIsAnimatingLogo(true);
    setTimeout(() => setIsAnimatingLogo(false), 500);
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

            <div className={`rose-seal-interactive-wrapper ${isAnimatingLogo ? "logo-premium-pop" : ""}`} onClick={handleLogoClick}>
              <RoseSeal />
            </div>

            {/* 👇 "Mis XV" cursive title (enlarged and restyled for prominence) */}
            

            <h1>{CONFIG.nombrePrincipal}</h1>
            <p className="subtitle">{CONFIG.subtitulo}</p>
            <div className="line"></div>
            <p className="small-text">Zury Urbina Benitez</p>

            <button className="main-button open-button" onClick={abrirInvitacion} disabled={animacionApertura}>
              {animacionApertura ? "Abriendo..." : "Abrir invitación"}
            </button>
          </div>
        </section>
      ) : (
        <section className="invitation">
          <header className="hero">
            <div className="hero-content">
              <p className="hero-eyebrow">Nos complace invitarte a celebrar los</p>
              <h1>{CONFIG.nombrePrincipal}</h1>
              <p className="subtitle">Con gran alegría queremos compartir contigo este momento tan especial.</p>
            </div>
          </header>

          <Reveal>
            <section className="section countdown-section">
              <h2 style={{ ...CURSIVE_STYLE, fontSize: "3.4rem" }}>Cuenta regresiva</h2>
              <p className="event-date-display" style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: "1.6rem", 
                color: "#2c1f0b", 
                margin: "-5px 0 25px 0",
                letterSpacing: "1px",
                fontWeight: "600"
              }}>
                Viernes, 03 de Julio de 2026
              </p>
              <p className="section-label">faltan</p>
              <div className="countdown">
                <TimeBox value={timeLeft.dias} label="Días" />
                <TimeBox value={timeLeft.horas} label="Horas" />
                <TimeBox value={timeLeft.minutos} label="Minutos" />
                <TimeBox value={timeLeft.segundos} label="Segundos" />
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="section family-section cards-grid" style={{ paddingBottom: "20px" }}>
              <InfoCard 
                title="Mis Padres" 
                text={CONFIG.padres} 
              />
              <InfoCard 
                title="Mis Padrinos" 
                text={CONFIG.padrinos} 
              />
            </section>
          </Reveal>

          <Reveal>  
            <section className="section message-section">
              <h2 style={{ ...CURSIVE_STYLE, fontSize: "3.4rem" }}>Un momento especial</h2>
              <p>
                Hay momentos que se guardan para siempre en el corazón; por ello,
                queremos compartir contigo esta celebración llena de amor, alegría y elegancia.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="section cards-grid" style={{ paddingBottom: "40px" }}>
              <InfoCard title="Ceremonia religiosa" main={CONFIG.ceremoniaHora} text={<>Misa en la capilla del <br /> jardín del salón</>} />
              <InfoCard title="Recepción" main={CONFIG.recepcionHora} text={<>"Salon Veravia" <br /> Pachuca de Soto, Hgo</>} />

              <InfoCard title="Mesa de regalos" items={[
                { label: "Liverpool", value: CONFIG.mesaLiverpool, icon: <FaGift style={{ color: "#e6007e" }} />, isLink: false },
                { label: "Amazon", value: CONFIG.mesaAmazon, icon: <FaAmazon style={{ color: "#ff9900" }} />, isLink: true },
                { label: "Palacio de Hierro", value: CONFIG.mesaHierro, icon: <img src="/ph.jpg" alt="Palacio de Hierro" style={{ width: "24px", height: "24px" }} />, isLink: true }
              ]} />
              
              <InfoCard title="Código de vestimenta" main={CONFIG.codigoVestimenta} text={CONFIG.vestimentaDetalle} image="/silueta.jpg" />
            </section>
          </Reveal>

          <Reveal>
            <section className="section dress-section" style={{ paddingTop: "40px" }}>
              <p className="section-label">Colores reservados</p>
              <h2 style={{ ...CURSIVE_STYLE, fontSize: "3.4rem", margin: "0 0 10px 0" }}>Paleta del evento</h2>
              <p>Evitar los tonos champagne, dorado y plateado; se reservan para detalles especiales del evento.</p>
              <div className="color-palette">
                <div><span className="color champagne"></span><p>Champagne</p></div>
                <div><span className="color gold"></span><p>Dorado</p></div>
                <div><span className="color silver"></span><p>Plateado</p></div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="section gallery-section">
              <p className="section-label">Detalles</p>
              <h2 style={{ ...CURSIVE_STYLE, fontSize: "3.4rem" }}>Galería</h2>
              <div className="gallery-grid">
                {CONFIG.galeria.map((imagen) => (
                  <div 
                    className="gallery-item" 
                    key={imagen} 
                    style={{ backgroundImage: `url(${imagen})` }}
                  />
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="section location-section">
              <p className="section-label">Ubicación</p>
              <h2 style={{ ...CURSIVE_STYLE, fontSize: "3.4rem" }}>Te esperamos</h2>
              <p>Acompáñanos en este día tan especial. Puedes abrir la ubicación direcciónmente en Google Maps.</p>
              <a href={CONFIG.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="secondary-button">Ver ubicación</a>
            </section>
          </Reveal>

          <Reveal>
            <section className="section confirm-section">
              <p className="section-label">Confirmación</p>
              <h2 style={{ ...CURSIVE_STYLE, fontSize: "3.4rem" }}>Confirme su asistencia</h2>
              <p>Agradeceremos la confirmación de su asistencia por WhatsApp para tener todo preparado con mucho cariño.</p>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-button">Confirmar por WhatsApp</a>
            </section>
          </Reveal>

          <footer className="footer">
            <p>Gracias por ser parte de este momento tan especial.</p>
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

function InfoCard({ title, main, text, items, image }) {
  return (
    <article className="info-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px", boxSizing: "border-box" }}>
      <p className="card-title-label" style={{ ...CURSIVE_STYLE, margin: "0 0 12px 0", fontSize: "2.5rem" }}>
        {title}
      </p>

      {main && (
        <h3 style={{ textAlign: "center", margin: "0 0 8px 0", fontSize: "1.8rem", fontFamily: "'Cormorant Garamond', serif", fontWeight: "600", color: "#2c1f0b" }}>
          {main}
        </h3>
      )}
      
      {text && (
        <span style={{ textAlign: "center", display: "block", margin: "0 0 10px 0", fontSize: "1.05rem", width: "100%", color: "#4a3b2c", lineHeight: "1.4" }}>
          {Array.isArray(text) ? (
            text.map((linea, index) => (
              <span key={index} style={{ display: "block", marginBottom: index < text.length - 1 ? "8px" : "0" }}>
                {linea}
              </span>
            ))
          ) : (
            text
          )}
        </span>
      )}

      {image && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "6px" }}>
          <img src={image} alt="Ejemplo vestimenta" style={{ width: "105px", height: "auto", borderRadius: "12px", boxShadow: "0 3px 8px rgba(0,0,0,0.15)", display: "block" }} />
        </div>
      )}

      {items && (
        <ul className="gift-list" style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: "300px", margin: "10px auto 0 auto" }}>
          {items.map((item, i) => (
            <li key={i} style={{ 
              display: "grid", 
              gridTemplateColumns: "45px 1fr", 
              alignItems: "center",
              gap: "12px", 
              marginBottom: "12px",
              backgroundColor: "rgba(244, 241, 234, 0.6)", 
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                {item.icon}
              </span>
              <div style={{ fontSize: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", textAlign: "left" }}>
                <span style={{ fontWeight: "600", color: "#333", lineHeight: "1.2" }}>{item.label}</span>
                {item.isLink ? (
                  <a href={item.value} target="_blank" rel="noopener noreferrer" style={{ color: "#9b722f", textDecoration: "underline", fontWeight: "bold", fontSize: "0.85rem", marginTop: "2px", paddingLeft: "67px" }}>
                    Ir a la mesa
                  </a>
                ) : (
                  <span style={{ color: "#666", fontSize: "0.9rem" }}>No. {item.value}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function FloatingPetals() {
  return (
    <div className="petals-container">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} className={`petal petal-${index + 1}`}>✦</span>
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(element);
      }
    }, { threshold: 0.18 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${visible ? "show" : ""}`}>{children}</div>;
}

function RoseSeal() {
  return (
    <div className="rose-seal-premium" aria-label="Logo XV Años Zury">
      <div className="seal-glow-core"></div>
      <div className="seal-glow-flare"></div>
      {/* 🛑 "seal-image-frame" style is updated to hide the border */}
      <div className="seal-image-frame" style={{ border: 'none', boxShadow: 'none' }}>
        <img src="/rosaschampa.jpg" alt="Zury Urbina Benitez" className="rose-seal-image" style={{ border: 'none', boxShadow: 'none' }} />
        <div className="seal-shimmer"></div>
      </div>
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