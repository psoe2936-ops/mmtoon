import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../data/bookStore";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const books = useBooks();
  const book = books.find((item) => item.id === id);

  if (!book) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-slate-300">{t("detail.notFound")}</p>
      </main>
    );
  }

  const firstChapter = book.chapters[0];

  const handleDownload = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const content = `${book.title}\nChapters: ${book.chapters.length}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${book.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 pb-24 md:pb-10">
      <section className="grid gap-6 rounded-3xl border border-white/10 bg-black/40 p-6 md:grid-cols-[320px_1fr]">
        <img src={book.cover} alt={book.title} className="w-full rounded-2xl border border-white/10 bg-black/40" />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">{book.title}</h1>
          <p className="text-slate-300">{book.description}</p>

          <div className="flex flex-wrap gap-2">
            {book.genres.map((genre) => (
              <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {genre}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <p>{t("detail.status")}: {book.status === "Ongoing" ? t("book.statusOngoing") : book.status === "Completed" ? t("book.statusCompleted") : book.status}</p>
            <p>{t("detail.views")}: {book.views.toLocaleString()}</p>
            <p>{t("detail.chapters")}: {book.chapters.length}</p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {firstChapter ? (
              <Link
                to={`/read/${book.id}/${firstChapter.id}`}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2 font-semibold text-black"
              >
                {t("detail.read")}
              </Link>
            ) : (
              <button
                disabled
                className="cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-slate-400"
              >
                {t("detail.noChapters")}
              </button>
            )}

            <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-white">{t("detail.favorite")}</button>
            <button
              onClick={handleDownload}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-white"
            >
              {user ? t("detail.download") : t("detail.downloadLogin")}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/40 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">{t("detail.chapters")}</h2>
        <div className="space-y-3">
          {book.chapters.length === 0 && <p className="text-slate-300">{t("detail.noChapterUploaded")}</p>}

          {book.chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-white">
                  {t("detail.chapterLabel")} {chapter.number}: {chapter.title}
                </p>
                <p className="text-xs text-slate-400">{t("detail.updated")} {chapter.updatedAt}</p>
              </div>

              <Link
                to={`/read/${book.id}/${chapter.id}`}
                className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-1.5 text-sm font-semibold text-black"
              >
                {t("detail.read")}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BookDetail;
