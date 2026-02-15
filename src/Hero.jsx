import { Link } from "react-router-dom";
import { useBooks } from "./data/bookStore";
import { useLanguage } from "./context/LanguageContext";
import { toAssetUrl } from "./utils/assetUrl";

const Hero = () => {
  const books = useBooks();
  const { t } = useLanguage();
  const featuredCover = books[0]?.cover || "/image.jpg-removebg-preview.png";

  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 pb-16">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        
        {/* Inner content */}
        <div className="grid items-center gap-12 p-8 md:grid-cols-2 md:p-12">

          {/* LEFT SIDE */}
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-wider">
              {t("hero.welcome")}
            </p>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              {t("hero.title1")}
              <br />
              <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                {t("hero.title2")}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-slate-300">
              {t("hero.desc")}
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/book"
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 font-semibold text-black shadow-lg shadow-fuchsia-500/30 hover:opacity-90 transition"
              >
                {t("hero.start")}
              </Link>

              <Link
                to="/search"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/10 transition"
              >
                {t("hero.explore")}
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center">
            
            {/* Glow behind image */}
            <div className="absolute h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl"></div>

            <img
              src={toAssetUrl(featuredCover)}
              alt="Featured Manga"
              className="relative w-64 md:w-80 rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
