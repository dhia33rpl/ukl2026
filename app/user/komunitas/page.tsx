"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: number;
  content: string;
  user?: {
    fullname?: string;
  };
};

type Post = {
  id: number;
  content: string;
  likes: number;
  createdAt: string;
  user?: {
    fullname?: string;
  };
  comments: Comment[];
};

export default function Komunitas() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [input, setInput] = useState("");

  // GET POSTS
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/posts`);
      const data = await res.json();

      const arr = Array.isArray(data) ? data : [];

      // remove duplicate id
      const unique = Array.from(new Map(arr.map((p) => [p.id, p])).values());

      setPosts(unique);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // CREATE POST
  const handlePost = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content: input }),
      });

      const result = await res.json();

      if (!res.ok) return;

      const newPost = result.data;

      setInput("");

      setPosts((prev) => {
        const cleaned = prev.filter((p) => p.id !== newPost.id);
        return [newPost, ...cleaned];
      });
    } catch (err) {
      console.log(err);
    }
  };

  // LIKE (PATCH FIX)
  const handleLike = async (postId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) return;

      const updated = await res.json();

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: updated.likes } : p)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  // COMMENT
  const handleComment = async (postId: number, content: string) => {
    if (!content.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) return;

      await fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h2 className="font-bold text-xl mb-5">Komunitas Pecinta Hewan</h2>

        {/* CREATE POST */}
        <div className="bg-white border rounded-xl p-4 mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border p-3 rounded text-sm"
            placeholder="tulis sesuatu..."
          />

          <button
            type="button"
            onClick={handlePost}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
          >
            posting
          </button>
        </div>

        {/* POSTS */}
        <div className="space-y-4">
          {posts.map((post, pi) => (
            <div
              key={`post-${post.id ?? pi}`}
              className="bg-white border rounded-xl p-4"
            >
              <p className="font-semibold text-sm">
                {post.user?.fullname ?? "unknown"}
              </p>

              <p className="text-sm mt-2">{post.content}</p>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-3 text-xs">
                <button
                  onClick={() => handleLike(post.id)}
                  className="text-blue-600"
                >
                  👍 {post.likes}
                </button>

                <span>💬 {post.comments?.length ?? 0}</span>
              </div>

              {/* COMMENTS */}
              <div className="mt-3 space-y-1">
                {post.comments?.map((c, ci) => (
                  <div
                    key={`comment-${post.id}-${c.id ?? ci}`}
                    className="text-xs text-gray-600"
                  >
                    <b>{c.user?.fullname ?? "user"}:</b> {c.content}
                  </div>
                ))}
              </div>

              {/* COMMENT INPUT */}
              <input
                className="border mt-3 w-full text-xs p-2 rounded"
                placeholder="tulis komentar..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(post.id, e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
