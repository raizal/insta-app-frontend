
import { toast } from "sonner";

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePic: string;
  content: string;
  image: string | null;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userProfilePic: string;
  content: string;
  createdAt: Date;
}

// Mock data for demonstration purposes
const MOCK_POSTS: Post[] = [
  {
    id: "post1",
    userId: "user1",
    username: "johndoe",
    userProfilePic: "https://source.unsplash.com/100x100/?portrait,man",
    content: "Enjoying my vacation! 🌴",
    image: "https://source.unsplash.com/800x600/?beach,vacation",
    likes: ["user2", "user3"],
    comments: [
      {
        id: "comment1",
        userId: "user2",
        username: "janedoe",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,woman",
        content: "Looks amazing! Have a great time!",
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: "comment2",
        userId: "user3",
        username: "sarahsmith",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,woman,2",
        content: "Wow! The beach looks beautiful. Wish I was there!",
        createdAt: new Date(Date.now() - 2800000),
      },
      {
        id: "comment3",
        userId: "user4",
        username: "alexjones",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,man,2",
        content: "Don't forget the sunscreen! 😎",
        createdAt: new Date(Date.now() - 2500000),
      },
      {
        id: "comment4",
        userId: "user5",
        username: "mikebrown",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,man,3",
        content: "Which beach is this? I might plan a trip there too!",
        createdAt: new Date(Date.now() - 2200000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "post2",
    userId: "user2",
    username: "janedoe",
    userProfilePic: "https://source.unsplash.com/100x100/?portrait,woman",
    content: "Just finished this book. Highly recommend it!",
    image: "https://source.unsplash.com/800x600/?book,reading",
    likes: ["user1", "user4", "user5"],
    comments: [
      {
        id: "comment5",
        userId: "user1",
        username: "johndoe",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,man",
        content: "What's it about? I'm looking for a new read.",
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: "comment6",
        userId: "user4",
        username: "alexjones",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,man,2",
        content: "Added to my reading list! Thanks for sharing.",
        createdAt: new Date(Date.now() - 1500000),
      },
    ],
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: "post3",
    userId: "user3",
    username: "sarahsmith",
    userProfilePic: "https://source.unsplash.com/100x100/?portrait,woman,2",
    content: "My new home office setup is finally complete! 💻",
    image: "https://source.unsplash.com/800x600/?desk,office",
    likes: ["user1", "user2"],
    comments: [],
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: "post4",
    userId: "user4",
    username: "alexjones",
    userProfilePic: "https://source.unsplash.com/100x100/?portrait,man,2",
    content: "Hiked to the summit today. The view was worth every step!",
    image: "https://source.unsplash.com/800x600/?mountain,hiking",
    likes: ["user3", "user5"],
    comments: [
      {
        id: "comment7",
        userId: "user5",
        username: "mikebrown",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,man,3",
        content: "Which trail did you take? Looks breathtaking!",
        createdAt: new Date(Date.now() - 1200000),
      },
    ],
    createdAt: new Date(Date.now() - 345600000),
  },
  {
    id: "post5",
    userId: "user5",
    username: "mikebrown",
    userProfilePic: "https://source.unsplash.com/100x100/?portrait,man,3",
    content: "Made this pasta from scratch. First attempt at homemade pasta!",
    image: "https://source.unsplash.com/800x600/?pasta,food",
    likes: ["user1", "user2", "user3", "user4"],
    comments: [
      {
        id: "comment8",
        userId: "user1",
        username: "johndoe",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,man",
        content: "Looks delicious! Would love the recipe.",
        createdAt: new Date(Date.now() - 900000),
      },
      {
        id: "comment9",
        userId: "user2",
        username: "janedoe",
        userProfilePic: "https://source.unsplash.com/100x100/?portrait,woman",
        content: "Great job for a first attempt! Mine never turns out this good.",
        createdAt: new Date(Date.now() - 600000),
      },
    ],
    createdAt: new Date(Date.now() - 432000000),
  },
];

// In a real application, these functions would make API calls
export const getPosts = async (): Promise<Post[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Get posts from localStorage or use mock data
  const storedPosts = localStorage.getItem("posts");
  return storedPosts ? JSON.parse(storedPosts) : MOCK_POSTS;
};

export const createPost = async (post: Omit<Post, "id" | "createdAt">): Promise<Post> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newPost: Post = {
    ...post,
    id: `post${Date.now()}`,
    createdAt: new Date(),
  };

  // Get existing posts
  const posts = await getPosts();
  const updatedPosts = [newPost, ...posts];
  
  // Save to localStorage
  localStorage.setItem("posts", JSON.stringify(updatedPosts));
  
  return newPost;
};

export const likePost = async (postId: string, userId: string): Promise<void> => {
  const posts = await getPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  
  if (postIndex !== -1) {
    const post = posts[postIndex];
    const hasLiked = post.likes.includes(userId);
    
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
      toast.success("Like removed");
    } else {
      post.likes.push(userId);
      toast.success("Post liked");
    }
    
    posts[postIndex] = post;
    localStorage.setItem("posts", JSON.stringify(posts));
  }
};

export const addComment = async (postId: string, comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> => {
  const posts = await getPosts();
  const postIndex = posts.findIndex((p) => p.id === postId);
  
  if (postIndex === -1) {
    throw new Error("Post not found");
  }
  
  const newComment: Comment = {
    ...comment,
    id: `comment${Date.now()}`,
    createdAt: new Date(),
  };
  
  posts[postIndex].comments.push(newComment);
  localStorage.setItem("posts", JSON.stringify(posts));
  
  return newComment;
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const posts = await getPosts();
  return posts.filter((post) => post.userId === userId);
};
