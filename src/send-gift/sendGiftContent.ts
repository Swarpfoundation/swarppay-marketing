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
      headline: 'بقى قريب من الناس اللي كتحب، حتى من بعيد',
      subheadline:
        'اختار كارت كادو ولا ڤوتشر رقمي، خلّص أونلاين، وصيفط الكود مباشرة للشخص اللي بغيتي.',
      primaryCta: 'شري كارت كادو',
      secondaryCta: 'كيفاش كتخدم؟',
      trustLine: 'حل بسيط باش تعاون حبابك والمحلات اللي كتستعمل كل نهار.',
    },
    howItWorks: {
      title: 'كيفاش كتخدم؟',
      steps: [
        {
          title: 'اختار المنتج',
          text: 'اختار من بين كروت الكادو، الڤوتشرات، التعبئات ولا منتجات رقمية أخرى.',
        },
        {
          title: 'خلّص أونلاين',
          text: 'كمّل الشراء بطريقة سهلة مع SwarpPay.',
        },
        {
          title: 'صيفط الكود',
          text: 'شارك الكود مع اللي بغيتي.',
        },
        {
          title: 'يستعملو فالمغرب',
          text: 'المستفيد كيستعملو حسب شروط الخدمة.',
        },
      ],
    },
    send: {
      title: 'شنو تقدر تصيفط؟',
      cards: [
        'تعبئات وتوب-أپ رقمية',
        'كروت للألعاب',
        'اشتراكات وكروت الستريمنغ',
        'كروت كادو للمحلات والبراندات',
        'ڤوتشرات ومنتجات أخرى مسبقة الدفع',
        'منتجات رقمية أخرى متوفرة فالمنصة',
      ],
    },
    audience: {
      title: 'لمن هاد الخدمة؟',
      cards: [
        {
          title: 'للناس اللي عايشين فالخارج وعندهم عائلة فالمغرب',
          text: 'صيفط كادو رقمي لحبابك فالمغرب بطريقة بسيطة وسريعة.',
        },
        {
          title: 'للعائلات فالمغرب',
          text: 'توصل بكود رقمي واستعملو فالمنتجات والخدمات المدعومة.',
        },
        {
          title: 'للتجار والريسلرز',
          text: 'عرض وبيع منتجات رقمية للزبناء ديالك عبر SwarpPay.',
        },
      ],
    },
    why: {
      title: 'علاش SwarpPay؟',
      benefits: [
        {
          title: 'ساهلة فالاستعمال',
          text: 'شري وصيفط الكود فخطوات قليلة.',
        },
        {
          title: 'مفيدة',
          text: 'عاون عائلتك وحبابك يتوصلو بمنتجات وخدمات.',
        },
        {
          title: 'رقمية',
          text: 'كلشي كيدوز أونلاين، بطريقة بسيطة وسريعة.',
        },
        {
          title: 'مرنة',
          text: 'تقدر تختار من تصنيفات مختلفة، حسب المتوفر.',
        },
        {
          title: 'مبنية للمغرب',
          text: 'SwarpPay مصممة باش تربط العائلات، التجار، والمجتمعات بين المغرب وباقي العالم.',
        },
      ],
    },
    merchant: {
      title: 'عندك محل تجاري؟',
      text: 'إلا كان عندك محل، نقطة تيليكوم، سايبر، محل إلكترونيات ولا نقطة خدمات، تقدر تولي جزء من SwarpPay وتعرض منتجات رقمية للزبناء ديالك.',
      cta: 'دخل للپورتال',
      secondary: 'تواصل معنا',
    },
    faq: {
      title: 'أسئلة متداولة',
      items: [
        {
          title: 'شنو هي الكارت كادو الرقمية؟',
          text: 'هي كود رقمي تقدر تشريه وتصيفطو لشخص آخر باش يستعملو فمنتجات ولا خدمات مدعومة.',
        },
        {
          title: 'واش نقدر نصيفطها لشخص فالمغرب؟',
          text: 'نعم. تقدر تشري منتج رقمي متوفر وتشارك الكود مع اللي بغيتي.',
        },
        {
          title: 'شنو المنتجات المتوفرة؟',
          text: 'كيعتمد على كاتالوگ SwarpPay. التصنيفات ممكن تشمل التعبئات، الألعاب، الستريمنغ، كروت الريتيل ومنتجات رقمية أخرى.',
        },
        {
          title: 'واش هادي خدمة تحويل فلوس؟',
          text: 'لا. SwarpPay كتمكّنك تشري وتصيفط منتجات وڤوتشرات رقمية. أي خدمات مستقبلية غادي تتفعّل غير فالبلايص اللي كيسمح بها القانون ومع شركاء مرخّصين.',
        },
        {
          title: 'واش التجار يقدرو يبيعو منتجات SwarpPay؟',
          text: 'نعم. التجار والريسلرز يقدرو يترشحو من خلال Merchant Portal.',
        },
      ],
    },
    finalCta: {
      title: 'صيفط أول كادو رقمي ديالك',
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
      headline: 'Restez proche des personnes que vous aimez, même à distance',
      subheadline:
        'Choisissez une carte cadeau ou un voucher digital, payez en ligne et envoyez le code directement à la personne de votre choix.',
      primaryCta: 'Acheter une carte cadeau',
      secondaryCta: 'Comment ça marche ?',
      trustLine:
        'Une solution simple pour soutenir vos proches et les commerces que vous utilisez au quotidien.',
    },
    howItWorks: {
      title: 'Comment ça marche ?',
      steps: [
        {
          title: 'Choisissez le produit',
          text: 'Choisissez parmi des cartes cadeaux, vouchers, recharges ou autres produits digitaux.',
        },
        {
          title: 'Payez en ligne',
          text: 'Finalisez l’achat simplement avec SwarpPay.',
        },
        {
          title: 'Envoyez le code',
          text: 'Partagez le code avec la personne de votre choix.',
        },
        {
          title: 'Utilisation au Maroc',
          text: 'Le destinataire l’utilise selon les conditions du service.',
        },
      ],
    },
    send: {
      title: 'Que pouvez-vous envoyer ?',
      cards: [
        'Recharges et top-ups digitaux',
        'Cartes pour le gaming',
        'Abonnements et cartes streaming',
        'Cartes cadeaux pour boutiques et marques',
        'Vouchers et autres produits prépayés',
        'Autres produits digitaux disponibles sur la plateforme',
      ],
    },
    audience: {
      title: 'Pour qui ?',
      cards: [
        {
          title: 'Pour les personnes vivant à l’étranger et ayant de la famille au Maroc',
          text: 'Envoyez un cadeau digital à vos proches au Maroc, simplement et rapidement.',
        },
        {
          title: 'Pour les familles au Maroc',
          text: 'Recevez un code digital et utilisez-le sur les produits et services supportés.',
        },
        {
          title: 'Pour les commerçants et revendeurs',
          text: 'Proposez et vendez des produits digitaux à vos clients via SwarpPay.',
        },
      ],
    },
    why: {
      title: 'Pourquoi SwarpPay ?',
      benefits: [
        {
          title: 'Facile à utiliser',
          text: 'Achetez et envoyez le code en quelques étapes.',
        },
        {
          title: 'Utile',
          text: 'Aidez votre famille et vos proches à recevoir des produits et services.',
        },
        {
          title: 'Digital',
          text: 'Tout se passe en ligne, simplement et immédiatement.',
        },
        {
          title: 'Flexible',
          text: 'Vous pouvez choisir parmi plusieurs catégories, selon disponibilité.',
        },
        {
          title: 'Pensé pour le Maroc',
          text: 'SwarpPay est pensé pour connecter les familles, les commerçants et les communautés entre le Maroc et le reste du monde.',
        },
      ],
    },
    merchant: {
      title: 'Vous êtes commerçant ?',
      text: 'Si vous avez une boutique, un point télécom, un cybercafé, un magasin d’électronique ou un point de service, vous pouvez rejoindre SwarpPay et proposer des produits digitaux à vos clients.',
      cta: 'Accéder au portail',
      secondary: 'Nous contacter',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          title: 'Qu’est-ce qu’une carte cadeau digitale ?',
          text: 'C’est un code digital que vous pouvez acheter et envoyer à une autre personne pour l’utiliser sur des produits ou services supportés.',
        },
        {
          title: 'Puis-je l’envoyer à quelqu’un au Maroc ?',
          text: 'Oui. Vous pouvez acheter un produit digital disponible et partager le code avec la personne de votre choix.',
        },
        {
          title: 'Quels produits sont disponibles ?',
          text: 'Cela dépend du catalogue SwarpPay. Les catégories peuvent inclure recharges, gaming, streaming, cartes retail et autres produits digitaux.',
        },
        {
          title: 'Est-ce un service de transfert d’argent ?',
          text: 'Non. SwarpPay permet d’acheter et d’envoyer des produits et vouchers digitaux. D’éventuels futurs services seront activés uniquement là où la réglementation le permet et avec des partenaires autorisés.',
        },
        {
          title: 'Les commerçants peuvent-ils vendre les produits SwarpPay ?',
          text: 'Oui. Les commerçants et revendeurs peuvent candidater via le Merchant Portal.',
        },
      ],
    },
    finalCta: {
      title: 'Envoyez votre premier cadeau digital',
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
      headline: 'Resta vicino alle persone che ami, anche da lontano',
      subheadline:
        'Scegli una gift card o un voucher digitale, paga online e invia il codice direttamente a chi vuoi.',
      primaryCta: 'Acquista una gift card',
      secondaryCta: 'Come funziona?',
      trustLine:
        'Una soluzione semplice per sostenere i propri cari e le attività commerciali che usi ogni giorno.',
    },
    howItWorks: {
      title: 'Come funziona?',
      steps: [
        {
          title: 'Scegli il prodotto',
          text: 'Scegli tra gift card, voucher, ricariche o altri prodotti digitali.',
        },
        {
          title: 'Paga online',
          text: 'Completa l’acquisto in modo semplice con SwarpPay.',
        },
        {
          title: 'Invia il codice',
          text: 'Condividi il codice con chi vuoi.',
        },
        {
          title: 'Utilizzo in Marocco',
          text: 'Il destinatario lo utilizza secondo le condizioni del servizio.',
        },
      ],
    },
    send: {
      title: 'Cosa puoi inviare?',
      cards: [
        'Ricariche e top-up digitali',
        'Carte per il gaming',
        'Abbonamenti e carte streaming',
        'Gift card per negozi e brand',
        'Voucher e altri prodotti prepagati',
        'Altri prodotti digitali disponibili sulla piattaforma',
      ],
    },
    audience: {
      title: 'Per chi è pensato?',
      cards: [
        {
          title: 'Per chi vive all’estero e ha famiglia in Marocco',
          text: 'Invia un regalo digitale ai tuoi cari in Marocco, in modo semplice e veloce.',
        },
        {
          title: 'Per le famiglie in Marocco',
          text: 'Ricevi un codice digitale e utilizzalo sui prodotti e servizi supportati.',
        },
        {
          title: 'Per i commercianti e rivenditori',
          text: 'Offri e vendi prodotti digitali ai tuoi clienti attraverso SwarpPay.',
        },
      ],
    },
    why: {
      title: 'Perché SwarpPay?',
      benefits: [
        {
          title: 'Facile da usare',
          text: 'Acquisti e invii il codice in pochi passaggi.',
        },
        {
          title: 'Utile',
          text: 'Aiuta la tua famiglia e i tuoi cari a ricevere prodotti e servizi.',
        },
        {
          title: 'Digitale',
          text: 'Tutto avviene online, in modo semplice e immediato.',
        },
        {
          title: 'Flessibile',
          text: 'Puoi scegliere tra diverse categorie, in base alla disponibilità.',
        },
        {
          title: 'Pensato per il Marocco',
          text: 'SwarpPay è pensato per mettere in contatto famiglie, commercianti e comunità tra Marocco e resto del mondo.',
        },
      ],
    },
    merchant: {
      title: 'Sei un commerciante?',
      text: 'Se hai un negozio, un punto telecom, un cybercafé, un negozio di elettronica o un punto servizi, puoi entrare a far parte di SwarpPay e offrire prodotti digitali ai tuoi clienti.',
      cta: 'Accedi al portale',
      secondary: 'Contattaci',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          title: 'Cos’è una gift card digitale?',
          text: 'È un codice digitale che puoi acquistare e inviare a un’altra persona per utilizzarlo su prodotti o servizi supportati.',
        },
        {
          title: 'Posso inviarla a qualcuno in Marocco?',
          text: 'Sì. Puoi acquistare un prodotto digitale disponibile e condividere il codice con chi vuoi.',
        },
        {
          title: 'Quali prodotti sono disponibili?',
          text: 'Dipende dal catalogo SwarpPay. Le categorie possono includere ricariche, gaming, streaming, carte retail e altri prodotti digitali.',
        },
        {
          title: 'È un servizio di trasferimento di denaro?',
          text: 'No. SwarpPay permette di acquistare e inviare prodotti e voucher digitali. Eventuali servizi futuri saranno attivati solo dove consentito dalla normativa e con partner autorizzati.',
        },
        {
          title: 'I commercianti possono vendere prodotti SwarpPay?',
          text: 'Sì. Commercianti e rivenditori possono candidarsi tramite il Merchant Portal.',
        },
      ],
    },
    finalCta: {
      title: 'Invia il tuo primo regalo digitale',
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
