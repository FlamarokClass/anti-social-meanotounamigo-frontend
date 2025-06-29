import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { API_URL } from "../config/constants";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(setPosts);
  }, []);

  return (
    <div className="container mt-4">
      <h1>Bienvenid@ a UnaHur Anti-Social Net</h1>
      {posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
}