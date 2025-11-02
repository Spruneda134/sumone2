import { createClient } from '../utils/server'
import EditProfileForm from './EditProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return <p>Please sign in to view your profile.</p>

  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return <p>No profile found.</p>

  return (
    <div>
      <h1>My Profile</h1>
      <img src={profile.image} alt={profile.display_name} width={80} />
      <p>{profile.email}</p>

      <EditProfileForm profile={profile} />
    </div>
  )
}
