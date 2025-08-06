// app/community/create/page.tsx
import { PostForm } from '@/app/community/components/posts/PostForm'; // Adjust path
import Link from 'next/link';

export default function CreatePostPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link href="/community">
        <button className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
          ← Back to Community Feed
        </button>
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Create New Post</h1>
      <PostForm />
    </div>
  );
}