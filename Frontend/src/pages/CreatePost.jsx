import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../redux/PostSlice";
import {
  generateContent,
  generateSuggestions,
  clearContent,
  clearSuggestions,
} from "../redux/contentSlice";
import {
  FiEdit,
  FiCopy,
  FiCheck,
  FiZap,
} from "react-icons/fi";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [used, setUsed] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const {
    generatedContent,
    suggestions,
    status,
    suggestionsStatus,
    error,
    suggestionsError,
  } = useSelector((state) => state.content);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }
    await dispatch(createPost({ title, content, tags: tags.split(",") }));
    navigate("/");
  };

  const handleGenerateContent = async () => {
    if (!title.trim()) {
      alert("Please enter a title first!");
      return;
    }
    dispatch(clearContent());
    await dispatch(generateContent({ title: title.trim() }));
  };

  const handleGenerateSuggestions = async () => {
    if (!title.trim()) {
      alert("Please enter a title first!");
      return;
    }
    dispatch(clearSuggestions());
    await dispatch(generateSuggestions({ title: title.trim() }));
    setShowSuggestions(true);
  };

  const applyContent = (text) => {
    setContent(text);
    setUsed(true);
    setTimeout(() => setUsed(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-4xl relative">
          {/* Card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl flex items-center justify-center gap-3">
                <FiEdit className="text-purple-400" /> Create New Post ✨
              </h1>
              <p className="text-slate-300 text-lg">
                Share your thoughts with the community
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-6">
              {/* Title */}
              <div>
                <input
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-lg backdrop-blur-sm"
                />
                {title && (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateContent}
                      disabled={status === "loading"}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center gap-2 text-sm shadow-lg"
                    >
                      {status === "loading" ? "Generating..." : "✨ Generate"}
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateSuggestions}
                      disabled={suggestionsStatus === "loading"}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg flex items-center gap-2 text-sm shadow-lg"
                    >
                      {suggestionsStatus === "loading"
                        ? "Loading..."
                        : "⚡ Suggestions"}
                    </button>
                  </div>
                )}
              </div>

              {/* Generated content preview */}
              {generatedContent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-green-800 flex items-center gap-2">
                      AI Generated Content
                    </h3>
                    <button
                      type="button"
                      onClick={() => applyContent(generatedContent.content)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-1"
                    >
                      {used ? <FiCheck /> : <FiCopy />}
                      {used ? "Used!" : "Use This"}
                    </button>
                  </div>
                  <p className="text-green-700 text-sm whitespace-pre-wrap">
                    {generatedContent.content}
                  </p>
                </div>
              )}

              {/* Content */}
              <textarea
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 h-48 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-lg backdrop-blur-sm resize-none"
              />

              {/* Tags */}
              <input
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-lg backdrop-blur-sm"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">
                    {error.message || error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-2xl hover:scale-105 transition"
                >
                  🚀 Publish Post
                </button>
              </div>
            </form>

            {/* Suggestions Modal */}
            {showSuggestions && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                      ⚡ Content Suggestions
                    </h2>
                    <button
                      onClick={() => setShowSuggestions(false)}
                      className="text-slate-500 hover:text-slate-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {suggestionsError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <p className="text-red-700 text-sm">
                        {suggestionsError.message || suggestionsError}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-slate-800">
                            {s.style}
                          </h3>
                          <button
                            onClick={() => applyContent(s.content)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                          >
                            <FiCopy size={14} />
                            Use This
                          </button>
                        </div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">
                          {s.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
