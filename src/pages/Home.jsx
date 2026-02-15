import Hero from "../Hero";
import BookCard from "../Component/BookCard";
import { useBooks } from "../data/bookStore";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const books = useBooks();
  const { t } = useLanguage();
  const weeklySpotlight = books.slice(0, 6);
  const bestReading = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const trending = [...books].sort((a, b) => b.views - a.views);

  return (
    <main className="pb-24 md:pb-10">
      <Hero />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">{t("home.weekly")}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {weeklySpotlight.map((book) => (
              <BookCard key={book.id} book={book} compact />
            ))}
          </div>
        </div>

        <aside>
          <h2 className="mb-4 text-xl font-bold text-white">{t("home.best")}</h2>
          <div className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            {bestReading.map((book) => (
              <div key={book.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <p className="truncate text-sm text-white">{book.title}</p>
                <span className="text-xs text-cyan-300">★ {book.rating}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6">
        <h2 className="mb-4 text-xl font-bold text-white">{t("home.trending")}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {trending.map((book) => (
            <div key={book.id} className="min-w-[180px] max-w-[180px]">
              <BookCard book={book} compact />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
