import React, { useEffect, useState } from "react";
import { firestore, auth } from "../../firebase"; 
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import Thread from "./Thread";

export default function FeedbackPage() {
  const [threads, setThreads] = useState([]);
  const [newThread, setNewThread] = useState("");

  // Fetch threads in real-time
  useEffect(() => {
    const q = query(collection(firestore, "feedbackThreads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setThreads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Add new thread
  const handleAddThread = async () => {
    if (!newThread.trim() || !auth.currentUser) return;
    await addDoc(collection(firestore, "feedbackThreads"), {
      text: newThread,
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      createdAt: serverTimestamp()
    });
    setNewThread("");
  };

  return (
    <div className="feedback-page p-8">
      <h2 className="text-3xl font-bold mb-6 text-foreground">Feedback & Discussions</h2>
      <div className="mb-6">
        <textarea
          placeholder="Write your feedback..."
          value={newThread}
          onChange={(e) => setNewThread(e.target.value)}
          className="w-full p-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          rows="4"
        />
        <button onClick={handleAddThread} className="mt-3 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">Post</button>
      </div>

      <div className="threads">
        {threads.map(thread => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
}