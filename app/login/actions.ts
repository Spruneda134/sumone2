'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../utils/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }
  // revalidate the root path so server components (like the layout/header)
  // pick up the updated session/cookies
  revalidatePath('/')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }
  // revalidate the root path so server components (like the layout/header)
  // pick up the updated session/cookies
  revalidatePath('/')
  redirect('/')
}

export async function verifySecretKey(formData: FormData) {
  const secretKey = formData.get('secretKey') as string
  const validKey = process.env.SIGNUP_SECRET_KEY

  if (secretKey !== validKey) {
    redirect('/error?reason=invalid-key')
  }

  // Key is valid — call signup
  return signup(formData)
}