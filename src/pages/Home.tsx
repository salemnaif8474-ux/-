import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Logo } from "../components/Logo";

export function Home() {
  const { t, language, toggleLanguage } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <Logo size={40} />
            <div>
              <div className="text-sm font-bold leading-tight text-brand-700">{t.brandName}</div>
              <div className="text-xs leading-tight text-neutral-500">{t.brandSubtitle}</div>
            </div>
          </a>

          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            <a
              href="#about"
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {t.nav.about}
            </a>
            <a
              href="#specialization"
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {t.nav.specialization}
            </a>
            <a
              href="#branches"
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {t.nav.branches}
            </a>
            <a
              href="#contact"
              className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {t.nav.contact}
            </a>
            <a
              href="#contact"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {t.nav.getInTouch}
            </a>
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language / تبديل اللغة"
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
            >
              {language === "ar" ? "English" : "العربية"}
            </button>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="border-b border-brand-100 bg-gradient-to-b from-brand-50 to-neutral-50">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{t.hero.eyebrow}</p>
            <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-5xl">{t.hero.heading}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {t.hero.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#contact"
                className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {t.hero.ctaPrimary}
              </a>
              <a
                href="#branches"
                className="rounded-lg border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
          <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">{t.about.title}</h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">{t.about.paragraph1}</p>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">{t.about.paragraph2}</p>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {t.brands.map((brand) => (
              <li
                key={brand}
                className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-center text-sm font-semibold text-brand-700"
              >
                {brand}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">{t.about.paragraph3}</p>
        </section>

        <section id="specialization" className="border-y border-brand-100 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{t.specialization.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{t.specialization.intro}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {t.brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-brand-200 bg-brand-50 px-5 py-2 text-sm font-bold text-brand-700"
                >
                  {brand}
                </span>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600">{t.specialization.outro}</p>
          </div>
        </section>

        <section id="branches" className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{t.branches.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-600">{t.branches.intro}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {t.branches.groups.map((group) => (
              <div key={group.city} className="rounded-xl border border-brand-100 bg-white p-6">
                <h3 className="text-sm font-bold text-brand-700">{group.city}</h3>
                <ul className="mt-3 space-y-2">
                  {group.locations.map((loc) => (
                    <li key={loc} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      <span>{loc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-neutral-500">{t.branches.outro}</p>
        </section>

        <section className="border-y border-brand-100 bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-16 sm:py-24 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">{t.vision.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">{t.vision.paragraph1}</p>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">{t.vision.paragraph2}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">{t.mission.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">{t.mission.body}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{t.founder.title}</h2>
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-brand-100 bg-white p-8">
            <div className="text-lg font-bold text-brand-700">{t.founder.name}</div>
            <div className="mt-1 text-sm font-semibold text-neutral-500">{t.founder.role}</div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">{t.founder.bio}</p>
          </div>
        </section>

        <section className="border-y border-brand-100 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
            <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">{t.whyUs.title}</h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {t.whyUs.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-brand-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{t.contact.title}</h2>
            <p className="mt-2 text-base font-medium text-brand-700">{t.contact.companyName}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <a
              href={`mailto:${t.contact.email}`}
              className="rounded-xl border border-brand-100 bg-white p-6 text-center transition hover:border-brand-600"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {t.contact.emailLabel}
              </div>
              <div className="mt-2 text-sm font-medium text-brand-700" dir="ltr">
                {t.contact.email}
              </div>
            </a>
            <a
              href={`tel:${t.contact.phone.replace(/\s+/g, "")}`}
              className="rounded-xl border border-brand-100 bg-white p-6 text-center transition hover:border-brand-600"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {t.contact.phoneLabel}
              </div>
              <div className="mt-2 text-sm font-medium text-brand-700" dir="ltr">
                {t.contact.phone}
              </div>
            </a>
            <div className="rounded-xl border border-brand-100 bg-white p-6 text-center">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {t.contact.locationLabel}
              </div>
              <div className="mt-2 text-sm font-medium text-brand-700">{t.contact.location}</div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href={`mailto:${t.contact.email}`}
              className="inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {t.contact.ctaButton}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <div>
                <div className="text-sm font-bold text-brand-700">{t.companyFullName}</div>
                <div className="text-xs text-neutral-500">{t.tagline}</div>
              </div>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm text-neutral-600">
              <a href="#about" className="hover:text-brand-700">
                {t.nav.about}
              </a>
              <a href="#specialization" className="hover:text-brand-700">
                {t.nav.specialization}
              </a>
              <a href="#branches" className="hover:text-brand-700">
                {t.nav.branches}
              </a>
              <a href="#contact" className="hover:text-brand-700">
                {t.nav.contact}
              </a>
              <Link to="/app/login" className="hover:text-brand-700">
                {t.footer.staffLogin}
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-neutral-100 pt-6 text-center text-xs text-neutral-400">
            © {year} {t.companyFullName}. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
}
