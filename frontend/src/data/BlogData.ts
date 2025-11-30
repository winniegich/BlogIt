export type BlogType = {
    id: string;
    title: string;
    synopsis: string;
    content: string;
    author: string;
    createdAt: string;
    featuredImg: string;
  };
  
  export const blogData: BlogType[] = [
    {
      id: "1",
    title: "Morning Routines",
    synopsis: "Start your day with energy and focus.",
    content: "A consistent morning routine sets the tone for your day. Even simple habits like stretching, journaling, or making coffee mindfully can boost productivity.",
    author: "Emma White",
    createdAt: "2025-11-25",
    featuredImg: "https://via.placeholder.com/400x200?text=Morning+Routine"
    }
  ];
  
  