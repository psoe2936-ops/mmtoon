import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../data/bookStore";
import { useLanguage } from "../context/LanguageContext";
import { toAssetUrl } from "../utils/assetUrl";

const Reader = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const books = useBooks();
  const book = books.find((item) => item.id === bookId);

  const chapterIndex = useMemo(() => {
    if (!book) return -1;
    return book.chapters.findIndex((chapter) => chapter.id === chapterId);
  }, [book, chapterId]);

  if (!book || chapterIndex < 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-slate-300">{t("reader.notFound")}</p>
      </main>
    );
  }

  const chapter = book.chapters[chapterIndex];
  const previousChapter = book.chapters[chapterIndex - 1];
  const nextChapter = book.chapters[chapterIndex + 1];

  return (
    <main className="bg-black pb-24">
      <div className="sticky top-[65px] z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 text-sm">
          <Link to={`/book/${book.id}`} className="rounded-lg border border-white/10 px-3 py-1.5 text-white">
            {t("reader.back")}
          </Link>

          <p className="text-slate-200">
            {book.title} - {t("reader.chapter")} {chapter.number}
          </p>

          <div className="ml-auto flex gap-2">
            <button
              disabled={!previousChapter}
              onClick={() => previousChapter && navigate(`/read/${book.id}/${previousChapter.id}`)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("reader.prev")}
            </button>
            <button
              disabled={!nextChapter}
              onClick={() => nextChapter && navigate(`/read/${book.id}/${nextChapter.id}`)}
              className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-3 py-1.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("reader.next")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-4 px-4">
        {chapter.pages.map((page, index) => (
          <img
            key={page}
            src={toAssetUrl(page)}
            alt={`${chapter.title} page ${index + 1}`}
            className="w-full rounded-lg border border-white/10"
            loading="lazy"
          />
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between gap-3 px-4 text-sm">
        <button
          disabled={!previousChapter}
          onClick={() => previousChapter && navigate(`/read/${book.id}/${previousChapter.id}`)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("reader.prevChapter")}
        </button>
        <p className="text-slate-300">{t("reader.pages")}: {chapter.pages.length}</p>
        <button
          disabled={!nextChapter}
          onClick={() => nextChapter && navigate(`/read/${book.id}/${nextChapter.id}`)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("reader.nextChapter")}
        </button>
      </div>
    </main>
  );
};

export default Reader;
