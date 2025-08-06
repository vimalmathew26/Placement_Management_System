"use client";
import { useEffect, useState } from "react";
import { fetchNotices, createNotice, updateNotice, deleteNotice } from "../notice/api";
import { Card, Button, Input } from "@heroui/react";
import { FaCalendar, FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";

type Notice = {
  _id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
};

export default function NoticeBoard({ userRole = "student" }: { userRole?: string }) {
 const [notices, setNotices] = useState<Notice[]>([]);
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [editing, setEditing] = useState<Notice | null>(null);
   const [search, setSearch] = useState("");
   const [fromDate, setFromDate] = useState(""); // YYYY-MM-DD
   const [toDate, setToDate] = useState("");     // YYYY-MM-DD
   const [showFilters, setShowFilters] = useState(false);

   useEffect(() => {
     fetchNotices().then(setNotices).catch(console.error);
   }, []);
 
   // Filtered notices
   const filteredNotices = notices.filter(n => {
     const matchesSearch =
       n.title.toLowerCase().includes(search.toLowerCase()) ||
       n.content.toLowerCase().includes(search.toLowerCase());

     const noticeDate = n.created_at.slice(0, 10);
     const afterFrom = fromDate ? noticeDate >= fromDate : true;
     const beforeTo = toDate ? noticeDate <= toDate : true;

     return matchesSearch && afterFrom && beforeTo;
   });
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       if (editing) {
         await updateNotice(editing._id, { title, content });
       } else {
         await createNotice({ title, content });
       }
       setTitle("");
       setContent("");
       setEditing(null);
       setNotices(await fetchNotices());
     } catch {
       alert("Error saving notice");
     }
   };
 
   const handleEdit = (notice: Notice) => {
     setEditing(notice);
     setTitle(notice.title);
     setContent(notice.content);
   };
 
   const handleDelete = async (id: string) => {
     if (!confirm("Delete this notice?")) return;
     await deleteNotice(id);
     setNotices(await fetchNotices());
   };
 
   return (
     <div className="p-4 max-w-4xl mx-auto">
       <h1 className="text-3xl text-center font-semibold text-green-800 mb-8">
         Notice Board
       </h1>

       <div className="mb-6 space-y-4">
         <div className="flex items-center gap-4">
           <div className="relative flex-1">
             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
             <Input
               placeholder="Search notices..."
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="pl-10 w-full bg-white border-green-200 focus:border-green-500 focus:ring-green-500"
             />
           </div>
           <Button
             onClick={() => setShowFilters(!showFilters)}
             className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100"
           >
             <FaCalendar className="h-5 w-5" />
             Filters
             {showFilters ? (
               <FaArrowUp  className="h-4 w-4" />
             ) : (
               <FaArrowDown className="h-4 w-4" />
             )}
           </Button>
         </div>

         {showFilters && (
           <div className="flex gap-4 p-4 bg-green-50 rounded-lg animate-slideDown">
             <Input
               type="date"
               value={fromDate}
               onChange={e => setFromDate(e.target.value)}
               className="border-green-200 focus:border-green-500 focus:ring-green-500"
               placeholder="From"
             />
             <Input
               type="date"
               value={toDate}
               onChange={e => setToDate(e.target.value)}
               className="border-green-200 focus:border-green-500 focus:ring-green-500"
               placeholder="To"
             />
           </div>
         )}
       </div>

       {userRole === "admin" && (
         <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
           <div className="p-4 bg-green-50 border-b border-green-100">
             <h2 className="text-lg font-semibold text-green-800">
               {editing ? "Edit Notice" : "Create New Notice"}
             </h2>
           </div>
           <div className="p-4 space-y-4">
             <Input
               value={title}
               onChange={e => setTitle(e.target.value)}
               placeholder="Notice Title"
               required
               className="border-green-200 focus:border-green-500 focus:ring-green-500"
             />
             <textarea
               value={content}
               onChange={e => setContent(e.target.value)}
               placeholder="Notice Content"
               required
               className="w-full border-green-200 rounded-lg p-3 min-h-[100px] focus:border-green-500 focus:ring-green-500"
             />
             <div className="flex gap-3">
               <Button
                 type="submit"
                 className="bg-green-600 hover:bg-green-700 text-white"
               >
                 {editing ? "Update" : "Post"} Notice
               </Button>
               {editing && (
                 <Button
                   type="button"
                   className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                   onClick={() => { setEditing(null); setTitle(""); setContent(""); }}
                 >
                   Cancel
                 </Button>
               )}
             </div>
           </div>
         </form>
       )}

       <div className="space-y-4">
         {filteredNotices.length === 0 ? (
           <div className="text-center py-8 text-gray-500 bg-green-50 rounded-lg">
             No notices found.
           </div>
         ) : (
           filteredNotices.map(notice => (
             <Card
               key={notice._id}
               className="group hover:shadow-lg transition-shadow duration-300 border-green-100 hover:border-green-200"
             >
               <div className="p-5">
                 <div className="flex justify-between items-start">
                   <div className="space-y-2 flex-1">
                     <h3 className="font-bold text-lg text-green-800">
                       {notice.title}
                     </h3>
                     <p className="text-gray-600 leading-relaxed">
                       {notice.content}
                     </p>
                     <div className="text-sm text-gray-400">
                       {new Date(notice.created_at).toLocaleDateString("en-US", {
                         year: "numeric",
                         month: "long",
                         day: "numeric",
                         hour: "2-digit",
                         minute: "2-digit"
                       })}
                       {notice.updated_at && " (edited)"}
                     </div>
                   </div>
                   {userRole === "admin" && (
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                       <Button
                         size="sm"
                         className="bg-green-100 hover:bg-green-200 text-green-700"
                         onClick={() => handleEdit(notice)}
                       >
                         Edit
                       </Button>
                       <Button
                         size="sm"
                         className="bg-red-100 hover:bg-red-200 text-red-700"
                         onClick={() => handleDelete(notice._id)}
                       >
                         Delete
                       </Button>
                     </div>
                   )}
                 </div>
               </div>
             </Card>
           ))
         )}
       </div>
     </div>
   );
  }