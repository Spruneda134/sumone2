'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../utils/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePostWithAI() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Call OpenAI to generate post content
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that generates short, engaging social media posts. Generate a single post that is 1-2 sentences long and interesting.',
        },
        {
          role: 'user',
          content: 'Generate a random interesting post for a social media platform.',
        },
      ],
      max_tokens: 150,
    })

    const generatedContent =
      response.choices[0]?.message?.content || 'Generated post'

    // Use the dedicated SumOne2 user id for AI-generated posts
    const sumoneUserId = process.env.SUMONE2_USER_ID

    // Insert the generated post into the database as the SumOne2 account
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: sumoneUserId,
        content: generatedContent,
      })
      .select('id, content, created_at, profile(display_name)')
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    // Revalidate the posts page to show the new post
    revalidatePath('/posts')

    return {
      success: true,
      post: data,
    }
  } catch (error) {
    console.error('Error generating post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
