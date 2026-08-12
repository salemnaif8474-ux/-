export type Language = "en" | "ar";

export interface Translation {
  brandName: string;
  brandSubtitle: string;
  tagline: string;
  nav: {
    about: string;
    contact: string;
    branches: string;
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
    body: string;
    founderLabel: string;
    founderName: string;
    points: { title: string; body: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    email: string;
    phoneLabel: string;
    phone: string;
    branchLabel: string;
    branch: string;
    ctaButton: string;
  };
  branches: {
    title: string;
    subtitle: string;
    body: string;
    cta: string;
  };
  footer: {
    rights: string;
    staffLogin: string;
  };
}

export const translations: Record<Language, Translation> = {
  en: {
    brandName: "Damm Al-Marakib",
    brandSubtitle: "Auto Spare Parts",
    tagline: "Reliable Parts. Trusted Support.",
    nav: {
      about: "About Us",
      contact: "Contact Us",
      branches: "Our Branches",
      getInTouch: "Get in Touch",
      staffLogin: "Staff Login",
    },
    hero: {
      eyebrow: "Damm Al-Marakib Auto Spare Parts",
      heading: "Reliable Parts. Trusted Support.",
      body: "A specialized automotive spare parts company committed to providing reliable parts and professional service for vehicle owners and businesses.",
      ctaPrimary: "Get in Touch",
      ctaSecondary: "Our Branches",
    },
    about: {
      title: "About Us",
      body: "Damm Al-Marakib Auto Spare Parts is a specialized automotive spare parts company committed to providing reliable parts and professional service for vehicle owners and businesses.",
      founderLabel: "Founder",
      founderName: "Naif Al-Juaidi",
      points: [
        { title: "Reliable Parts", body: "Genuine and high-quality spare parts you can depend on." },
        { title: "Professional Service", body: "A dedicated team ready to support every vehicle owner." },
        { title: "For Individuals & Businesses", body: "Serving personal vehicle owners as well as commercial fleets." },
      ],
    },
    contact: {
      title: "Contact Us",
      subtitle: "Reach out — we're happy to help.",
      emailLabel: "Email",
      email: "info@yourcompany.com",
      phoneLabel: "Phone",
      phone: "+966 XX XXX XXXX",
      branchLabel: "Main Branch",
      branch: "Riyadh, Saudi Arabia",
      ctaButton: "Get in Touch",
    },
    branches: {
      title: "Our Branches",
      subtitle: "Branches & Locations",
      body: "Our main branch is located in Riyadh, Saudi Arabia. Contact us to find the location nearest to you.",
      cta: "View Our Locations",
    },
    footer: {
      rights: "All rights reserved.",
      staffLogin: "Staff Login",
    },
  },
  ar: {
    brandName: "دم المراكب",
    brandSubtitle: "قطع غيار السيارات",
    tagline: "قطع غيار موثوقة. دعم يمكنك الاعتماد عليه.",
    nav: {
      about: "من نحن",
      contact: "اتصل بنا",
      branches: "فروعنا",
      getInTouch: "تواصل معنا",
      staffLogin: "دخول الموظفين",
    },
    hero: {
      eyebrow: "دم المراكب لقطع غيار السيارات",
      heading: "قطع غيار موثوقة. دعم يمكنك الاعتماد عليه.",
      body: "شركة متخصصة في قطع غيار السيارات، ملتزمة بتوفير قطع غيار موثوقة وخدمة احترافية لأصحاب المركبات والشركات.",
      ctaPrimary: "تواصل معنا",
      ctaSecondary: "فروعنا",
    },
    about: {
      title: "من نحن",
      body: "دم المراكب لقطع غيار السيارات شركة متخصصة في قطع غيار السيارات، ملتزمة بتوفير قطع غيار موثوقة وخدمة احترافية لأصحاب المركبات والشركات.",
      founderLabel: "المؤسس",
      founderName: "نايف الجعيدي",
      points: [
        { title: "قطع غيار موثوقة", body: "قطع غيار أصلية وعالية الجودة يمكنك الاعتماد عليها." },
        { title: "خدمة احترافية", body: "فريق متخصص جاهز لدعم كل صاحب مركبة." },
        { title: "للأفراد والشركات", body: "نخدم أصحاب المركبات الشخصية والأساطيل التجارية." },
      ],
    },
    contact: {
      title: "اتصل بنا",
      subtitle: "تواصل معنا — يسعدنا مساعدتك.",
      emailLabel: "البريد الإلكتروني",
      email: "info@yourcompany.com",
      phoneLabel: "الهاتف",
      phone: "+966 XX XXX XXXX",
      branchLabel: "الفرع الرئيسي",
      branch: "الرياض، المملكة العربية السعودية",
      ctaButton: "تواصل معنا",
    },
    branches: {
      title: "فروعنا",
      subtitle: "الفروع والمواقع",
      body: "فرعنا الرئيسي يقع في الرياض، المملكة العربية السعودية. تواصل معنا لمعرفة أقرب فرع لك.",
      cta: "عرض مواقعنا",
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      staffLogin: "دخول الموظفين",
    },
  },
};
