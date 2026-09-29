/**
 * CONFIGURAÇÃO DO SITE DE PEDIDO DE DESCULPAS
 * 
 * Altere as informações abaixo conforme desejar.
 */
const CONFIG = {
  // Número do WhatsApp com código do país e DDD (sem espaços ou traços)
  whatsappNumber: "5521980251302",

  // Mensagem pré-preenchida que será enviada no WhatsApp
  whatsappMessage: "Você foi perdoado... agora bora jogar?",

  // Caminho da música de fundo (suas músicas enviadas já estão salvas na pasta assets/audio/)
  audioPath: "assets/audio/musica.mp3",

  // Volume da música de fundo (0.4 = 40% do volume máximo)
  audioVolume: 0.4,

  // Músicas disponíveis enviadas por você:
  playlist: [
    "assets/audio/musica1.mp3",
    "assets/audio/musica2.mp3"
  ],

  // Caminho do vídeo principal (vídeos enviados da pasta Nova pasta)
  videoPath: "assets/video/El_Ramon_video_no_watermark.mp4",

  // Lista de vídeos disponíveis
  videos: [
    { title: "Vídeo 1 🎥", src: "assets/video/El_Ramon_video_no_watermark.mp4" },
    { title: "Vídeo 2 🎥", src: "assets/video/lunarbi_video_no_watermark.mp4" }
  ],

  // Lista de imagens para a galeria (Gatinhos Fofinhos)
  photos: [
    {
      url: "assets/images/foto1.jpg",
      title: "A Gente no Halloween 🐱🦇",
      caption: "Batman & Hello Kitty, a melhor dupla!",
      style: "polaroid"
    },
    {
      url: "assets/images/foto2.jpg",
      title: "Nossas Implicâncias 👅",
      caption: "Mostrando a língua só pra perturbar kkkkk",
      style: "zoom"
    },
    {
      url: "assets/images/foto3.jpg",
      title: "Momentos Fofinhos 💤",
      caption: "Quando a paz reina e tá tudo bem ❤️",
      style: "slide-left"
    },
    {
      url: "assets/images/foto4.jpg",
      title: "Resenha & Zueira 🐱✨",
      caption: "Se a gente fosse gatinhos fofinhos 😂",
      style: "slide-right"
    }
  ],

  // Respostas engraçadas para o botão "AINDA NÃO 😤"
  funnyRefusalMessages: [
    "Calma, eu posso explicar 😭",
    "Prometo tentar não sumir de novo KKKKK 🥺",
    "Tá bom, eu mereço uma bronca 😂",
    "Eu pago o açaí/pizza! Aceita vai? 🍕🧋",
    "Sem chance de recusar, clica no botão verde kkkkk 🚀",
    "Poxa... vou ficar chorando no cantinho 😢",
    "Por favorzinho com chantilly no topo? 🧁✨"
  ]
};

// Torna global para uso no script principal
window.CONFIG = CONFIG;
