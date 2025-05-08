import openai from "@/lib/openai";

async function main() {
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-4o-search-preview",
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    
  });

  console.log(completion.choices[0].message);
}