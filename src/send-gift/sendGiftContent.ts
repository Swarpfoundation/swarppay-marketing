export const languages = ['darija', 'fr', 'it'] as const;

export type SendGiftLanguage = (typeof languages)[number];

export const languageLabels: Record<SendGiftLanguage, string> = {
  darija: 'الدارجة',
  fr: 'Français',
  it: 'Italiano',
};

export const languageDirections: Record<SendGiftLanguage, 'rtl' | 'ltr'> = {
  darija: 'rtl',
  fr: 'ltr',
  it: 'ltr',
};

type TitledText = {
  title: string;
  text: string;
};

type Step = TitledText;

type SendGiftContent = {
  pageLabel: string;
  sectionLabel: string;
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    trustLine: string;
  };
  howItWorks: {
    title: string;
    steps: Step[];
  };
  send: {
    title: string;
    cards: string[];
  };
  audience: {
    title: string;
    cards: TitledText[];
  };
  why: {
    title: string;
    benefits: TitledText[];
  };
  merchant: {
    title: string;
    text: string;
    cta: string;
    secondary: string;
  };
  faq: {
    title: string;
    items: TitledText[];
  };
  finalCta: {
    title: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: {
    contact: string;
    terms: string;
    privacy: string;
    cookies: string;
  };
};

export const sendGiftContent: Record<SendGiftLanguage, SendGiftContent> = {
  darija: {
    pageLabel: 'كادو رقمي',
    sectionLabel: 'SwarpPay',
    hero: {
      headline: 'صيفط كادو رقمي لعائلتك فالمغرب',
      subheadline:
        'اختار كارت كادو ولا ڤوتشر رقمي، خلّص أونلاين، وصيفط الكود للشخص اللي بغيتي فالمغرب.',
      primaryCta: 'شري كارت كادو',
      secondaryCta: 'كيفاش كتخدم؟',
      trustLine: 'خدمة بسيطة للدياسبورا، العائلات، والتجار فالمغرب.',
    },
    howItWorks: {
      title: 'كيفاش كتخدم؟',
      steps: [
        {
          title: 'اختار المنتج',
          text: 'اختار كارت كادو، ڤوتشر، توب-أپ، ولا منتج رقمي.',
        },
        {
          title: 'خلّص أونلاين',
          text: 'كمّل الشراء بطريقة سهلة من خلال SwarpPay.',
        },
        {
          title: 'صيفط الكود',
          text: 'شارك الكود الرقمي مع العائلة ولا الشخص اللي بغيتي.',
        },
        {
          title: 'يستعملو فالمغرب',
          text: 'المستفيد يقدر يستعمل المنتج حسب الشروط ديالو.',
        },
      ],
    },
    send: {
      title: 'شنو تقدر تصيفط؟',
      cards: [
        'توب-أپ وتعبئة رقمية',
        'كروت الألعاب',
        'كروت الستريمنغ',
        'كروت التسوق',
        'ڤوتشرات وخدمات مسبقة الدفع',
        'منتجات رقمية أخرى حسب المتوفر',
      ],
    },
    audience: {
      title: 'لمن هاد الخدمة؟',
      cards: [
        {
          title: 'المغاربة فالخارج',
          text: 'صيفط كادو رقمي لعائلتك فالمغرب بطريقة بسيطة.',
        },
        {
          title: 'العائلات فالمغرب',
          text: 'توصل بكود رقمي وتستعملو فالمنتجات المدعومة.',
        },
        {
          title: 'التجار والريسلرز',
          text: 'بيع منتجات رقمية للزبناء من خلال SwarpPay.',
        },
      ],
    },
    why: {
      title: 'علاش SwarpPay؟',
      benefits: [
        {
          title: 'ساهلة',
          text: 'شري وصيفط الكود بسرعة.',
        },
        {
          title: 'مفيدة',
          text: 'عاون عائلتك بمنتجات يقدرو يستعملوها.',
        },
        {
          title: 'رقمية',
          text: 'الكود كيوصل بطريقة رقمية.',
        },
        {
          title: 'مرنة',
          text: 'اختار من تصنيفات مختلفة حسب المتوفر.',
        },
        {
          title: 'مبنية للمغرب',
          text: 'SwarpPay مركزة على المستهلكين، التجار، والدياسبورا المغربية.',
        },
      ],
    },
    merchant: {
      title: 'عندك محل تجاري؟',
      text: 'إلا كنتي تاجر، صاحب تيليكوم، سايبر، محل إلكترونيات، ولا نقطة خدمات، تقدر تنضم لـ SwarpPay وتبيع منتجات رقمية للزبناء ديالك.',
      cta: 'دخول Merchant Portal',
      secondary: 'تواصل معنا',
    },
    faq: {
      title: 'أسئلة متداولة',
      items: [
        {
          title: 'شنو هي الكارت كادو الرقمية؟',
          text: 'هي كود رقمي تقدر تشريه وتصيفطو لشخص آخر باش يستعملو فمنتج ولا خدمة مدعومة.',
        },
        {
          title: 'واش نقدر نصيفطها لشخص فالمغرب؟',
          text: 'نعم. تقدر تشري منتج رقمي مدعوم وتصيفط الكود للشخص اللي بغيتي.',
        },
        {
          title: 'شنو المنتجات المتوفرة؟',
          text: 'المنتجات كتبدل حسب الكاتالوگ المتوفر فـ SwarpPay. التصنيفات ممكن تشمل التوب-أپ، الألعاب، الستريمنغ، الريتيل، والمنتجات المسبقة الدفع.',
        },
        {
          title: 'واش هادي خدمة تحويل فلوس؟',
          text: 'لا. SwarpPay دابا كتعاونك تشري وتصيفط منتجات رقمية وڤوتشرات. أي خدمات مالية مستقبلية غادي تكون غير إلا كانت متاحة قانونياً ومع شركاء مناسبين.',
        },
        {
          title: 'واش التجار يقدرو يبيعو منتجات SwarpPay؟',
          text: 'نعم. التجار والريسلرز يقدرو يقدمو الطلب من خلال Merchant Portal.',
        },
      ],
    },
    finalCta: {
      title: 'بدا بكادو رقمي',
      text: 'شري منتج رقمي وصيفطو لعائلتك فالمغرب.',
      primaryCta: 'شري كارت كادو',
      secondaryCta: 'أنا تاجر',
    },
    footer: {
      contact: 'تواصل معنا: info@swarppay.com',
      terms: 'الشروط',
      privacy: 'الخصوصية',
      cookies: 'الكوكيز',
    },
  },
  fr: {
    pageLabel: 'Cadeau digital',
    sectionLabel: 'SwarpPay',
    hero: {
      headline: 'Envoyez un cadeau digital à votre famille au Maroc',
      subheadline:
        'Choisissez une carte cadeau ou un voucher digital, payez en ligne, puis envoyez le code à la personne de votre choix au Maroc.',
      primaryCta: 'Acheter une carte cadeau',
      secondaryCta: 'Comment ça marche ?',
      trustLine:
        'Une solution simple pour la diaspora, les familles et les commerçants au Maroc.',
    },
    howItWorks: {
      title: 'Comment ça marche ?',
      steps: [
        {
          title: 'Choisissez le produit',
          text: 'Sélectionnez une carte cadeau, un voucher, un top-up ou un produit digital.',
        },
        {
          title: 'Payez en ligne',
          text: 'Finalisez l’achat simplement avec SwarpPay.',
        },
        {
          title: 'Envoyez le code',
          text: 'Partagez le code digital avec votre famille ou votre destinataire.',
        },
        {
          title: 'Utilisation au Maroc',
          text: 'Le bénéficiaire utilise le produit selon ses conditions d’utilisation.',
        },
      ],
    },
    send: {
      title: 'Que pouvez-vous envoyer ?',
      cards: [
        'Recharges et top-ups digitaux',
        'Cartes gaming',
        'Cartes streaming',
        'Cartes retail',
        'Vouchers et produits prépayés',
        'Autres produits digitaux selon disponibilité',
      ],
    },
    audience: {
      title: 'Pour qui ?',
      cards: [
        {
          title: 'Marocains à l’étranger',
          text: 'Envoyez un cadeau digital à votre famille au Maroc.',
        },
        {
          title: 'Familles au Maroc',
          text: 'Recevez un code digital et utilisez-le sur les produits compatibles.',
        },
        {
          title: 'Commerçants et revendeurs',
          text: 'Vendez des produits digitaux à vos clients avec SwarpPay.',
        },
      ],
    },
    why: {
      title: 'Pourquoi SwarpPay ?',
      benefits: [
        {
          title: 'Simple',
          text: 'Achetez et envoyez un code rapidement.',
        },
        {
          title: 'Utile',
          text: 'Aidez votre famille avec des produits qu’elle peut utiliser.',
        },
        {
          title: 'Digital',
          text: 'Le code est livré de manière digitale.',
        },
        {
          title: 'Flexible',
          text: 'Choisissez parmi plusieurs catégories selon disponibilité.',
        },
        {
          title: 'Conçu pour le Maroc',
          text: 'SwarpPay se concentre sur les consommateurs, commerçants et la diaspora marocaine.',
        },
      ],
    },
    merchant: {
      title: 'Vous êtes commerçant ?',
      text: 'Si vous êtes un commerçant, vendeur télécom, cybercafé, magasin électronique ou point de service, vous pouvez rejoindre SwarpPay et vendre des produits digitaux à vos clients.',
      cta: 'Ouvrir le Merchant Portal',
      secondary: 'Nous contacter',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          title: 'Qu’est-ce qu’une carte cadeau digitale ?',
          text: 'C’est un code digital que vous pouvez acheter et envoyer à une autre personne pour utiliser un produit ou service compatible.',
        },
        {
          title: 'Puis-je l’envoyer à quelqu’un au Maroc ?',
          text: 'Oui. Vous pouvez acheter un produit digital compatible et partager le code avec la personne de votre choix.',
        },
        {
          title: 'Quels produits sont disponibles ?',
          text: 'La disponibilité dépend du catalogue SwarpPay. Les catégories peuvent inclure top-ups, gaming, streaming, retail et produits prépayés.',
        },
        {
          title: 'Est-ce un service de transfert d’argent ?',
          text: 'Non. SwarpPay permet actuellement d’acheter et d’envoyer des produits digitaux et des vouchers. Les futurs services financiers seront proposés uniquement lorsqu’ils seront légalement disponibles et avec les partenaires appropriés.',
        },
        {
          title: 'Les commerçants peuvent-ils vendre les produits SwarpPay ?',
          text: 'Oui. Les commerçants et revendeurs peuvent faire une demande via le Merchant Portal.',
        },
      ],
    },
    finalCta: {
      title: 'Commencez avec un cadeau digital',
      text: 'Achetez un produit digital et envoyez-le à votre famille au Maroc.',
      primaryCta: 'Acheter une carte cadeau',
      secondaryCta: 'Je suis commerçant',
    },
    footer: {
      contact: 'Contact: info@swarppay.com',
      terms: 'Conditions',
      privacy: 'Confidentialité',
      cookies: 'Cookies',
    },
  },
  it: {
    pageLabel: 'Regalo digitale',
    sectionLabel: 'SwarpPay',
    hero: {
      headline: 'Invia un regalo digitale alla tua famiglia in Marocco',
      subheadline:
        'Scegli una gift card o un voucher digitale, paga online e invia il codice alla persona che vuoi in Marocco.',
      primaryCta: 'Acquista una gift card',
      secondaryCta: 'Come funziona?',
      trustLine:
        'Una soluzione semplice per diaspora, famiglie e commercianti in Marocco.',
    },
    howItWorks: {
      title: 'Come funziona?',
      steps: [
        {
          title: 'Scegli il prodotto',
          text: 'Seleziona una gift card, un voucher, una ricarica o un prodotto digitale.',
        },
        {
          title: 'Paga online',
          text: 'Completa l’acquisto in modo semplice con SwarpPay.',
        },
        {
          title: 'Invia il codice',
          text: 'Condividi il codice digitale con la tua famiglia o con il destinatario.',
        },
        {
          title: 'Utilizzo in Marocco',
          text: 'Il destinatario usa il prodotto secondo le condizioni previste.',
        },
      ],
    },
    send: {
      title: 'Cosa puoi inviare?',
      cards: [
        'Ricariche e top-up digitali',
        'Carte gaming',
        'Carte streaming',
        'Carte retail',
        'Voucher e prodotti prepagati',
        'Altri prodotti digitali secondo disponibilità',
      ],
    },
    audience: {
      title: 'Per chi è pensato?',
      cards: [
        {
          title: 'Marocchini all’estero',
          text: 'Invia un regalo digitale alla tua famiglia in Marocco.',
        },
        {
          title: 'Famiglie in Marocco',
          text: 'Ricevi un codice digitale e usalo sui prodotti supportati.',
        },
        {
          title: 'Commercianti e rivenditori',
          text: 'Vendi prodotti digitali ai tuoi clienti con SwarpPay.',
        },
      ],
    },
    why: {
      title: 'Perché SwarpPay?',
      benefits: [
        {
          title: 'Semplice',
          text: 'Acquista e invia un codice rapidamente.',
        },
        {
          title: 'Utile',
          text: 'Aiuta la tua famiglia con prodotti che può usare.',
        },
        {
          title: 'Digitale',
          text: 'Il codice viene consegnato in formato digitale.',
        },
        {
          title: 'Flessibile',
          text: 'Scegli tra diverse categorie secondo disponibilità.',
        },
        {
          title: 'Pensato per il Marocco',
          text: 'SwarpPay è focalizzata su consumatori, commercianti e diaspora marocchina.',
        },
      ],
    },
    merchant: {
      title: 'Sei un commerciante?',
      text: 'Se hai un negozio, un punto telecom, un cybercafé, un negozio di elettronica o un punto servizi, puoi entrare in SwarpPay e vendere prodotti digitali ai tuoi clienti.',
      cta: 'Apri il Merchant Portal',
      secondary: 'Contattaci',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          title: 'Cos’è una gift card digitale?',
          text: 'È un codice digitale che puoi acquistare e inviare a un’altra persona per usare un prodotto o servizio supportato.',
        },
        {
          title: 'Posso inviarla a qualcuno in Marocco?',
          text: 'Sì. Puoi acquistare un prodotto digitale supportato e condividere il codice con il destinatario.',
        },
        {
          title: 'Quali prodotti sono disponibili?',
          text: 'La disponibilità dipende dal catalogo SwarpPay. Le categorie possono includere top-up, gaming, streaming, retail e prodotti prepagati.',
        },
        {
          title: 'È un servizio di trasferimento di denaro?',
          text: 'No. SwarpPay attualmente aiuta gli utenti ad acquistare e inviare prodotti digitali e voucher. Eventuali servizi finanziari futuri saranno offerti solo dove legalmente disponibili e con partner appropriati.',
        },
        {
          title: 'I commercianti possono vendere prodotti SwarpPay?',
          text: 'Sì. Commercianti e rivenditori possono fare richiesta tramite il Merchant Portal.',
        },
      ],
    },
    finalCta: {
      title: 'Inizia con un regalo digitale',
      text: 'Acquista un prodotto digitale e invialo alla tua famiglia in Marocco.',
      primaryCta: 'Acquista una gift card',
      secondaryCta: 'Sono un commerciante',
    },
    footer: {
      contact: 'Contatto: info@swarppay.com',
      terms: 'Termini',
      privacy: 'Privacy',
      cookies: 'Cookies',
    },
  },
};

export function resolveSendGiftLanguage(value: string | null): SendGiftLanguage {
  return languages.includes(value as SendGiftLanguage) ? (value as SendGiftLanguage) : 'darija';
}
