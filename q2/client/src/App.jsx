import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const API_BASE = 'http://localhost:5000/api';

const getRandomImage = (id) => `https://i.pravatar.cc/150?img=${id}`;

export default function App() {
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data.users);
      Object.keys(res.data.users).forEach((id) => fetchPosts(id));
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchPosts = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE}/posts/${userId}`);
      setPosts(prev => [...prev, ...res.data.posts]);
    } catch (err) {
      console.error(`Error fetching posts for user ${userId}:`, err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${API_BASE}/comments/${postId}`);
      setComments(prev => ({ ...prev, [postId]: res.data.comments }));
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    }
  };

  const topUsers = Object.entries(users).slice(0, 3);
  const trendingPosts = posts.slice(0, 5);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Real-time Feed Analysis</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Top Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topUsers.map(([id, name]) => (
            <Card key={id} className="flex items-center p-4">
              <Avatar className="mr-4">
                <img src={getRandomImage(id)} alt={name} />
              </Avatar>
              <span>{name}</span>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Trending Posts</h2>
        <ScrollArea className="h-64">
          {trendingPosts.map(post => (
            <Card key={post.id} className="mb-4">
              <CardContent>
                <h3 className="font-medium">User {post.userid}</h3>
                <p>{post.content}</p>
                <button
                  onClick={() => fetchComments(post.id)}
                  className="text-blue-500 mt-2 text-sm"
                >
                  Load Comments
                </button>
                {comments[post.id] && (
                  <div className="mt-2">
                    {comments[post.id].map(comment => (
                      <p key={comment.id} className="text-sm text-gray-700">💬 {comment.content}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Live Feed</h2>
        <ScrollArea className="h-80">
          {posts.map(post => (
            <Card key={post.id} className="mb-2">
              <CardContent>
                <div className="flex items-center mb-2">
                  <Avatar className="mr-2">
                    <img src={getRandomImage(post.userid)} alt="user" />
                  </Avatar>
                  <span className="font-semibold">User {post.userid}</span>
                  <Badge className="ml-auto">Post ID: {post.id}</Badge>
                </div>
                <p>{post.content}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </section>
    </div>
  );
}
