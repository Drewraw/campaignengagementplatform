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

export default function Thread({ thread }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    const q = query(
      collection(firestore, "feedbackThreads", thread.id, "replies"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReplies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [thread.id]);

  const handleAddReply = async () => {
    if (!newReply.trim() || !auth.currentUser) return;
    await addDoc(collection(firestore, "feedbackThreads", thread.id, "replies"), {
      text: newReply,
      userId: auth.currentUser.uid,
      username: auth.currentUser.displayName || "Anonymous",
      createdAt: serverTimestamp()
    });
    setNewReply("");
  };

  return (
    <div className="thread border-l-2 pl-4 pt-4 mt-4">
      <p><strong>{thread.username}</strong>: {thread.text}</p>
      <div className="replies ml-4 mt-2 space-y-2">
        {replies.map(reply => (
          <p key={reply.id} className="text-sm"><strong>{reply.username}</strong>: {reply.text}</p>
        ))}
      </div>
      <div className="mt-2 flex items-center">
        <input
          type="text"
          placeholder="Reply..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          className="w-full p-2 bg-input border border-border rounded-lg text-sm"
        />
        <button onClick={handleAddReply} className="ml-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">Reply</button>
       </div>
    </div>
  );
}