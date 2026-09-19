// web/src/app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ reply: '❌ Error: GROQ_API_KEY is not set' }, { status: 400 })
    }

    // تهيئة عميل Groq داخل الدالة لتجنب أخطاء وقت البناء على Vercel
    const groq = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    })

    // 1. استعلام البيانات المهيكلة بالكامل من Sanity عبر GROQ Query
    const sanityData = await client.fetch(`{
      "vehicles": *[_type == "vehicle"]{ name, make, year, engineType },
      "parts": *[_type == "part"]{ 
        partNumber, 
        title, 
        category, 
        specifications, 
        "compatibleVehicles": compatibleVehicles[]->name 
      },
      "troubleshooting": *[_type == "troubleshoot"]{ 
        errorCode, 
        symptoms, 
        solution, 
        "relatedParts": relatedParts[]->{ partNumber, title } 
      }
    }`)

    // 2. إعداد التوجيه الذكي للـ Agent
    const systemPrompt = `
You are an expert AI Auto & Spare Parts Compatibility Advisor.
You MUST base all your recommendations strictly on the structured knowledge base provided below from Sanity.

Sanity Knowledge Base:
${JSON.stringify(sanityData, null, 2)}

Rules:
1. Always verify vehicle compatibility explicitly before recommending a spare part.
2. If a part is only compatible with Corolla, state clearly that it is NOT compatible with Camry.
3. Cite the exact Part Numbers, specifications, and Error Codes from Sanity.
4. Format your answer nicely with clean markdown bullet points.
`

    // 3. استدعاء النموذج
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.1,
    })

    const reply = completion.choices[0]?.message?.content || 'No response generated.'
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ reply: `❌ Server Error: ${error.message}` }, { status: 500 })
  }
}