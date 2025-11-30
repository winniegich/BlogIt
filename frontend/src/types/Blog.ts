export type Blog = {
  id: string;
  _id?: string; 
  Id?: string;

  title: string;
  synopsis?: string;

  featuredImageUrl?: string;
  featuredImg?: string;

  user?: {
    firstName: string;
    lastName: string;
  };

  createdAt?: string;
  dateCreated?: string;
};

export type BlogInput = {
  blog?: Blog;
  Blog?: Blog;
} & Partial<Blog>;
