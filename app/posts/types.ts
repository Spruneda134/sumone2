export type Profile = {
  id: string
  display_name?: string | null
  image?: string | null
}

export type Post = {
  id: string
  content: string
  created_at: string
  profile?: {
    display_name?: string | null
  }[] | null
  // some queries include a comments aggreggation as an array with a count
  comments?: { count: number }[]
}

export type Comment = {
  id: string
  content: string
  created_at: string
  profile?: {
    display_name?: string | null
  }[] | null
}

export type AuthUser = {
  id: string
  email?: string | null
} | null
