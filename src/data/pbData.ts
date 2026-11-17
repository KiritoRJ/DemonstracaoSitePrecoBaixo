import { SiteImageSlot } from '../types';

export interface CampaignSlide {
  id: string;
  imageKey: string;
  title: string;
  subtitle: string;
  dayTag: string;
  description: string;
  image: string;
}

export interface FlyerPoster {
  id: string;
  imageKey: string;
  title: string;
  brand: string;
  validity: string;
  image: string;
}

export interface StoreUnit {
  id: string;
  imageKey: string;
  slug: string;
  name: string;
  shortName: string;
  city: 'Belém' | 'Ananindeua';
  address: string;
  hours: string;
  phone: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
  cardImage: string;
  photoImage: string;
  services: string[];
  cartaoWhatsappUrl?: string;
}

export interface PharmacyUnit {
  id: string;
  imageKey: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  mapsEmbedUrl: string;
}

export interface WineOrigin {
  id: string;
  country: string;
  tagline: string;
  summary: string;
  highlights: string[];
}

export const OFFICIAL_LINKS = {
  facebook: 'https://www.facebook.com/mmprecobaixo',
  instagram: 'https://www.instagram.com/precobaixo.atacadista',
  instagramReels: 'https://www.instagram.com/precobaixo.atacadista/reels/',
  instagramFarma: 'https://www.instagram.com/precobaixodrogaria/',
  youtube: 'https://www.youtube.com/@precobaixo.atacadista',
  youtubeEmbed: 'https://www.youtube.com/embed/CL6WlDc4QyY?rel=0&modestbranding=1',
  linkedin: 'https://www.linkedin.com/company/grupo-preco-baixo/',
  appStore: 'https://apps.apple.com/us/app/meu-pb/id1644731584',
  googlePlay: 'https://play.google.com/store/apps/details?id=app.meupb',
  trabalheConosco: 'https://painel.umentor.com.br/inteligente_novos/?con_cod=aca109954&pla=5',
  email: 'comunicaprecobaixo@gmail.com',
};

export const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: 'ofertas-semana',
    imageKey: 'slide-ofertas-semana',
    title: 'Ofertas da Semana',
    subtitle: 'Economia de verdade todos os dias',
    dayTag: 'Segunda a Domingo',
    description: 'Fique por dentro de todos os encartes, promoções e ofertas especiais no varejo e no atacado.',
    image: '/pb-assets/slide-ofertas-semana.webp',
  },
  {
    id: 'quarta-carne',
    imageKey: 'slide-quarta-carne',
    title: 'Quarta da Carne',
    subtitle: 'Cortes selecionados com preço imbatível',
    dayTag: 'Toda Quarta-feira',
    description: 'Carnes bovinas, suínas e aves fresquinhas no nosso açougue para abastecer sua casa ou comércio.',
    image: '/pb-assets/slide-quarta-carne.webp',
  },
  {
    id: 'quinta-horti',
    imageKey: 'slide-quinta-horti',
    title: 'Quinta do Horti',
    subtitle: 'Frescor direto do produtor para sua mesa',
    dayTag: 'Toda Quinta-feira',
    description: 'Frutas, verduras e legumes selecionados com qualidade garantida e preços lá embaixo.',
    image: '/pb-assets/slide-quinta-horti.webp',
  },
  {
    id: 'fim-semana',
    imageKey: 'slide-fim-semana',
    title: 'Ofertas Fim de Semana',
    subtitle: 'Sexta, sábado e domingo de muita economia',
    dayTag: 'Sexta a Domingo',
    description: 'Preços especiais em bebidas, mercearia, limpeza e churrasco para o seu fim de semana em família.',
    image: '/pb-assets/slide-fim-semana.webp',
  },
  {
    id: 'food-service',
    imageKey: 'slide-food-service',
    title: 'Ofertas Food Service',
    subtitle: 'Soluções em volume para o seu negócio',
    dayTag: 'Atacado & Comércio',
    description: 'Embalagens institucionais e grandes volumes com condições diferenciadas para restaurantes e lanchonetes.',
    image: '/pb-assets/slide-food-service.webp',
  },
];

export const ACTIVE_FLYERS: FlyerPoster[] = [
  {
    id: 'sadia',
    imageKey: 'encarte-sadia',
    title: 'Festival BRF Sadia',
    brand: 'Sadia',
    validity: 'Válido de 02 a 17 de Novembro',
    image: '/pb-assets/encarte-sadia.png',
  },
  {
    id: 'perdigao',
    imageKey: 'encarte-perdigao',
    title: 'Festival BRF Perdigão',
    brand: 'Perdigão',
    validity: 'Válido de 02 a 17 de Novembro',
    image: '/pb-assets/encarte-perdigao.png',
  },
];

export const IMPACT_METRICS = [
  { value: 20, prefix: '', suffix: ' anos', label: 'no mercado paraense' },
  { value: 2000, prefix: '+', suffix: '', label: 'colaboradores diretos' },
  { value: 8, prefix: '', suffix: ' lojas', label: 'ativas em Belém e Ananindeua' },
  { value: 8.5, prefix: '+', suffix: ' milhões', label: 'de clientes em 2025', decimals: 1 },
  { value: 100, prefix: '+', suffix: ' mil m²', label: 'de áreas construídas' },
];

export const STORES: StoreUnit[] = [
  {
    id: 'augusto-montenegro',
    imageKey: 'loja-augusto-montenegro',
    slug: 'augusto-montenegro',
    name: 'PB Augusto Montenegro',
    shortName: 'Augusto Montenegro',
    city: 'Belém',
    address: 'Rod. Augusto Montenegro, 3600 - Parque Verde, Belém - PA',
    hours: 'SEG A SÁB 07h às 22h / DOM 07h30 às 14h',
    phone: '(91) 3229-6531',
    mapsUrl: 'https://www.google.com/maps/place/Pre%C3%A7o+Baixo+Atacadista+Augusto+Montenegro/@-1.3636374,-48.4497927,15z/data=!4m2!3m1!1s0x0:0xe24547e5073591b8',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Atacadista%20Augusto%20Montenegro&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-am-card.png',
    photoImage: '/pb-assets/loja-am-foto.png',
    services: ['Lanchonete', 'Cartão PB', 'Aplicativo Meu PB', 'Máquina de suco de laranja', 'Adega'],
  },
  {
    id: 'br',
    imageKey: 'loja-br',
    slug: 'br',
    name: 'PB BR',
    shortName: 'BR-316',
    city: 'Ananindeua',
    address: 'Rod. BR-316, Km 08, 1171 – Centro, Ananindeua - PA',
    hours: 'SEG A SÁB 07h30 às 21h30 / DOM 07h30 às 13h30',
    phone: '(91) 3255-9102',
    mapsUrl: 'https://goo.gl/maps/stcp8FcGD2rsWgwW8',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Supermercado%20Pre%C3%A7o%20Baixo%20Br-316%20Ananindeua%20PA&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-br-card.png',
    photoImage: '/pb-assets/loja-br-foto.webp',
    services: ['Lanchonete', 'Cartão PB', 'Banco 24 horas', 'Farmácia'],
    cartaoWhatsappUrl: 'https://wa.me/message/6CWOVKMOS23ZD1',
  },
  {
    id: 'cidade-nova',
    imageKey: 'loja-cidade-nova',
    slug: 'cidade-nova',
    name: 'PB Cidade Nova',
    shortName: 'Cidade Nova',
    city: 'Ananindeua',
    address: 'Tv. SN 03, 753 – Cidade Nova, Ananindeua - PA',
    hours: 'SEG A SÁB 07h30 às 21h30 / DOM 07h30 às 13h30',
    phone: '(91) 3207-6862 / (91) 3348-1448',
    mapsUrl: 'https://goo.gl/maps/pmvnRLUrwdTaPJbZA',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Meio%20a%20Meio%20Cidade%20Nova%20Ananindeua&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-cn-card.png',
    photoImage: '/pb-assets/loja-cn-foto.webp',
    services: ['Lanchonete', 'Cartão PB', 'Aplicativo Meu PB', 'Máquina de suco de laranja', 'Farmácia', 'Banco 24 horas', 'Buffet', 'Adega', 'Casa lotérica'],
    cartaoWhatsappUrl: 'https://wa.me/message/CTIBFXCLJL2WO1',
  },
  {
    id: 'icui',
    imageKey: 'loja-icui',
    slug: 'icui',
    name: 'PB Icuí',
    shortName: 'Icuí',
    city: 'Ananindeua',
    address: 'Estr. Santa Fé, 35 – Icuí-Guajará, Ananindeua - PA',
    hours: 'SEG A SÁB 07h30 às 21h / DOM 07h30 às 13h30',
    phone: '(91) 98492-1906',
    mapsUrl: '/pb-assets/loja-icui-foto.png'.startsWith('/') ? 'https://goo.gl/maps/exiN2swdFkK5ySwB9' : '',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Supermercado%20Meio%20a%20Meio%20Pre%C3%A7o%20Baixo%20Icu%C3%AD&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-icui-card.png',
    photoImage: '/pb-assets/loja-icui-foto.png',
    services: ['Padaria', 'Cartão PB', 'Banco 24 horas', 'Farmácia'],
    cartaoWhatsappUrl: 'https://wa.me/message/PI7YELAGWZ3RM1',
  },
  {
    id: 'senador-lemos',
    imageKey: 'loja-senador-lemos',
    slug: 'senador-lemos',
    name: 'PB Senador Lemos',
    shortName: 'Senador Lemos',
    city: 'Belém',
    address: 'Av. Senador Lemos, 2842 - Sacramenta, Belém - PA',
    hours: 'SEG A SÁB 07h30 às 21h30 / DOM 07h30 às 13h30',
    phone: '(91) 3225-0977',
    mapsUrl: 'https://goo.gl/maps/yjzgn7TwGidMzyZRA',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Meio%20a%20Meio%20Senador%20Lemos%20Belem&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-sl-card.png',
    photoImage: '/pb-assets/loja-sl-foto.webp',
    services: ['Lanchonete', 'Cartão PB', 'Aplicativo Meu PB', 'Banco 24 horas', 'Máquina de suco de laranja', 'Farmácia', 'Adega', 'Academia', 'Casa lotérica'],
    cartaoWhatsappUrl: 'https://wa.me/message/6HPRH3GQJFUFM1',
  },
  {
    id: 'tapana',
    imageKey: 'loja-tapana',
    slug: 'tapana',
    name: 'PB Tapanã',
    shortName: 'Tapanã',
    city: 'Belém',
    address: 'Rua Presidente Castelo Branco, nº 33 - Tapanã, Belém - PA',
    hours: 'SEG A SÁB 07h30 às 21h30 / DOM 07h30 às 13h30',
    phone: '(91) 98506-4679',
    mapsUrl: 'https://maps.app.goo.gl/1huDBb9yZvFAcnUt9',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Tapan%C3%A3%20Belem&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-tapana-card.webp',
    photoImage: '/pb-assets/loja-tapana-foto.webp',
    services: ['Padaria', 'Crediário', 'Farmácia', 'Rotisseria', 'Hortifrúti', 'Açougue'],
  },
  {
    id: 'tenone',
    imageKey: 'loja-tenone',
    slug: 'tenone',
    name: 'PB Tenoné',
    shortName: 'Tenoné',
    city: 'Belém',
    address: 'Passagem Alacide Nunes, nº 116 - Tenoné, Belém - PA',
    hours: 'SEG A SÁB 07h30 às 21h30 / DOM 07h30 às 13h30',
    phone: '(91) 98503-6354',
    mapsUrl: 'https://maps.app.goo.gl/1mLjHSeFtmEGuDDD7',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=PRE%C3%87O%20BAIXO%20ATACADISTA%20TENON%C3%89%20Belem&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-tenone-card.webp',
    photoImage: '/pb-assets/loja-tenone-foto.webp',
    services: ['Padaria', 'Crediário', 'Farmácia', 'Rotisseria', 'Hortifrúti', 'Açougue'],
  },
  {
    id: 'una',
    imageKey: 'loja-una',
    slug: 'una',
    name: 'PB Una',
    shortName: 'Una',
    city: 'Ananindeua',
    address: 'Rod. Transcoqueiro, 75 – Una, Ananindeua - PA',
    hours: 'SEG A SÁB 07h30 às 21h / DOM 07h30 às 13h30',
    phone: '(91) 3237-4788',
    mapsUrl: 'https://goo.gl/maps/i2mWpUxc61Gz5gyo6',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Meio%20a%20Meio%20UNA%20Ananindeua&t=m&z=15&output=embed',
    cardImage: '/pb-assets/loja-una-card.png',
    photoImage: '/pb-assets/loja-una-foto.png',
    services: ['Lanchonete', 'Cartão PB', 'Banco 24 horas', 'Máquina de suco de laranja', 'Farmácia', 'Casa lotérica'],
    cartaoWhatsappUrl: 'https://wa.me/qr/V256O5VDBRAHL1',
  },
];

export const APP_MEU_PB_STEPS = [
  {
    step: '01',
    imageKey: 'app-step-1',
    title: 'Baixe o App',
    description: 'Disponível gratuitamente para Android (Google Play) e iOS (App Store).',
    screen: '/pb-assets/app-screen-1.webp',
  },
  {
    step: '02',
    imageKey: 'app-step-2',
    title: 'Faça seu Cadastro',
    description: 'Crie sua conta em segundos e confira o raio de entrega disponível para o seu endereço.',
    screen: '/pb-assets/app-screen-2.webp',
  },
  {
    step: '03',
    imageKey: 'app-step-3',
    title: 'Selecione os Itens',
    description: 'Navegue por mais de 10 mil produtos e garanta as melhores ofertas do Preço Baixo.',
    screen: '/pb-assets/app-screen-3.webp',
  },
  {
    step: '04',
    imageKey: 'app-step-4',
    title: 'Forma de Pagamento',
    description: 'Escolha a forma de pagamento ideal e conclua o pedido com praticidade e segurança.',
    screen: '/pb-assets/app-screen-4.webp',
  },
  {
    step: '05',
    imageKey: 'app-step-5',
    title: 'Receba ou Retire',
    description: 'Receba no mesmo dia em casa ou retire na loja! Disponível em Cidade Nova, Augusto Montenegro e Senador Lemos.',
    screen: '/pb-assets/app-pb-mockup.webp',
  },
];

export const PAYMENT_BADGES = [
  ...Array.from({ length: 27 }, (_, idx) => {
    const num = idx + 2;
    return num === 23 ? null : `/pb-assets/cartao-${num}.png`;
  }).filter(Boolean) as string[],
  '/pb-assets/cartoes-30.png',
];

export const PHARMACIES: PharmacyUnit[] = [
  {
    id: 'farma-una',
    imageKey: 'farma-una',
    name: 'PB Farma Una',
    address: 'Rodovia Transcoqueiro, 75, Una, Ananindeua - PA',
    phone: '(91) 98425-0652',
    image: '/pb-assets/farma-una.png',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Drogarias%20Rod.%20Transcoqueiro%2075%20Belem&t=m&z=13&output=embed',
  },
  {
    id: 'farma-icui',
    imageKey: 'farma-icui',
    name: 'PB Farma Icuí',
    address: 'Estrada Santa Fé, 35, Icuí-Guajará, Ananindeua - PA',
    phone: '(91) 98492-1906',
    image: '/pb-assets/farma-icui.png',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=R.%20Santa%20F%C3%A9%2035%20Icui-Guajara%20Ananindeua&t=m&z=13&output=embed',
  },
  {
    id: 'farma-aguas-lindas',
    imageKey: 'farma-aguas-lindas',
    name: 'PB Farma Águas Lindas',
    address: 'Rodovia BR 316, Águas Lindas, Ananindeua - PA',
    phone: '(91) 98733-2506',
    image: '/pb-assets/farma-al.png',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Drogarias%20Aguas%20Lindas%20Ananindeua&t=m&z=13&output=embed',
  },
  {
    id: 'farma-br',
    imageKey: 'farma-br',
    name: 'PB Farma BR 316',
    address: 'Rodovia BR 316, Km 08, 1171, Centro, Ananindeua - PA',
    phone: '(91) 98886-1037',
    image: '/pb-assets/farma-br.png',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Supermercado%20Pre%C3%A7o%20Baixo%20Br-316%20Ananindeua&t=m&z=13&output=embed',
  },
  {
    id: 'farma-sl',
    imageKey: 'farma-sl',
    name: 'PB Farma Senador Lemos',
    address: 'Avenida Senador Lemos, 2842, Sacramenta, Belém - PA',
    phone: '(91) 98862-0052',
    image: '/pb-assets/farma-sl.png',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Avenida%20Senador%20Lemos%202842%20Belem&t=m&z=14&output=embed',
  },
  {
    id: 'farma-cn',
    imageKey: 'farma-cn',
    name: 'PB Farma Cidade Nova',
    address: 'Travessa SN 03, 753, Cidade Nova, Ananindeua - PA',
    phone: '(91) 98874-3767',
    image: '/pb-assets/farma-cn.png',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Meio%20a%20Meio%20Cidade%20Nova&t=m&z=13&output=embed',
  },
  {
    id: 'farma-am',
    imageKey: 'farma-am',
    name: 'PB Farma Augusto Montenegro',
    address: 'Rod. Augusto Montenegro, 3600 - Parque Verde, Belém - PA',
    phone: '(91) 3229-6531',
    image: '/pb-assets/farma-am.webp',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Atacadista%20Augusto%20Montenegro&t=m&z=13&output=embed',
  },
  {
    id: 'farma-tapana',
    imageKey: 'farma-tapana',
    name: 'PB Farma Tapanã',
    address: 'Rua Presidente Castelo Branco, nº 33 - Tapanã - Belém/PA',
    phone: '(91) 98606-6661',
    image: '/pb-assets/farma-tapana.webp',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Tapana%20Belem&t=m&z=13&output=embed',
  },
  {
    id: 'farma-tenone',
    imageKey: 'farma-tenone',
    name: 'PB Farma Tenoné',
    address: 'Passagem Alacide Nunes, nº 116 - Tenoné - Belém/PA',
    phone: '(91) 98454-3321',
    image: '/pb-assets/farma-tenone.webp',
    mapsEmbedUrl: 'https://maps.google.com/maps?q=Pre%C3%A7o%20Baixo%20Tenone%20Belem&t=m&z=13&output=embed',
  },
];

export const WINE_GUIDE: WineOrigin[] = [
  {
    id: 'chile',
    country: 'Vinhos Chilenos',
    tagline: 'Sucesso da Carménère e frescor da Sauvignon Blanc',
    summary:
      'Referência em vinhos de ótimo custo-benefício, o Chile se destaca com uvas como Carménère (taninos médios, frutas vermelhas e toque herbáceo) e Sauvignon Blanc (notas cítricas, tropicais e minerais).',
    highlights: ['Carménère', 'Sauvignon Blanc', 'Cabernet Sauvignon'],
  },
  {
    id: 'argentina',
    country: 'Vinhos Argentinos',
    tagline: 'O berço sul-americano do icônico Malbec',
    summary:
      'Quinto maior produtor mundial e líder na América Latina, a Argentina encontrou na região de Mendoza o terroir perfeito para a uva Malbec — vinhos estruturados, acidez moderada e notas de frutas maduras.',
    highlights: ['Malbec de Mendoza', 'Tintos, Brancos & Rosés', 'Qualidade & Elegância'],
  },
  {
    id: 'espanha',
    country: 'Vinhos Espanhóis',
    tagline: 'Tradição e classificação por tempo de amadurecimento',
    summary:
      'Com castas emblemáticas como Tempranillo e Airén, a Espanha classifica seus rótulos pelo estágio em barrica: Joven, Roble (até 6 meses), Crianza (24 meses), Reserva (36 meses) e Gran Reserva (60 meses).',
    highlights: ['Joven & Roble', 'Crianza & Reserva', 'Gran Reserva'],
  },
  {
    id: 'brasil',
    country: 'Vinhos Brasileiros',
    tagline: 'Expressão da viticultura nacional e D.O. Vale dos Vinhedos',
    summary:
      'Com forte protagonismo do Rio Grande do Sul — incluindo Vale dos Vinhedos, Campanha Gaúcha, Farroupilha e Pinto Bandeira — os rótulos nacionais brilham em espumantes, tintos e brancos.',
    highlights: ['Vale dos Vinhedos', 'Merlot & Cabernet Franc', 'Chardonnay & Moscato'],
  },
];

export const WHATSAPP_GROUPS = [
  { id: 'g1', label: 'Grupo 01', url: 'https://chat.whatsapp.com/DvKB4kdDt49EQ2OQ625Oq0' },
  { id: 'g2', label: 'Grupo 02', url: 'https://chat.whatsapp.com/JFlwFW1i1JSKZaJjOjX79S' },
  { id: 'g3', label: 'Grupo 03', url: 'https://chat.whatsapp.com/LxKk2lsSWj3CxVK6bVrddu' },
  { id: 'g4', label: 'Grupo 04', url: 'https://chat.whatsapp.com/CgqcEqpePN2HRfjSEK4M9k' },
  { id: 'g5', label: 'Grupo 05', url: 'https://chat.whatsapp.com/CmFYfuRKCAkCV7rsryJePl' },
];

export const INSTAGRAM_REELS = [
  {
    id: 'reel1',
    imageKey: 'reel-1',
    title: 'Ofertas e Bastidores nas Lojas PB',
    caption: 'Confira os destaques da semana direto das nossas unidades em Belém e Ananindeua.',
    url: 'https://www.instagram.com/reel/CzyyPE9OuVI/',
    thumb: '/pb-assets/slide-ofertas-semana.webp',
  },
  {
    id: 'reel2',
    imageKey: 'reel-2',
    title: 'Novidades Cliente PB no Instagram',
    caption: 'Dicas de economia, lançamentos e momentos com nossos clientes e colaboradores.',
    url: 'https://www.instagram.com/reel/CvNADRSrh5d/',
    thumb: '/pb-assets/cesta-frutas.webp',
  },
  {
    id: 'reel3',
    imageKey: 'reel-3',
    title: 'Tradição e Qualidade Grupo Preço Baixo',
    caption: 'No varejo e no atacado, é sempre Preço Baixo para você e sua família.',
    url: 'https://www.instagram.com/reel/CmMPxjCDdB-/',
    thumb: '/pb-assets/seja-pb.webp',
  },
];

export const SALARY_REPORTS = [
  { store: 'Una', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Una.pdf' },
  { store: 'Tenoné', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Tenone.pdf' },
  { store: 'Tapanã', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Tapana.pdf' },
  { store: 'Senador Lemos', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Senador.pdf' },
  { store: 'Augusto Montenegro', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Augusto.pdf' },
  { store: 'Icuí', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Icui.pdf' },
  { store: 'Cidade Nova', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Cidade-Nova.pdf' },
  { store: 'BR-316', url: 'https://precobaixoatacadista.com.br/wp-content/uploads/2026/09/Relatorio-de-Igualdade-Salarial-Br.pdf' },
];

export const SITE_IMAGE_CATALOG: SiteImageSlot[] = [
  {
    key: 'logo-branca',
    label: 'Logotipo Oficial Preço Baixo (Cabeçalho e Rodapé)',
    section: 'Identidade Visual',
    defaultUrl: '/pb-assets/logo-branca.png',
    recommendedSize: '450 × 115 px',
    aspectRatio: '4:1 (Horizontal)',
    formatHint: 'PNG ou WEBP com fundo transparente (máx. 6 MB)',
  },
  {
    key: 'hero-bg',
    label: 'Imagem de Fundo do Banner Principal (Hero)',
    section: 'Identidade Visual',
    defaultUrl: '/pb-assets/bg-hero.webp',
    recommendedSize: '1920 × 1080 px (mín. 1080 × 700 px)',
    aspectRatio: '16:9 (Paisagem / Tela Cheia)',
    formatHint: 'WEBP ou JPG otimizado (máx. 6 MB)',
  },
  ...CAMPAIGN_SLIDES.map((s) => ({
    key: s.imageKey,
    label: `Campanha: ${s.title}`,
    section: 'Campanhas (Hero)' as const,
    defaultUrl: s.image,
    recommendedSize: '1200 × 600 px',
    aspectRatio: '2:1 (Banner Horizontal)',
    formatHint: 'WEBP, PNG ou JPG (máx. 6 MB)',
  })),
  ...ACTIVE_FLYERS.map((f) => ({
    key: f.imageKey,
    label: `Encarte: ${f.title}`,
    section: 'Encartes Ativos' as const,
    defaultUrl: f.image,
    recommendedSize: '864 × 1536 px (ou 900 × 1400 px)',
    aspectRatio: '9:14 / 9:16 (Vertical)',
    formatHint: 'PNG ou WEBP em alta resolução (máx. 6 MB)',
  })),
  {
    key: 'food-service-card',
    label: 'Banner Atacado & Comércio (Food Service)',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/slide-food-service.webp',
    recommendedSize: '1200 × 600 px',
    aspectRatio: '2:1 (Banner Horizontal)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  },
  {
    key: 'cesta-frutas',
    label: 'Cesta de Frutas Frescas (Seção Nossa História)',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/cesta-frutas.webp',
    recommendedSize: '1080 × 920 px',
    aspectRatio: '6:5 (Horizontal / Quadrada)',
    formatHint: 'WEBP ou PNG com fundo transparente (máx. 6 MB)',
  },
  {
    key: 'seja-pb',
    label: 'Banner #SejaPB Faça Parte do Time',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/seja-pb.webp',
    recommendedSize: '1024 × 683 px',
    aspectRatio: '3:2 (Horizontal)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  },
  {
    key: 'trabalhe-conosco',
    label: 'Foto Card Trabalhe Conosco (Fale Conosco)',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/trabalhe-conosco.webp',
    recommendedSize: '1024 × 1024 px (mín. 512 × 512 px)',
    aspectRatio: '1:1 (Quadrada)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  },
  {
    key: 'homem-cartao-pb',
    label: 'Destaque Cartão Preço Baixo',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/homem-cartao-pb.png',
    recommendedSize: '675 × 575 px (ou 800 × 680 px)',
    aspectRatio: '7:6 (Horizontal / Recorte)',
    formatHint: 'PNG com fundo transparente (máx. 6 MB)',
  },
  {
    key: 'farma-destaque',
    label: 'Destaque Farmácias Preço Baixo (PB Farma)',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/farma-destaque.webp',
    recommendedSize: '768 × 512 px (ou 1200 × 800 px)',
    aspectRatio: '3:2 (Paisagem)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  },
  {
    key: 'adega-harmonizacao',
    label: 'Destaque Adega Preço Baixo',
    section: 'Institucional & Serviços',
    defaultUrl: '/pb-assets/adega-harmonizacao.webp',
    recommendedSize: '600 × 600 px (ou 1000 × 1000 px)',
    aspectRatio: '1:1 (Quadrada)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  },
  ...STORES.map((st) => ({
    key: st.imageKey,
    label: `Fachada / Foto ${st.name}`,
    section: 'Fotos das 8 Lojas' as const,
    defaultUrl: st.photoImage,
    recommendedSize: '1024 × 768 px (mín. 800 × 600 px)',
    aspectRatio: '4:3 (Paisagem)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  })),
  ...APP_MEU_PB_STEPS.map((step) => ({
    key: step.imageKey,
    label: `Tela App Meu PB — Passo ${step.step}: ${step.title}`,
    section: 'Telas App Meu PB' as const,
    defaultUrl: step.screen,
    recommendedSize: step.imageKey === 'app-step-5' ? '518 × 1024 px' : '300 × 450 px (ou 600 × 900 px)',
    aspectRatio: step.imageKey === 'app-step-5' ? '1:2 (Mockup Celular)' : '2:3 (Tela Vertical)',
    formatHint: 'WEBP ou PNG (máx. 6 MB)',
  })),
  ...PHARMACIES.map((f) => ({
    key: f.imageKey,
    label: `Unidade ${f.name}`,
    section: 'PB Farma & Instagram' as const,
    defaultUrl: f.image,
    recommendedSize: '400 × 270 px (ou 600 × 400 px)',
    aspectRatio: '3:2 (Miniatura)',
    formatHint: 'WEBP ou PNG (máx. 6 MB)',
  })),
  ...INSTAGRAM_REELS.map((r) => ({
    key: r.imageKey,
    label: `Capa Instagram Reel: ${r.title}`,
    section: 'PB Farma & Instagram' as const,
    defaultUrl: r.thumb,
    recommendedSize: '800 × 600 px (mín. 640 × 480 px)',
    aspectRatio: '4:3 (Capa Horizontal)',
    formatHint: 'WEBP ou JPG (máx. 6 MB)',
  })),
];


