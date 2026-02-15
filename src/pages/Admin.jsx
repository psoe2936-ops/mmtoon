import { useEffect, useMemo, useState } from "react";
import { books as seedBooks } from "../data/mockData";
import { emitBooksUpdated, loadBooks, STORAGE_KEY } from "../data/bookStore";

const createInitialBookForm = () => ({
  title: "",
  description: "",
  status: "Ongoing",
  genres: "",
  cover: "",
});

const createInitialChapterForm = (bookId = "") => ({
  bookId,
  chapterNumber: "",
  title: "",
  pages: "",
});

const safeClone = (data) => JSON.parse(JSON.stringify(data));

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Admin = () => {
  const [managedBooks, setManagedBooks] = useState(() => loadBooks());
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [search, setSearch] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(seedBooks[0]?.id || "");
  const [bookForm, setBookForm] = useState(createInitialBookForm());
  const [chapterForm, setChapterForm] = useState(createInitialChapterForm(seedBooks[0]?.id || ""));

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(managedBooks));
    emitBooksUpdated();
  }, [managedBooks]);

  useEffect(() => {
    if (!managedBooks.length) {
      setSelectedBookId("");
      setChapterForm((prev) => ({ ...prev, bookId: "" }));
      return;
    }

    const exists = managedBooks.some((book) => book.id === selectedBookId);
    if (!exists) {
      setSelectedBookId(managedBooks[0].id);
    }

    setChapterForm((prev) => {
      if (prev.bookId && managedBooks.some((book) => book.id === prev.bookId)) return prev;
      return { ...prev, bookId: managedBooks[0].id };
    });
  }, [managedBooks, selectedBookId]);

  const totalChapters = useMemo(
    () => managedBooks.reduce((sum, book) => sum + (book.chapters?.length || 0), 0),
    [managedBooks]
  );
  const totalViews = useMemo(
    () => managedBooks.reduce((sum, book) => sum + (book.views || 0), 0),
    [managedBooks]
  );
  const filteredBooks = useMemo(() => {
    if (!search.trim()) return managedBooks;
    const keyword = search.trim().toLowerCase();
    return managedBooks.filter((book) => book.title.toLowerCase().includes(keyword));
  }, [managedBooks, search]);
  const selectedBook = useMemo(
    () => managedBooks.find((book) => book.id === selectedBookId) || null,
    [managedBooks, selectedBookId]
  );

  const showMessage = (type, message) => {
    setFeedbackType(type);
    setFeedback(message);
  };

  const resetBookForm = () => {
    setBookForm(createInitialBookForm());
    setEditingBookId(null);
  };

  const handleBookSubmit = (event) => {
    event.preventDefault();

    if (!bookForm.title.trim()) {
      showMessage("error", "Book title is required.");
      return;
    }

    const genres = bookForm.genres
      .split(",")
      .map((genre) => genre.trim())
      .filter(Boolean);

    if (editingBookId) {
      setManagedBooks((prev) =>
        prev.map((book) =>
          book.id === editingBookId
            ? {
                ...book,
                title: bookForm.title.trim(),
                description: bookForm.description.trim() || "No description yet.",
                status: bookForm.status,
                genres,
                cover: bookForm.cover.trim() || book.cover,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : book
        )
      );
      showMessage("success", "Book updated.");
      resetBookForm();
      return;
    }

    const baseId = slugify(bookForm.title);
    let finalId = baseId || `book-${Date.now()}`;
    let suffix = 1;

    while (managedBooks.some((book) => book.id === finalId)) {
      finalId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    const newBook = {
      id: finalId,
      title: bookForm.title.trim(),
      description: bookForm.description.trim() || "No description yet.",
      status: bookForm.status,
      genres,
      views: 0,
      rating: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
      cover: bookForm.cover.trim() || "/image.jpg-removebg-preview.png",
      chapters: [],
    };

    setManagedBooks((prev) => [newBook, ...prev]);
    setSelectedBookId(newBook.id);
    setChapterForm((prev) => ({ ...prev, bookId: newBook.id }));
    showMessage("success", "Book created.");
    resetBookForm();
  };

  const startEditBook = (book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      description: book.description || "",
      status: book.status || "Ongoing",
      genres: (book.genres || []).join(", "),
      cover: book.cover || "",
    });
  };

  const handleDeleteBook = (bookId) => {
    if (!window.confirm("Delete this book and all chapters?")) return;
    setManagedBooks((prev) => prev.filter((book) => book.id !== bookId));
    showMessage("success", "Book deleted.");
    if (editingBookId === bookId) {
      resetBookForm();
    }
  };

  const handleChapterSubmit = (event) => {
    event.preventDefault();

    if (!chapterForm.bookId) {
      showMessage("error", "Select a book first.");
      return;
    }

    const chapterNumber = Number(chapterForm.chapterNumber);
    if (!Number.isInteger(chapterNumber) || chapterNumber <= 0) {
      showMessage("error", "Chapter number must be a positive integer.");
      return;
    }

    const pages = chapterForm.pages
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!pages.length) {
      showMessage("error", "Add at least one page URL.");
      return;
    }

    const book = managedBooks.find((item) => item.id === chapterForm.bookId);
    if (!book) {
      showMessage("error", "Book not found.");
      return;
    }
    const exists = (book.chapters || []).some((chapter) => chapter.number === chapterNumber);
    if (exists) {
      showMessage("error", `Chapter ${chapterNumber} already exists for this book.`);
      return;
    }

    const newChapter = {
      id: String(chapterNumber),
      number: chapterNumber,
      title: chapterForm.title.trim() || `Chapter ${chapterNumber}`,
      updatedAt: new Date().toISOString().slice(0, 10),
      pages,
    };

    setManagedBooks((prev) =>
      prev.map((item) => {
        if (item.id !== chapterForm.bookId) return item;
        return {
          ...item,
          chapters: [...(item.chapters || []), newChapter].sort((a, b) => a.number - b.number),
          updatedAt: new Date().toISOString().slice(0, 10),
        };
      })
    );

    setSelectedBookId(chapterForm.bookId);
    setChapterForm((prev) => ({ ...prev, chapterNumber: "", title: "", pages: "" }));
    showMessage("success", "Chapter added.");
  };

  const handleDeleteChapter = (bookId, chapterId) => {
    if (!window.confirm("Delete this chapter?")) return;
    setManagedBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? { ...book, chapters: (book.chapters || []).filter((chapter) => chapter.id !== chapterId) }
          : book
      )
    );
    showMessage("success", "Chapter deleted.");
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-8 pb-24 md:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <button
          type="button"
          onClick={() => {
            setManagedBooks(safeClone(seedBooks));
            resetBookForm();
            setChapterForm(createInitialChapterForm(seedBooks[0]?.id || ""));
            showMessage("success", "Reset to initial dataset.");
          }}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
        >
          Reset Data
        </button>
      </div>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedbackType === "error"
              ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
              : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
          }`}
        >
          {feedback}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-sm text-slate-400">Total Books</p>
          <p className="text-2xl font-bold text-white">{managedBooks.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-sm text-slate-400">Total Chapters</p>
          <p className="text-2xl font-bold text-white">{totalChapters}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <p className="text-sm text-slate-400">Total Views</p>
          <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleBookSubmit} className="space-y-3 rounded-3xl border border-white/10 bg-black/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              {editingBookId ? "Edit Book" : "Add Book"}
            </h2>
            {editingBookId && (
              <button
                type="button"
                onClick={resetBookForm}
                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-slate-200"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <input
            placeholder="Title"
            value={bookForm.title}
            onChange={(event) => setBookForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <textarea
            placeholder="Description"
            value={bookForm.description}
            onChange={(event) => setBookForm((prev) => ({ ...prev, description: event.target.value }))}
            className="h-20 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <select
            value={bookForm.status}
            onChange={(event) => setBookForm((prev) => ({ ...prev, status: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            placeholder="Genres (comma separated)"
            value={bookForm.genres}
            onChange={(event) => setBookForm((prev) => ({ ...prev, genres: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <input
            placeholder="Cover URL"
            value={bookForm.cover}
            onChange={(event) => setBookForm((prev) => ({ ...prev, cover: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 font-semibold text-black"
          >
            {editingBookId ? "Save Changes" : "Add Book"}
          </button>
        </form>

        <form
          onSubmit={handleChapterSubmit}
          className="space-y-3 rounded-3xl border border-white/10 bg-black/40 p-5"
        >
          <h2 className="text-lg font-semibold text-white">Add Chapter</h2>
          <select
            value={chapterForm.bookId}
            onChange={(event) => setChapterForm((prev) => ({ ...prev, bookId: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          >
            <option value="">Select Book</option>
            {managedBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <input
            placeholder="Chapter number"
            value={chapterForm.chapterNumber}
            onChange={(event) => setChapterForm((prev) => ({ ...prev, chapterNumber: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <input
            placeholder="Chapter title (optional)"
            value={chapterForm.title}
            onChange={(event) => setChapterForm((prev) => ({ ...prev, title: event.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <textarea
            placeholder="Page image URLs (one per line)"
            value={chapterForm.pages}
            onChange={(event) => setChapterForm((prev) => ({ ...prev, pages: event.target.value }))}
            className="h-28 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 font-semibold text-black"
          >
            Add Chapter
          </button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Books</h2>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title..."
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-sm text-white outline-none"
            />
          </div>

          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className={`rounded-xl border px-3 py-3 ${
                  selectedBookId === book.id ? "border-cyan-400/40 bg-cyan-500/10" : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className="text-left text-white"
                  >
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-xs text-slate-400">
                      {book.status} | {(book.chapters || []).length} chapters
                    </p>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditBook(book)}
                      className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBook(book.id)}
                      className="rounded-lg border border-rose-400/40 px-2.5 py-1 text-xs text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!filteredBooks.length && <p className="text-sm text-slate-400">No books found.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
          <h2 className="mb-3 text-lg font-semibold text-white">Chapters</h2>
          {!selectedBook ? (
            <p className="text-sm text-slate-400">Select a book to manage chapters.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-300">{selectedBook.title}</p>
              {(selectedBook.chapters || []).map((chapter) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-white">
                      Chapter {chapter.number}: {chapter.title}
                    </p>
                    <p className="text-xs text-slate-400">{chapter.pages?.length || 0} pages</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(selectedBook.id, chapter.id)}
                    className="rounded-lg border border-rose-400/40 px-2.5 py-1 text-xs text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {!(selectedBook.chapters || []).length && (
                <p className="text-sm text-slate-400">No chapters yet for this book.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <p className="text-xs text-slate-500">
        Admin changes are currently saved to local browser storage only. Firestore integration can be added next.
      </p>
    </main>
  );
};

export default Admin;
