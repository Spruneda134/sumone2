'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../utils/client'
import Link from 'next/link'

export default function SinglePostPage() {
  const supabase = createClient()
  const { id } = useParams()

  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  // ---------------------------------------
  // Fetch the post
  // ---------------------------------------
  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          profile(display_name)
        `)
        .eq('id', id)
        .single()

      if (!error) setPost(data)
      else console.error('Error fetching post:', error)
    }

    fetchPost()
  }, [id])

  // ---------------------------------------
  // Fetch comments for this post
  // ---------------------------------------
  useEffect(() => {
    if (!id) return

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profile:profile(display_name)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (!error) setComments(data || [])
      else console.error('Error fetching comments:', error)
    }

    fetchComments()
  }, [id])

  // ---------------------------------------
  // Add a new comment
  // ---------------------------------------
  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to comment.")
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        user_id: user.id,
        content: newComment,
      })

    if (error) {
      console.error('Error adding comment:', error)
    } else {
      setNewComment("")
      // Re-fetch comments after adding one
      const { data: refreshed } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profile:profile(display_name)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      setComments(refreshed || [])
    }

    setLoading(false)
  }

  if (!post) return <p>Loading...</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Post Details</h1>

      {/* ------------------------------- */}
      {/* Post Section */}
      {/* ------------------------------- */}
      <div
        style={{
          border: '1px solid #ccc',
          padding: 20,
          marginBottom: 20,
        }}
      >
        <p>{post.content}</p>

        <p>
          <strong>Posted By:</strong>{' '}
          {post.profile?.display_name || 'Anonymous'}
        </p>

        <small>{new Date(post.created_at).toLocaleString()}</small>
      </div>

      {/* ------------------------------- */}
      {/* Comments Section */}
      {/* ------------------------------- */}
      <h2>Comments</h2>

      <div style={{ marginBottom: 20 }}>
        {comments.length === 0 && <p>No comments yet.</p>}

        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              border: '1px solid #ddd',
              padding: 12,
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            <p>{c.content}</p>
            <strong>{c.profile?.display_name || "Unknown User"}</strong>
            <br />
            <small>{new Date(c.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>

      {/* ------------------------------- */}
      {/* Add Comment Box */}
      {/* ------------------------------- */}
      <h3>Add a Comment</h3>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleAddComment}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "8px 14px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>

      <br /><br />
      <Link href="/posts">← Back to Posts</Link>
    </div>
  )
}
