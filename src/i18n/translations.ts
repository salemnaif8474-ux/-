export type Language = "en" | "ar";

export interface BranchGroup {
  city: string;
  locations: string[];
}

export interface Translation {
  brandName: string;
  brandSubtitle: string;
  companyFullName: string;
  tagline: string;
  brands: string[];
  nav: {
    about: string;
    specialization: string;
    branches: string;
    contact: string;
    getInTouch: string;
    staffLogin: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
  };
  specialization: {
    title: string;
    intro: string;
    outro: string;
  };
  branches: {
    title: string;
    intro: string;
    groups: BranchGroup[];
    outro: string;
  };
  vision: {
    title: string;
    paragraph1: string;
    paragraph2: string;
  };
  mission: {
    title: string;
    body: string;
  };
  founder: {
    title: string;
    name: string;
    role: string;
    bio: string;
  };
  whyUs: {
    title: string;
    points: string[];
  };
  contact: {
    title: string;
    companyName: string;
    emailLabel: string;
    email: string;
    phoneLabel: string;
    phone: string;
    locationLabel: string;
    location: string;
    ctaButton: string;
  };
  footer: {
    rights: string;
    staffLogin: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    brandName: "Damm Al-Marakib",
    brandSubtitle: "Automotive Spare Parts",
    companyFullName: "Damm Al-Marakib Trading Company",
    tagline: "Reliable Parts. Trusted Service.",
    brands: ["Toyota", "Lexus", "Daihatsu", "Suzuki"],
    nav: {
      about: "About Us",
      specialization: "Specialization",
      branches: "Our Branches",
      contact: "Contact Us",
      getInTouch: "Get in Touch",
      staffLogin: "Staff Login",
    },
    hero: {
      eyebrow: "Damm Al-Marakib Trading Company",
      heading: "Reliable Parts. Trusted Service.",
      body: "A specialized automotive spare parts company operating in the Kingdom of Saudi Arabia, dedicated to providing high-quality and reliable spare parts with professional service and trusted solutions.",
      ctaPrimary: "Get in Touch",
      ctaSecondary: "Our Branches",
    },
    about: {
      title: "About Us",
      paragraph1:
        "Damm Al-Marakib Trading Company is a specialized automotive spare parts company operating in the Kingdom of Saudi Arabia. We are dedicated to providing high-quality and reliable spare parts while delivering professional service and trusted solutions to our customers.",
      paragraph2: "Our business focuses on automotive spare parts for a range of well-known Japanese vehicle brands, including:",
      paragraph3:
        "We strive to make finding the right spare part easier, faster, and more reliable by combining product availability, professional service, and customer-focused support.",
    },
    specialization: {
      title: "Our Specialization",
      intro: "We specialize in automotive spare parts for:",
      outro:
        "Our experience in the spare parts sector allows us to understand the needs of vehicle owners, workshops, and automotive businesses and provide suitable solutions for their requirements.",
    },
    branches: {
      title: "Our Branches",
      intro: "Damm Al-Marakib Trading Company operates across several locations, allowing us to serve customers in different areas.",
      groups: [
        {
          city: "Riyadh",
          locations: [
            "Al-Sina'iyah Al-Qadimah — Old Industrial Area",
            "Al-Arbaeen Street",
            "Al-Arbaeen Street — 24th Street",
            "Al-Naseem Industrial Area — 100 Street",
          ],
        },
        {
          city: "Al-Khobar",
          locations: ["Al-Thuqbah Industrial Area — Al-Khobar"],
        },
      ],
      outro: "Our branches are strategically located in major automotive and industrial areas to make our services more accessible to customers.",
    },
    vision: {
      title: "Our Vision",
      paragraph1:
        "Our vision is to become a trusted name in the automotive spare parts sector by providing reliable products, professional service, and a strong customer experience.",
      paragraph2: "We aim to continuously develop our business, expand our services, and build long-term relationships with our customers and partners.",
    },
    mission: {
      title: "Our Mission",
      body: "Our mission is to provide customers with dependable automotive spare parts and professional service while maintaining high standards of quality, efficiency, and customer satisfaction.",
    },
    founder: {
      title: "Our Founder",
      name: "Naif Al-Juaidi",
      role: "Founder & Owner",
      bio: "Naif Al-Juaidi represents the leadership behind Damm Al-Marakib Trading Company, with a focus on developing the company and strengthening its position in the automotive spare parts market.",
    },
    whyUs: {
      title: "Why Choose Damm Al-Marakib?",
      points: [
        "Reliable automotive spare parts",
        "Specialization in major Japanese vehicle brands",
        "Multiple branch locations",
        "Professional customer service",
        "Convenient access to automotive industrial areas",
        "Commitment to customer satisfaction",
      ],
    },
    contact: {
      title: "Contact Us",
      companyName: "Damm Al-Marakib Trading Company",
      emailLabel: "Email",
      email: "info@yourcompany.com",
      phoneLabel: "Phone",
      phone: "+966 XX XXX XXXX",
      locationLabel: "Main Location",
      location: "Riyadh, Saudi Arabia",
      ctaButton: "Get in Touch",
    },
    footer: {
      rights: "All rights reserved.",
      staffLogin: "Staff Login",
    },
  },
  ar: {
    brandName: "دعم المركبات",
    brandSubtitle: "قطع غيار المركبات",
    companyFullName: "شركة دعم المركبات للتجارة",
    tagline: "قطع موثوقة، وخدمة تستحق الثقة.",
    brands: ["تويوتا", "لكزس", "دايهاتسو", "سوزوكي"],
    nav: {
      about: "من نحن",
      specialization: "تخصصنا",
      branches: "فروعنا",
      contact: "اتصل بنا",
      getInTouch: "تواصل معنا",
      staffLogin: "دخول الموظفين",
    },
    hero: {
      eyebrow: "شركة دعم المركبات للتجارة",
      heading: "قطع موثوقة، وخدمة تستحق الثقة.",
      body: "شركة متخصصة في مجال قطع غيار المركبات في المملكة العربية السعودية، تسعى إلى توفير قطع الغيار الموثوقة وتقديم خدمة احترافية وحلول يمكن الاعتماد عليها.",
      ctaPrimary: "تواصل معنا",
      ctaSecondary: "فروعنا",
    },
    about: {
      title: "من نحن",
      paragraph1:
        "شركة دعم المركبات للتجارة هي شركة متخصصة في مجال قطع غيار المركبات في المملكة العربية السعودية، ونسعى إلى توفير قطع الغيار الموثوقة وتقديم خدمة احترافية تلبي احتياجات عملائنا.",
      paragraph2: "نعمل في مجال قطع غيار المركبات، ونختص بتوفير قطع الغيار لعدد من أشهر العلامات التجارية اليابانية، ومنها:",
      paragraph3: "ونحرص على أن نوفر لعملائنا تجربة سهلة وموثوقة في الحصول على قطع الغيار المناسبة، من خلال توفير المنتجات والخدمة والدعم الذي يحتاجونه.",
    },
    specialization: {
      title: "تخصصنا",
      intro: "تتركز أعمال شركة دعم المركبات للتجارة في قطع غيار المركبات، مع اهتمام خاص بقطع غيار:",
      outro: "ونعمل على تلبية احتياجات ملاك المركبات والورش والمنشآت العاملة في قطاع السيارات، من خلال توفير حلول مناسبة لاحتياجاتهم.",
    },
    branches: {
      title: "فروعنا",
      intro: "تمتلك شركة دعم المركبات للتجارة عدة مواقع وفروع في مناطق صناعية وتجارية مهمة، مما يساعدنا على الوصول إلى عملائنا وخدمتهم بشكل أفضل.",
      groups: [
        {
          city: "فروع الرياض",
          locations: ["الصناعية القديمة", "شارع الأربعين", "شارع الأربع والعشرين", "صناعية النسيم — شارع المية"],
        },
        {
          city: "فرع الخبر",
          locations: ["صناعية الثقبة — الخبر"],
        },
      ],
      outro: "وتتميز مواقعنا بقربها من المناطق المتخصصة في خدمات السيارات وقطع الغيار، مما يسهل على العملاء الوصول إلينا والاستفادة من خدماتنا.",
    },
    vision: {
      title: "رؤيتنا",
      paragraph1: "نسعى لأن تكون شركة دعم المركبات للتجارة من الشركات الموثوقة والرائدة في مجال قطع غيار المركبات، من خلال تقديم منتجات موثوقة وخدمة احترافية وتجربة مميزة للعملاء.",
      paragraph2: "كما نطمح إلى تطوير أعمالنا والتوسع في خدماتنا وتعزيز علاقاتنا طويلة المدى مع العملاء والشركاء.",
    },
    mission: {
      title: "رسالتنا",
      body: "تتمثل رسالتنا في توفير قطع غيار موثوقة للمركبات وتقديم خدمة احترافية تلبي احتياجات العملاء، مع المحافظة على مستوى عالٍ من الجودة والكفاءة ورضا العملاء.",
    },
    founder: {
      title: "مالك الشركة",
      name: "نايف الجعيدي",
      role: "المؤسس والمالك",
      bio: "يمثل نايف الجعيدي القيادة وراء شركة دعم المركبات للتجارة، مع التركيز على تطوير الشركة وتعزيز حضورها في سوق قطع غيار المركبات.",
    },
    whyUs: {
      title: "لماذا شركة دعم المركبات؟",
      points: [
        "توفير قطع غيار للمركبات",
        "التخصص في تويوتا ولكزس ودايهاتسو وسوزوكي",
        "وجود عدة فروع ومواقع",
        "خدمة احترافية للعملاء",
        "مواقع قريبة من المناطق الصناعية المتخصصة في السيارات",
        "الاهتمام برضا العملاء",
        "السعي المستمر إلى تطوير وتوسيع خدمات الشركة",
      ],
    },
    contact: {
      title: "تواصل معنا",
      companyName: "شركة دعم المركبات للتجارة",
      emailLabel: "البريد الإلكتروني",
      email: "info@yourcompany.com",
      phoneLabel: "رقم الهاتف",
      phone: "+966 XX XXX XXXX",
      locationLabel: "الموقع الرئيسي",
      location: "المملكة العربية السعودية — الرياض",
      ctaButton: "تواصل معنا",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      staffLogin: "دخول الموظفين",
    },
  },
};
