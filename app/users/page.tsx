import { createClient } from '../utils/server'

export default async function UsersPage() {
  const supabase = await createClient()
    const { data: users, error } = await supabase
      .from('profile')
      .select('id, display_name, email, image')
  if (error) {
    return <p>Error loading users: {error.message}</p>
  }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.image && (
              <img
                src={user.image}
                alt={user.display_name}
                width={50}
              />
            )}
            <span>{user.display_name} ({user.email})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}