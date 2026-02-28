import { useState, useEffect, useRef, useCallback } from "react";

const MIYAKEI = () => {
  const [loaded, setLoaded] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [activeLayer, setActiveLayer] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const bootSequence = `$ miyakei --scan-os --target=world
> Initializing PC metaphor engine...
> Scanning BIOS layer.......... [儒教 1000yr detected]
> Scanning OS layer............ [GHQ-Mac | Hackintosh | Linux | CCP-Dual]
> Scanning wallpaper layer..... [反日 | 日本すごい | 自己責任 | 平和国家]
> Scanning driver layer........ [WARNING: 反日 disguised as wallpaper]
> Fertility rate anomaly....... [KR:0.72 | JP:1.20 | TW:1.07]
> Root cause identified........ [序列 BIOS bottleneck]
> 
> ██████████████████████ Analysis complete.
> 10 nations mapped. 4 languages ready.
> Run 'miyakei --listen' to begin._`;

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 5;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    const count = 120;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const glow = (Math.sin(p.pulse) + 1) / 2;
        const alpha = p.opacity * (0.5 + glow * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + glow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Boot sequence typing
  useEffect(() => {
    setLoaded(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i <= bootSequence.length) {
        setTerminalText(bootSequence.slice(0, i));
        i++;
      } else clearInterval(timer);
    }, 14);
    const cursorTimer = setInterval(() => setShowCursor(p => !p), 530);
    return () => { clearInterval(timer); clearInterval(cursorTimer); };
  }, []);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const countries = [
    { code: "JP", name: "日本", os: "GHQ製Mac（機能制限版）", wallpaper: "5枚重ね", rating: "S", fertility: "1.20", desc: "麻痺。気づいてない", color: "#F43F5E" },
    { code: "KR", name: "韓国", os: "Hackintosh（日本製カーネル）", wallpaper: "反日（ドライバ化）", rating: "S+++", fertility: "0.72", desc: "日本製エンジンで日本と勝負", color: "#3B82F6" },
    { code: "TW", name: "台湾", os: "Linux（自選OS）", wallpaper: "なし", rating: "B+", fertility: "1.07", desc: "OS健全。環境がキツい", color: "#10B981" },
    { code: "CN", name: "中国", os: "共産党デュアルOS", wallpaper: "反日（ON/OFF可）", rating: "S+", fertility: "1.09", desc: "寝そべり族", color: "#EF4444" },
    { code: "SG", name: "シンガポール", os: "効率特化OS", wallpaper: "—", rating: "B", fertility: "1.04", desc: "序列を実力に書換", color: "#F59E0B" },
    { code: "VN", name: "ベトナム", os: "闘争OS", wallpaper: "—", rating: "C+", fertility: "1.94", desc: "闘争が序列を部分破壊", color: "#A855F7" },
    { code: "TH", name: "タイ", os: "自前OS+仏教", wallpaper: "—", rating: "D+", fertility: "1.33", desc: "仏教が序列を溶かす", color: "#F97316" },
    { code: "PH", name: "フィリピン", os: "自前OS+カトリック", wallpaper: "—", rating: "F+", fertility: "2.75", desc: "序列なし。自由", color: "#06B6D4" },
    { code: "US", name: "米国", os: "設計者側", wallpaper: "—", rating: "—", fertility: "—", desc: "他国のOS書く側", color: "#6366F1" },
  ];

  const episodes = [
    { num: "01", title: "あなたの国のOSは誰が書いたか", guest: null, tag: "導入", duration: "38:00" },
    { num: "02", title: "韓国の反日は壁紙か、ドライバか", guest: "キム・ジュンホ", tag: "韓国", duration: "45:00" },
    { num: "03", title: "自己責任という最高傑作壁紙", guest: "心理学者AI", tag: "日本", duration: "42:00" },
    { num: "04", title: "台湾が唯一Linuxになれた理由", guest: "リン・メイファ", tag: "台湾", duration: "40:00" },
    { num: "05", title: "儒教BIOSと出生率崩壊", guest: "人口学者AI", tag: "東アジア", duration: "50:00" },
    { num: "06", title: "朴正煕——自分の設計を隠した男", guest: null, tag: "韓国", duration: "47:00" },
    { num: "07", title: "アメリカは韓国に興味がなかった", guest: "米国政治学者AI", tag: "米韓", duration: "44:00" },
    { num: "08", title: "人口10万の国民と脱北者のLINE", guest: null, tag: "日本", duration: "35:00" },
  ];

  const layers = [
    { name: "アプリ層", sub: "APPLICATION", desc: "経済活動、文化、日常行動", depth: "表層", color: "#06B6D4", bg: "rgba(6,182,212,0.08)" },
    { name: "壁紙層", sub: "WALLPAPER", desc: "反日、日本すごい、自己責任、平和国家…", depth: "表層〜中層", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
    { name: "OS層", sub: "OPERATING SYSTEM", desc: "GHQ-Mac / Hackintosh / Linux / 共産党OS", depth: "中層", color: "#F43F5E", bg: "rgba(244,63,94,0.08)" },
    { name: "BIOS層", sub: "BASIC I/O SYSTEM", desc: "儒教。1000年分。東アジア共通。書き換え最難。", depth: "最深部", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  ];

  const funnel = [
    { step: "①", name: "YouTube / Podcast", price: "無料", desc: "音声本編 30-60分", color: "#06B6D4" },
    { step: "②", name: "miyakei.com Blog", price: "無料", desc: "要約＋用語辞典＋SEO", color: "#10B981" },
    { step: "③", name: "note 有料記事", price: "¥300-500", desc: "全文＋図解＋未公開パート", color: "#8B5CF6" },
    { step: "④", name: "Kindle 書籍", price: "¥1,000-1,500", desc: "編集済み完成版", color: "#F59E0B" },
    { step: "⑤", name: "天野紗希 鑑定", price: "¥3,000-10,000", desc: "個人OS診断", color: "#F43F5E" },
  ];

  return (
    <div style={{
      background: "#0C1222",
      color: "#CBD5E1",
      fontFamily: "'Noto Sans JP', sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&family=Fira+Code:wght@400;500;700&family=Sora:wght@300;400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0C1222; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 2px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes scan { 0% { top:-5%; } 100% { top:105%; } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        @keyframes glow { 0%,100% { box-shadow:0 0 5px rgba(6,182,212,0.1); } 50% { box-shadow:0 0 20px rgba(6,182,212,0.2); } }
        @keyframes borderGlow { 0%,100% { border-color:rgba(6,182,212,0.15); } 50% { border-color:rgba(6,182,212,0.4); } }
        @keyframes waveMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        .section-tag {
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #06B6D4;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-tag::before {
          content: '';
          display: inline-block;
          width: 20px;
          height: 1px;
          background: #06B6D4;
        }

        .nav-item {
          color: #64748B;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.08em;
          font-family: 'Fira Code', monospace;
          cursor: pointer;
          transition: all 0.3s;
          padding: 6px 0;
          position: relative;
        }
        .nav-item:hover { color: #E2E8F0; }
        .nav-item:hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: #06B6D4;
        }

        .country-row {
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer;
          border-left: 3px solid transparent;
        }
        .country-row:hover {
          background: rgba(6,182,212,0.04);
          border-left-color: #06B6D4;
        }

        .ep-card {
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          cursor: pointer;
          position: relative;
        }
        .ep-card:hover {
          transform: translateX(8px);
          background: rgba(6,182,212,0.04);
        }
        .ep-card:hover .play-btn {
          background: #06B6D4;
          color: #0C1222;
          transform: scale(1.1);
        }

        .layer-block {
          transition: all 0.4s;
          cursor: pointer;
        }
        .layer-block:hover {
          transform: scale(1.01);
        }

        .funnel-step {
          transition: all 0.35s;
          cursor: pointer;
        }
        .funnel-step:hover {
          transform: translateY(-4px);
        }

        .lang-card {
          transition: all 0.4s;
          cursor: pointer;
          animation: glow 4s ease-in-out infinite;
        }
        .lang-card:hover {
          transform: translateY(-6px) scale(1.02);
          border-color: rgba(6,182,212,0.5);
        }

        .platform-badge {
          transition: all 0.3s;
          cursor: pointer;
        }
        .platform-badge:hover {
          background: rgba(6,182,212,0.12);
          border-color: rgba(6,182,212,0.4);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }} />

      {/* Animated gradient overlay */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.04) 0%, transparent 50%)",
        backgroundSize: "200% 200%",
        animation: "waveMove 15s ease infinite",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Scan line */}
      <div style={{
        position: "fixed", left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.08), transparent)",
        animation: "scan 6s linear infinite",
        pointerEvents: "none", zIndex: 2,
      }} />

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "18px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: scrollY > 60 ? "rgba(12,18,34,0.92)" : "transparent",
        backdropFilter: scrollY > 60 ? "blur(24px)" : "none",
        borderBottom: scrollY > 60 ? "1px solid rgba(6,182,212,0.1)" : "1px solid transparent",
        transition: "all 0.5s",
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "24px",
          letterSpacing: "0.12em",
        }}>
          <span style={{ color: "#06B6D4" }}>MIYA</span>
          <span style={{ color: "#E2E8F0" }}>KEI</span>
          <span style={{ color: "#1E3A5F", fontSize: "10px", marginLeft: "8px", fontFamily: "'Fira Code'", fontWeight: 400, letterSpacing: "0.05em" }}>v2.0</span>
        </div>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {["OS Map", "Episodes", "Blog", "Kindle", "About"].map((item, i) => (
            <span key={i} className="nav-item">{item}</span>
          ))}
          <div style={{
            padding: "8px 24px",
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.3)",
            color: "#06B6D4",
            fontSize: "12px",
            fontFamily: "'Fira Code', monospace",
            letterSpacing: "0.08em",
            cursor: "pointer",
            transition: "all 0.3s",
            borderRadius: "2px",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(6,182,212,0.2)"; e.target.style.borderColor = "#06B6D4"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(6,182,212,0.1)"; e.target.style.borderColor = "rgba(6,182,212,0.3)"; }}
          >▶ LISTEN</div>
        </div>
      </nav>

      {/* Content wrapper */}
      <div style={{ position: "relative", zIndex: 5 }}>

        {/* ===== HERO ===== */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "140px 48px 100px",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto", width: "100%" }}>
            <div className="section-tag" style={{ animation: loaded ? "fadeIn 1s 0.2s both" : "none" }}>
              世界OS地図プロジェクト — MIYAKEI
            </div>
            <h1 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "clamp(40px, 6.5vw, 76px)",
              fontWeight: 800, lineHeight: 1.08, marginBottom: "28px",
              animation: loaded ? "fadeUp 0.8s 0.4s both" : "none",
            }}>
              <span style={{ color: "#E2E8F0" }}>あなたの国の</span>
              <span style={{
                color: "#06B6D4",
                textShadow: "0 0 40px rgba(6,182,212,0.3)",
              }}>OS</span>
              <span style={{ color: "#E2E8F0" }}>は</span>
              <br />
              <span style={{ color: "#475569" }}>誰が書いたか？</span>
            </h1>
            <p style={{
              fontSize: "16px", lineHeight: 1.9, color: "#94A3B8",
              maxWidth: "560px", marginBottom: "52px", fontWeight: 300,
              animation: loaded ? "fadeUp 0.8s 0.6s both" : "none",
            }}>
              GHQ占領から始まる東アジアの精神構造を、PC比喩で解体する。
              <br />攻撃ゼロ、敬意100%。ただ構造を、見せる。
            </p>

            {/* Terminal */}
            <div style={{
              background: "rgba(12,18,34,0.8)",
              border: "1px solid rgba(6,182,212,0.15)",
              borderRadius: "6px", maxWidth: "680px", overflow: "hidden",
              animation: loaded ? "fadeUp 0.8s 0.8s both" : "none",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{
                padding: "10px 16px", background: "rgba(6,182,212,0.05)",
                borderBottom: "1px solid rgba(6,182,212,0.1)",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#F43F5E", opacity: 0.8 }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#F59E0B", opacity: 0.8 }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#10B981", opacity: 0.8 }} />
                <span style={{ fontFamily: "'Fira Code'", fontSize: "10px", color: "#334155", marginLeft: "8px" }}>
                  miyakei@analysis:~
                </span>
              </div>
              <pre style={{
                padding: "20px 22px", fontFamily: "'Fira Code', monospace",
                fontSize: "11.5px", lineHeight: 1.75, color: "#06B6D4",
                whiteSpace: "pre-wrap", minHeight: "220px",
                textShadow: "0 0 10px rgba(6,182,212,0.2)",
              }}>
                {terminalText}{showCursor ? "█" : " "}
              </pre>
            </div>
          </div>
        </section>

        {/* ===== OS MAP ===== */}
        <section style={{
          padding: "120px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <div className="section-tag">OS_MAP — 世界構造分析</div>
            <h2 style={{
              fontFamily: "'Sora'", fontSize: "38px", fontWeight: 800,
              marginBottom: "6px", color: "#E2E8F0",
            }}>世界OS地図</h2>
            <p style={{
              fontSize: "14px", color: "#475569", marginBottom: "52px",
              fontFamily: "'Fira Code'", letterSpacing: "0.03em",
            }}>
              国をPCに例えたとき、何が見えるか。各国のOS・壁紙・出生率を構造分析。
            </p>

            {/* Table */}
            <div style={{
              background: "rgba(12,18,34,0.6)",
              border: "1px solid rgba(6,182,212,0.08)",
              borderRadius: "6px", overflow: "hidden",
              backdropFilter: "blur(10px)",
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "70px 1.2fr 1fr 70px 60px 1.2fr",
                padding: "14px 20px",
                borderBottom: "1px solid rgba(6,182,212,0.12)",
                fontSize: "10px", fontFamily: "'Fira Code'",
                color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase",
              }}>
                <span>Code</span><span>Operating System</span><span>Wallpaper</span>
                <span>Rating</span><span>TFR</span><span>Status</span>
              </div>

              {countries.map((c, i) => (
                <div key={i} className="country-row" style={{
                  display: "grid",
                  gridTemplateColumns: "70px 1.2fr 1fr 70px 60px 1.2fr",
                  padding: "14px 20px", alignItems: "center",
                  borderBottom: i < countries.length - 1 ? "1px solid rgba(30,58,95,0.3)" : "none",
                  animation: loaded ? `slideRight 0.5s ${0.08 * i}s both` : "none",
                }}
                  onMouseEnter={() => setHoveredCountry(c.code)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  <span style={{
                    fontFamily: "'Fira Code'", fontSize: "13px", fontWeight: 700,
                    color: hoveredCountry === c.code ? c.color : "#64748B",
                    transition: "all 0.3s",
                    textShadow: hoveredCountry === c.code ? `0 0 12px ${c.color}40` : "none",
                  }}>{c.code}</span>
                  <span style={{
                    fontSize: "13px",
                    color: hoveredCountry === c.code ? "#E2E8F0" : "#94A3B8",
                    transition: "color 0.3s",
                  }}>{c.os}</span>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>{c.wallpaper}</span>
                  <span style={{
                    fontFamily: "'Fira Code'", fontSize: "12px", fontWeight: 700,
                    color: c.rating.includes("+++") ? "#F43F5E" : c.rating.includes("+") && c.rating.startsWith("S") ? "#F97316" : c.rating === "S" ? "#F59E0B" : "#475569",
                    textShadow: c.rating.includes("+++") ? "0 0 8px rgba(244,63,94,0.3)" : "none",
                  }}>{c.rating}</span>
                  <span style={{
                    fontFamily: "'Fira Code'", fontSize: "12px",
                    color: c.fertility === "—" ? "#334155" : parseFloat(c.fertility) < 1.3 ? "#F43F5E" : parseFloat(c.fertility) < 2.0 ? "#F59E0B" : "#10B981",
                  }}>{c.fertility}</span>
                  <span style={{
                    fontSize: "12px", fontStyle: "italic",
                    color: hoveredCountry === c.code ? c.color : "#475569",
                    transition: "color 0.3s",
                  }}>{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LAYER STRUCTURE ===== */}
        <section style={{
          padding: "120px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
          background: "rgba(8,14,28,0.5)",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <div className="section-tag">LAYER_STRUCTURE — 4層構造モデル</div>
            <h2 style={{
              fontFamily: "'Sora'", fontSize: "38px", fontWeight: 800,
              marginBottom: "48px", color: "#E2E8F0",
            }}>PC構造の4層</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {layers.map((l, i) => (
                <div key={i} className="layer-block" style={{
                  background: l.bg,
                  border: `1px solid ${l.color}22`,
                  borderLeft: `4px solid ${l.color}`,
                  padding: "32px 36px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  borderRadius: "2px",
                  animation: loaded ? `fadeUp 0.6s ${0.15 * i}s both` : "none",
                }}
                  onMouseEnter={() => setActiveLayer(i)}
                  onMouseLeave={() => setActiveLayer(null)}
                >
                  <div>
                    <div style={{
                      fontFamily: "'Fira Code'", fontSize: "10px",
                      color: l.color, letterSpacing: "0.2em", marginBottom: "6px",
                      opacity: 0.8,
                    }}>{l.sub} — {l.depth}</div>
                    <div style={{
                      fontFamily: "'Sora'", fontSize: "22px", fontWeight: 700,
                      color: activeLayer === i ? l.color : "#E2E8F0",
                      transition: "color 0.3s",
                      textShadow: activeLayer === i ? `0 0 20px ${l.color}30` : "none",
                    }}>{l.name}</div>
                  </div>
                  <div style={{
                    fontSize: "14px", color: "#94A3B8", textAlign: "right",
                    maxWidth: "400px",
                  }}>{l.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== EPISODES ===== */}
        <section style={{
          padding: "120px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <div className="section-tag">EPISODES — 配信一覧</div>
            <h2 style={{
              fontFamily: "'Sora'", fontSize: "38px", fontWeight: 800,
              marginBottom: "6px", color: "#E2E8F0",
            }}>エピソード</h2>
            <p style={{
              fontSize: "14px", color: "#475569", marginBottom: "48px",
              fontFamily: "'Fira Code'",
            }}>音声のみ。ながら聴き推奨。YouTube / Spotify / Apple Podcast</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {episodes.map((ep, i) => (
                <div key={i} className="ep-card" style={{
                  padding: "22px 24px",
                  borderBottom: "1px solid rgba(30,58,95,0.2)",
                  display: "flex", alignItems: "center", gap: "20px",
                  borderRadius: "4px",
                }}>
                  <div className="play-btn" style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    border: "1.5px solid rgba(6,182,212,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: "#06B6D4",
                    transition: "all 0.3s", flexShrink: 0,
                  }}>▶</div>
                  <div style={{
                    fontFamily: "'Fira Code'", fontSize: "24px", fontWeight: 700,
                    color: "#1E3A5F", minWidth: "40px",
                  }}>{ep.num}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "15px", fontWeight: 500, color: "#E2E8F0", marginBottom: "3px",
                    }}>{ep.title}</div>
                    <div style={{
                      fontSize: "11px", color: "#475569", fontFamily: "'Fira Code'",
                    }}>{ep.guest ? `Guest: ${ep.guest}` : "Solo"} — {ep.duration}</div>
                  </div>
                  <div style={{
                    padding: "4px 14px",
                    background: "rgba(6,182,212,0.06)",
                    border: "1px solid rgba(6,182,212,0.12)",
                    borderRadius: "2px", fontSize: "10px",
                    fontFamily: "'Fira Code'", color: "#06B6D4",
                    letterSpacing: "0.05em",
                  }}>{ep.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FUNNEL ===== */}
        <section style={{
          padding: "120px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
          background: "rgba(8,14,28,0.5)",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <div className="section-tag">FUNNEL — 5段階コンテンツ設計</div>
            <h2 style={{
              fontFamily: "'Sora'", fontSize: "38px", fontWeight: 800,
              marginBottom: "48px", color: "#E2E8F0",
            }}>コンテンツ導線</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {funnel.map((f, i) => (
                <div key={i} className="funnel-step" style={{
                  display: "flex", alignItems: "center", gap: "24px",
                  padding: "24px 28px",
                  background: `linear-gradient(90deg, ${f.color}08, transparent)`,
                  borderLeft: `3px solid ${f.color}`,
                  borderRadius: "2px",
                }}>
                  <div style={{
                    fontFamily: "'Sora'", fontSize: "28px", fontWeight: 800,
                    color: f.color, minWidth: "36px",
                    textShadow: `0 0 20px ${f.color}30`,
                  }}>{f.step}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "16px", fontWeight: 600, color: "#E2E8F0", marginBottom: "2px",
                    }}>{f.name}</div>
                    <div style={{
                      fontSize: "12px", color: "#64748B", fontFamily: "'Fira Code'",
                    }}>{f.desc}</div>
                  </div>
                  <div style={{
                    fontFamily: "'Fira Code'", fontSize: "14px", fontWeight: 700,
                    color: f.color,
                  }}>{f.price}</div>
                  {i < funnel.length - 1 && (
                    <div style={{
                      position: "absolute", right: "50%",
                      bottom: "-12px", fontSize: "14px", color: "#1E3A5F",
                    }}>↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MULTILINGUAL ===== */}
        <section style={{
          padding: "120px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto", textAlign: "center" }}>
            <div className="section-tag" style={{ justifyContent: "center" }}>MULTILINGUAL — 4言語配信</div>
            <h2 style={{
              fontFamily: "'Sora'", fontSize: "38px", fontWeight: 800,
              marginBottom: "12px", color: "#E2E8F0",
            }}>4つの言語、4つの視点</h2>
            <p style={{
              fontSize: "14px", color: "#64748B", marginBottom: "52px",
              fontFamily: "'Fira Code'",
            }}>各言語に独自ホスト。翻訳ではなくローカライズ。現地発オリジナルも配信。</p>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px",
            }}>
              {[
                { lang: "日本語", host: "宮本啓司", role: "理論の原作者", hook: "お前のMacの管理者権限はアメリカだよ", flag: "🇯🇵", accent: "#06B6D4" },
                { lang: "한국어", host: "박민수", role: "韓国人の視点で語る", hook: "우리 OS를 같이 들여다 볼까요?", flag: "🇰🇷", accent: "#3B82F6" },
                { lang: "English", host: "Alex Park", role: "外からの分析", hook: "Did you know America writes other nations' OS?", flag: "🇺🇸", accent: "#6366F1" },
                { lang: "繁體中文", host: "林志明", role: "台湾からの共感", hook: "我們是唯一選擇自己OS的國家", flag: "🇹🇼", accent: "#10B981" },
              ].map((l, i) => (
                <div key={i} className="lang-card" style={{
                  background: "rgba(12,18,34,0.8)",
                  border: "1px solid rgba(6,182,212,0.12)",
                  borderRadius: "6px", padding: "32px 24px",
                  backdropFilter: "blur(10px)",
                  textAlign: "left",
                }}>
                  <div style={{ fontSize: "36px", marginBottom: "16px" }}>{l.flag}</div>
                  <div style={{
                    fontFamily: "'Sora'", fontSize: "20px", fontWeight: 700,
                    color: "#E2E8F0", marginBottom: "4px",
                  }}>{l.lang}</div>
                  <div style={{
                    fontSize: "13px", color: l.accent, marginBottom: "12px",
                    fontWeight: 600,
                  }}>Host: {l.host}</div>
                  <div style={{
                    fontSize: "11px", color: "#64748B", marginBottom: "16px",
                    fontFamily: "'Fira Code'",
                  }}>{l.role}</div>
                  <div style={{
                    fontSize: "12px", color: "#94A3B8", fontStyle: "italic",
                    lineHeight: 1.6, borderTop: "1px solid rgba(6,182,212,0.08)",
                    paddingTop: "12px",
                  }}>"{l.hook}"</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PLATFORMS ===== */}
        <section style={{
          padding: "100px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
          background: "rgba(8,14,28,0.5)",
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <div className="section-tag">PLATFORMS — 配信先</div>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "24px",
            }}>
              {["YouTube", "Spotify", "Apple Podcast", "Amazon Music", "note", "Kindle", "X (Twitter)", "Instagram", "TikTok"].map((p, i) => (
                <div key={i} className="platform-badge" style={{
                  padding: "10px 22px",
                  background: "rgba(6,182,212,0.04)",
                  border: "1px solid rgba(6,182,212,0.1)",
                  borderRadius: "3px",
                  fontSize: "13px", color: "#94A3B8",
                  fontFamily: "'Fira Code'",
                }}>{p}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== ABOUT ===== */}
        <section style={{
          padding: "120px 48px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
        }}>
          <div style={{
            maxWidth: "1140px", margin: "0 auto",
            display: "grid", gridTemplateColumns: "1fr 320px", gap: "80px", alignItems: "center",
          }}>
            <div>
              <div className="section-tag">ABOUT — 著者</div>
              <h2 style={{
                fontFamily: "'Sora'", fontSize: "42px", fontWeight: 800,
                marginBottom: "28px", color: "#E2E8F0",
              }}>宮本啓司</h2>
              <p style={{
                fontSize: "15px", lineHeight: 2.0, color: "#94A3B8", marginBottom: "20px",
              }}>
                東アジア構造分析。世界OS地図の提唱者。アジア複数国での長期生活経験をもとに、国と人間の精神構造をPC比喩で解体する。
              </p>
              <p style={{
                fontSize: "15px", lineHeight: 2.0, color: "#94A3B8", marginBottom: "28px",
              }}>
                攻撃ゼロ、敬意100%。右でも左でもない。怒らせたら負け。気づかせたら勝ち。ただ構造を、見せる。
              </p>
              <div style={{
                display: "flex", gap: "16px",
              }}>
                <div style={{
                  padding: "10px 28px", background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.3)", borderRadius: "3px",
                  fontSize: "13px", fontFamily: "'Fira Code'", color: "#06B6D4",
                  cursor: "pointer", transition: "all 0.3s",
                }}>▶ 最新エピソード</div>
                <div style={{
                  padding: "10px 28px",
                  border: "1px solid rgba(100,116,139,0.3)", borderRadius: "3px",
                  fontSize: "13px", fontFamily: "'Fira Code'", color: "#64748B",
                  cursor: "pointer", transition: "all 0.3s",
                }}>📖 Kindle</div>
              </div>
            </div>
            <div style={{
              display: "flex", justifyContent: "center",
            }}>
              <div style={{
                width: "280px", height: "360px",
                background: "linear-gradient(160deg, rgba(6,182,212,0.05), rgba(12,18,34,0.9))",
                border: "1px solid rgba(6,182,212,0.12)",
                borderRadius: "6px", position: "relative", overflow: "hidden",
                animation: "borderGlow 6s ease-in-out infinite",
              }}>
                {/* Circuit pattern decoration */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.06 }}>
                  <line x1="20" y1="40" x2="140" y2="40" stroke="#06B6D4" strokeWidth="1" />
                  <line x1="140" y1="40" x2="140" y2="120" stroke="#06B6D4" strokeWidth="1" />
                  <line x1="40" y1="80" x2="200" y2="80" stroke="#06B6D4" strokeWidth="1" />
                  <line x1="60" y1="160" x2="220" y2="160" stroke="#06B6D4" strokeWidth="1" />
                  <line x1="100" y1="200" x2="100" y2="300" stroke="#06B6D4" strokeWidth="1" />
                  <line x1="180" y1="120" x2="180" y2="280" stroke="#06B6D4" strokeWidth="1" />
                  <circle cx="140" cy="40" r="3" fill="#06B6D4" />
                  <circle cx="140" cy="120" r="3" fill="#06B6D4" />
                  <circle cx="100" cy="200" r="3" fill="#06B6D4" />
                  <circle cx="180" cy="280" r="3" fill="#06B6D4" />
                </svg>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: "'Sora'", fontSize: "100px", fontWeight: 900,
                  color: "rgba(6,182,212,0.07)",
                }}>M</div>
                <div style={{
                  position: "absolute", bottom: "24px", left: "24px",
                  fontFamily: "'Fira Code'", fontSize: "10px",
                  color: "#334155", lineHeight: 1.8,
                }}>
                  MIYAKEI<br />宮本啓司<br />EST. 2026<br />
                  <span style={{ color: "#06B6D4", opacity: 0.6 }}>WORLD OS MAP ANALYST</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA / FOOTER ===== */}
        <section style={{
          padding: "100px 48px 40px",
          borderTop: "1px solid rgba(6,182,212,0.08)",
          background: "rgba(8,14,28,0.5)",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Sora'", fontSize: "28px", fontWeight: 700,
            color: "#E2E8F0", marginBottom: "16px",
          }}>
            あなたのPCの中身を、見てみませんか？
          </div>
          <p style={{
            fontSize: "14px", color: "#64748B", marginBottom: "36px",
          }}>毎週配信。YouTube / Spotify / Apple Podcast</p>
          <div style={{
            display: "inline-flex", gap: "16px",
          }}>
            <div style={{
              padding: "14px 40px", background: "#06B6D4", color: "#0C1222",
              fontFamily: "'Fira Code'", fontSize: "14px", fontWeight: 700,
              borderRadius: "3px", cursor: "pointer", letterSpacing: "0.05em",
              transition: "all 0.3s",
            }}>▶ LISTEN NOW</div>
            <div style={{
              padding: "14px 40px", border: "1px solid rgba(6,182,212,0.3)",
              color: "#06B6D4", fontFamily: "'Fira Code'", fontSize: "14px",
              borderRadius: "3px", cursor: "pointer", letterSpacing: "0.05em",
              transition: "all 0.3s",
            }}>READ ON NOTE</div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: "40px 48px",
          borderTop: "1px solid rgba(6,182,212,0.06)",
        }}>
          <div style={{
            maxWidth: "1140px", margin: "0 auto",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <span style={{
                fontFamily: "'Sora'", fontWeight: 800, fontSize: "16px",
                letterSpacing: "0.1em",
              }}>
                <span style={{ color: "#06B6D4" }}>MIYA</span>
                <span style={{ color: "#94A3B8" }}>KEI</span>
              </span>
              <span style={{
                fontSize: "11px", color: "#334155", fontFamily: "'Fira Code'",
                marginLeft: "16px",
              }}>
                © 2026 — 攻撃ゼロ、敬意100%。
              </span>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              {["YouTube", "Spotify", "X", "note", "Kindle"].map((s, i) => (
                <span key={i} style={{
                  fontSize: "11px", color: "#334155", fontFamily: "'Fira Code'",
                  cursor: "pointer", transition: "color 0.3s",
                }}
                  onMouseEnter={e => e.target.style.color = "#06B6D4"}
                  onMouseLeave={e => e.target.style.color = "#334155"}
                >{s}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MIYAKEI;
