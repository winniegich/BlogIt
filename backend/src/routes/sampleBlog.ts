// // src/routes/sampleBlog.ts
// import { Router } from "express";
// import OpenAI from "openai";

// const router = Router();

// console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // Fast sample blog (text only)
// router.get("/sample-blog", async (req, res) => {
//     console.log("Received request to /ai/sample-blog");

//   if (!process.env.OPENAI_API_KEY) {
//     console.error("OpenAI API key is missing!");
//     return res.status(500).json({ error: "OpenAI API key is missing" });
//   }

//   try {
//     const prompt = `
//       Generate a short sample blog with:
//       1. Title
//       2. One-sentence synopsis
//       3. 3-5 sentences content
//       Respond ONLY in JSON with keys: title, synopsis, content
//     `;

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//     });

//     let blogData;
//     try {
//       blogData = JSON.parse(completion.choices[0].message?.content ?? "{}");
//     } catch {
//       blogData = {
//         title: "Sample Blog Title",
//         synopsis: "This is a sample synopsis.",
//         content: "This is some sample content for a blog.",
//       };
//     }

//     // Return text only + placeholder image
//     res.json({
//       ...blogData,
//       featuredImageUrl: "https://via.placeholder.com/1024x1024?text=Sample+Image",
//     });
//   } catch (err) {
//     console.error("Error generating sample blog:", err);
    
//     res.json({
//       title: "Fallback Sample Blog",
//       synopsis: "This is a default sample synopsis.",
//       content: "OpenAI API quota exceeded or failed. This is fallback content.",
//       featuredImageUrl: "https://via.placeholder.com/1024x1024?text=Sample+Image",
//     });
//   }
// });

// export default router;
