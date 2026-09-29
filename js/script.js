/**
 * SITE DE PEDIDO DE DESCULPAS - LÓGICA INTERATIVA E ANIMAÇÕES
 */

document.addEventListener("DOMContentLoaded", () => {
  // Carrega a configuração global
  const config = window.CONFIG || {
    whatsappNumber: "5521980251302",
    whatsappMessage: "Você foi perdoado... agora bora jogar?",
    audioPath: "assets/audio/musica.mp3",
    videoPath: "assets/video/video.mp4",
    photos: []
  };

  // Referências dos elementos DOM
  const heroSection = document.getElementById("heroSection");
  const enterBtn = document.getElementById("enterBtn");
  const sections = document.querySelectorAll(".section");
  const galleryGrid = document.getElementById("galleryGrid");
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const audioBtn = document.getElementById("audioBtn");
  const bgAudio = document.getElementById("bgAudio");
  const mainVideo = document.getElementById("mainVideo");
  const acceptBtn = document.getElementById("acceptBtn");
  const declineBtn = document.getElementById("declineBtn");
  const funnyToast = document.getElementById("funnyToast");
  const whatsappBtn = document.getElementById("whatsappBtn");

  let isAudioPlaying = false;
  let funnyRefusalIndex = 0;
  let synthAudioCtx = null;

  // 1. CONFIGURAÇÃO DO BOTÃO WHATSAPP
  function setupWhatsAppButton() {
    if (whatsappBtn) {
      const cleanNumber = config.whatsappNumber.replace(/\D/g, "");
      const encodedMsg = encodeURIComponent(config.whatsappMessage);
      const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
      whatsappBtn.setAttribute("href", waUrl);
      whatsappBtn.setAttribute("target", "_blank");
      whatsappBtn.setAttribute("rel", "noopener noreferrer");
    }
  }

  // 2. GALERIA DE FOTOS DINÂMICA COM LIGHTBOX
  function renderGallery() {
    if (!galleryGrid || !config.photos) return;

    galleryGrid.innerHTML = "";

    config.photos.forEach((photo, index) => {
      const item = document.createElement("div");
      const styleClass = photo.style || (index % 2 === 0 ? "polaroid" : "zoom");
      item.className = `photo-item ${styleClass}`;
      item.setAttribute("data-index", index);

      item.innerHTML = `
        <div class="photo-img-wrapper">
          <img class="photo-img" src="${photo.url}" alt="${photo.title || 'Foto'}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/foto1.jpg';">
        </div>
        <div class="photo-caption">${photo.caption || photo.title || 'Foto'}</div>
      `;

      item.addEventListener("click", () => openLightbox(photo));
      galleryGrid.appendChild(item);
    });
  }

  function openLightbox(photo) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = photo.url;
    lightboxCaption.textContent = photo.caption || photo.title || "";
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // 3. CONTROLE DE ÁUDIO COM SUPORTE A SINTETIZADOR WEB AUDIO API
  function initAudio() {
    if (bgAudio) {
      bgAudio.src = config.audioPath;
      bgAudio.loop = true;
      bgAudio.volume = config.audioVolume || 0.4;

      // Trata erro caso a música mp3 não esteja na pasta ainda
      bgAudio.addEventListener("error", () => {
        console.log("Música MP3 customizada não encontrada. Preparando sintetizador de áudio ambiente suave.");
      });
    }
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function playAudio() {
    if (bgAudio && bgAudio.src) {
      bgAudio.volume = config.audioVolume || 0.4;
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateAudioBtnState();
      }).catch(err => {
        console.log("Tentando synth ambiente fallback:", err);
        startSynthAmbient();
        isAudioPlaying = true;
        updateAudioBtnState();
      });
    } else {
      startSynthAmbient();
      isAudioPlaying = true;
      updateAudioBtnState();
    }
  }

  function pauseAudio() {
    if (bgAudio) bgAudio.pause();
    if (synthAudioCtx) synthAudioCtx.suspend();
    isAudioPlaying = false;
    updateAudioBtnState();
  }

  function updateAudioBtnState() {
    if (!audioBtn) return;
    if (isAudioPlaying) {
      audioBtn.classList.add("playing");
      audioBtn.innerHTML = `🎵`;
      audioBtn.setAttribute("title", "Desativar Áudio");
    } else {
      audioBtn.classList.remove("playing");
      audioBtn.innerHTML = `🔇`;
      audioBtn.setAttribute("title", "Ativar Áudio");
    }
  }

  // Sintetizador para som ambiente calmo caso o mp3 não esteja carregado
  function startSynthAmbient() {
    if (synthAudioCtx) {
      synthAudioCtx.resume();
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioCtx();
      
      const freqs = [220, 277.18, 329.63, 440]; // Acorde A Maior Suave
      freqs.forEach(freq => {
        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, synthAudioCtx.currentTime);
        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);
        osc.start();
      });
    } catch (e) {
      console.log("Audio Context não suportado", e);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener("click", toggleAudio);
  }

  // Pausa música de fundo se o vídeo for iniciado
  if (mainVideo) {
    mainVideo.addEventListener("play", () => {
      if (isAudioPlaying) pauseAudio();
    });
  }

  // Alternador de vídeos (Vídeo 1 e Vídeo 2 da pasta Nova pasta)
  const videoSelectBtns = document.querySelectorAll(".video-select-btn");
  videoSelectBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      videoSelectBtns.forEach(b => {
        b.style.background = "rgba(255, 255, 255, 0.08)";
        b.style.borderColor = "rgba(255, 255, 255, 0.2)";
        b.style.color = "#cbd5e1";
      });
      btn.style.background = "rgba(255, 107, 139, 0.25)";
      btn.style.borderColor = "var(--primary)";
      btn.style.color = "#ffffff";

      if (mainVideo) {
        const newSrc = btn.getAttribute("data-src");
        mainVideo.src = newSrc;
        mainVideo.load();
        mainVideo.play().catch(e => console.log("Video autoplay:", e));
      }
    });
  });

  // 4. SCROLL REVEAL E BOTÃO ENTRAR
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      playAudio(); // Inicia música na primeira interação
      const firstSection = document.getElementById("section-apology");
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // 5. PARTE DIVERTIDA - BOTÕES DE ACEITAÇÃO
  function triggerConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ["#ff6b8b", "#6c5ce7", "#00cec9", "#fdcb6e", "#25D366", "#ffffff"];

    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 5 + 3,
        speedX: Math.random() * 4 - 2,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5
      });
    }

    let startTime = Date.now();

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (Date.now() - startTime < 4000) {
        requestAnimationFrame(renderConfetti);
      } else {
        canvas.remove();
      }
    }

    renderConfetti();
  }

  function showToast(message) {
    if (!funnyToast) return;
    funnyToast.textContent = message;
    funnyToast.classList.add("show");

    setTimeout(() => {
      funnyToast.classList.remove("show");
    }, 3000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      triggerConfetti();
      showToast("EU SABIA! KKKKK 😂❤️ Você é demais!");
    });
  }

  if (declineBtn) {
    const handleDecline = () => {
      const messages = config.funnyRefusalMessages;
      showToast(messages[funnyRefusalIndex]);
      funnyRefusalIndex = (funnyRefusalIndex + 1) % messages.length;

      // Pequeno desvio divertido no botão
      const randomX = (Math.random() - 0.5) * 80;
      const randomY = (Math.random() - 0.5) * 40;
      declineBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    };

    declineBtn.addEventListener("click", handleDecline);
    declineBtn.addEventListener("mouseover", () => {
      if (window.innerWidth > 768) {
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 50;
        declineBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
      }
    });
  }

  // 6. CANVAS AMBIENTE DE PARTÍCULAS (ESTRELAS, CORAÇÕES E HELLO KITTY FLUTUANTES)
  function initParticleCanvas() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Ícones da Hello Kitty
    const hkImg1 = new Image();
    hkImg1.src = "assets/images/hk1.png";
    const hkImg2 = new Image();
    hkImg2.src = "assets/images/hk2.png";
    const hkImages = [hkImg1, hkImg2];

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 22), 45);

    for (let i = 0; i < particleCount; i++) {
      const isHK = Math.random() < 0.4; // 40% de ícones da Hello Kitty!
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHK ? (Math.random() * 18 + 26) : (Math.random() * 3 + 1),
        speedY: Math.random() * 0.4 + 0.15,
        speedX: Math.random() * 0.3 - 0.15,
        opacity: isHK ? (Math.random() * 0.5 + 0.4) : (Math.random() * 0.6 + 0.2),
        type: isHK ? "hk" : (Math.random() > 0.7 ? "heart" : "star"),
        img: isHK ? hkImages[Math.floor(Math.random() * hkImages.length)] : null,
        rotation: Math.random() * 0.4 - 0.2,
        rotSpeed: (Math.random() - 0.5) * 0.01
      });
    }

    function drawHeart(x, y, size, opacity) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(255, 107, 139, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
      ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.rotSpeed) p.rotation += p.rotSpeed;

        if (p.y < -40) {
          p.y = height + 40;
          p.x = Math.random() * width;
        }

        if (p.type === "hk" && p.img && p.img.complete) {
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation || 0);
          ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        } else if (p.type === "heart") {
          drawHeart(p.x, p.y, p.size * 2.5, p.opacity);
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // Inicialização
  setupWhatsAppButton();
  renderGallery();
  initAudio();
  initParticleCanvas();
});
