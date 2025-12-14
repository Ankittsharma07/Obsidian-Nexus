const developer = {
  name: "Nexius",
  github: "https://github.com/Ankittsharma07",
  linkedin: "https://www.linkedin.com/in/nexius-71935839a/",
  portfolio: "https://nexius-portfolio.netlify.app/"
};

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/40 py-8 text-center text-sm text-slate-400 backdrop-blur">
      <p className="space-x-3">
        <span>Crafted by {developer.name}</span>
        <a
          href={developer.github}
          className="text-purple-300 transition hover:text-purple-100"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href={developer.linkedin}
          className="text-purple-300 transition hover:text-purple-100"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a
          href={developer.portfolio}
          className="text-purple-300 transition hover:text-purple-100"
          target="_blank"
          rel="noreferrer"
        >
          Portfolio
        </a>
      </p>
    </footer>
  );
}
