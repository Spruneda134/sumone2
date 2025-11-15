'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../utils/client'
import Link from 'next/link'

export default function PostsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [content, setContent] = useState('')

  // Fetch user + posts (with comment count)
  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          profile(display_name),
          comments(count)
        `)
        .order('created_at', { ascending: false })

      if (!error) setPosts(data || [])
      else console.error('Fetch posts error:', error)
    })()
  }, [])

  // Add a new post
  const addPost = async () => {
    if (!user || !content.trim()) return

    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: user.id, content })
      .select('id, content, created_at, profile(display_name)')
      .single()

    if (error) {
      console.error('Add post error:', error)
      return
    }

    // Add new post (with 0 comments)
    setPosts((prev) => [
      { ...data, comments: [{ count: 0 }] },
      ...prev,
    ])
    setContent('')
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Posts</h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        style={{ width: '100%', height: 80 }}
      />
      <br />
      <button onClick={addPost} disabled={!user}>
        Add Post
      </button>

      <div style={{ marginTop: 20 }}>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => (
            <Link key={p.id} href={`/posts/${p.id}`}>
              <div
                style={{
                  border: '1px solid #ccc',
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <p>{p.content}</p>
                <p>
                  Posted By:{' '}
                  {p.profile?.display_name || 'Anonymous'}
                </p>

                {/* COMMENT COUNT DISPLAY */}
                <p>
                  Comments:{' '}
                  {p.comments?.[0]?.count ?? 0}
                </p>

                <small>
                  {new Date(p.created_at).toLocaleString()}
                </small>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
