'use client'

import { useState } from 'react'
import { createClient } from '../utils/client'

export default function EditProfileForm({ profile }: { profile: any }) {
  const supabase = createClient()
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [image, setImage] = useState(profile.image)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('profile')
      .update({ display_name: displayName, image })
      .eq('id', profile.id)

    if (error) setMessage(`Error: ${error.message}`)
    else setMessage('Profile updated!')

    setLoading(false)
  }

  // Handle image upload
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const fileName = `${profile.id}-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('avatars') // your bucket name
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      setMessage(`Upload error: ${uploadError.message}`)
      setLoading(false)
      return
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName)

    // Update state so preview updates immediately
    setImage(publicUrl)
    setMessage('Image uploaded! (click Save to confirm)')
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Display Name:
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>

      <div>
        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {image && (
          <img
            src={image}
            alt="Preview"
            width={80}
            style={{ marginTop: '8px', borderRadius: '50%' }}
          />
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}
