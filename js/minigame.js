/**
 * LÓGICA DO MINI GAME: QUEM É MAIS BONITA? 👀
 */

document.addEventListener("DOMContentLoaded", () => {
  // Configuração das participantes e fotos de Nicoly
  const AMIGA = {
    nome: "Nicoly",
    fotos: [
      { foto: "assets/images/minigame/nicoly-1.jpg", pos: "50% 10%" },
      { foto: "assets/images/minigame/nicoly-2.jpg", pos: "50% 15%" },
      { foto: "assets/images/minigame/nicoly-3.jpg", pos: "40% 50%" }
    ]
  };

  const DESAFIANTES = [
    { nome: "Bruna Marquezine", foto: "assets/images/minigame/bruna-marquezine.jpg", pos: "50% 15%" },
    { nome: "Margot Robbie", foto: "assets/images/minigame/margot-robbie.webp", pos: "50% 30%" },
    { nome: "Sadie Sink", foto: "assets/images/minigame/sadie-sink.webp", pos: "50% 45%" },
    { nome: "Sabrina Carpenter", foto: "assets/images/minigame/sabrina-carpenter.jpg", pos: "50% 50%" },
    { nome: "Jennifer Lawrence", foto: "assets/images/minigame/jennifer-lawrence.jpg", pos: "50% 22%" }
  ];

  const fotoAmiga = k => AMIGA.fotos[k % AMIGA.fotos.length];

  // Referências dos elementos DOM
  const mgSection = document.getElementById("minigame-section");
  if (!mgSection) return;

  const mgHead = document.getElementById("mg-head");
  const mgStartBtn = document.getElementById("mg-start");
  const mgRound = document.getElementById("mg-round");
  const mgGame = document.getElementById("mg-game");
  const mgArena = document.getElementById("mg-arena");
  const mgMsg = document.getElementById("mg-msg");
  const mgFinal = document.getElementById("mg-final");
  const mgFinalImg = document.getElementById("mg-finalImg");
  const mgAgainBtn = document.getElementById("mg-again");

  const anims = ['a1', 'a2', 'a3', 'a4', 'a5'];
  let currentIdx = 0;
  let busy = false;

  function cardHTML(p, isAmiga) {
    return `
      <article class="mg-card" data-amiga="${isAmiga}">
        <div class="mg-photo">
          <img src="${p.foto}" alt="${p.nome}" style="object-position: ${p.pos || '50% 50%'};">
        </div>
        <div class="mg-name">${p.nome}</div>
        <button class="mg-pick" type="button">É ela! 💖</button>
      </article>
    `;
  }

  function renderDots() {
    if (!mgRound) return;
    mgRound.innerHTML = DESAFIANTES.map((_, k) => 
      `<i class="${k < currentIdx ? 'done' : k === currentIdx ? 'on' : ''}"></i>`
    ).join('');
  }

  function renderRound() {
    busy = false;
    if (mgFinal) mgFinal.hidden = true;
    if (mgGame) mgGame.hidden = false;
    if (mgMsg) mgMsg.innerHTML = '';

    const d = DESAFIANTES[currentIdx];
    const amigaFirst = currentIdx % 2 === 0;
    const cardAmiga = cardHTML({ nome: AMIGA.nome, ...fotoAmiga(currentIdx) }, true);
    const cardDesafiante = cardHTML(d, false);

    mgArena.className = 'mg-arena ' + anims[currentIdx % anims.length];
    mgArena.innerHTML = (amigaFirst ? cardAmiga : cardDesafiante) + 
                        '<div class="mg-vs">VS</div>' + 
                        (amigaFirst ? cardDesafiante : cardAmiga);

    mgArena.querySelectorAll('.mg-card').forEach(c => {
      c.addEventListener('click', () => pickWinner(c.dataset.amiga === 'true'));
    });

    renderDots();
  }

  function setMsg(t, s) {
    if (mgMsg) mgMsg.innerHTML = `<b>${t}</b><span>${s || ''}</span>`;
  }

  function pickWinner(isAmiga) {
    if (busy) return;
    busy = true;
    mgArena.classList.add('locked');

    const cards = [...mgArena.querySelectorAll('.mg-card')];
    const mine = cards.find(c => c.dataset.amiga === 'true');
    const other = cards.find(c => c.dataset.amiga === 'false');

    if (isAmiga) {
      if (mine) mine.classList.add('winner');
      if (other) other.classList.add('dim');
      setMsg('ÓBVIO! 😂❤️', 'Finalmente alguém com bom senso.');
      triggerBurst(1.2);
      setTimeout(showFinalScreen, 2600);
    } else {
      if (other) other.classList.add('oops');
      setMsg('Resposta errada! 😭', 'Pode tentar novamente...');
      setTimeout(() => {
        if (other) {
          other.classList.remove('oops');
          other.classList.add('dim');
        }
        if (mine) mine.classList.add('winner');
        setMsg('Impossível ganhar dela. Próxima! 😂', '');
        triggerBurst(1.2);
      }, 2200);
      setTimeout(showFinalScreen, 5000);
    }
  }

  function showFinalScreen() {
    if (mgGame) mgGame.hidden = true;
    const F = fotoAmiga(currentIdx);
    if (mgFinalImg) {
      mgFinalImg.src = F.foto;
      mgFinalImg.style.objectPosition = F.pos || '50% 50%';
    }
    if (mgFinal) mgFinal.hidden = false;
    triggerBurst(2.2);
    
    // Rolagem suave até a vitória
    mgSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function triggerBurst(intensity) {
    // Utiliza o efeito de confetes já existente ou dispara confetes customizados
    if (typeof window.triggerConfetti === 'function') {
      window.triggerConfetti();
    }
  }

  if (mgStartBtn) {
    mgStartBtn.addEventListener('click', () => {
      if (mgHead) mgHead.style.display = 'none';
      renderRound();
    });
  }

  if (mgAgainBtn) {
    mgAgainBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % DESAFIANTES.length;
      renderRound();
    });
  }

  // Inicializa visualização do mini game
  renderDots();
});
