import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <main className="max-w-2xl mx-auto py-6 px-4">
      <img
        src={user.avatar || "https://placehold.co/100x100"}
        alt="avatar"
        className="w-24 h-24 rounded-full mb-3"
      />
      <h1 className="text-xl font-bold">{user.username}</h1>
      <p className="text-gray-600">{user.bio}</p>
      <p className="mt-2">Score: {user.score}</p>
    </main>
  );
}
