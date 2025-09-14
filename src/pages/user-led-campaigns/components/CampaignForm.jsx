import { useState } from "react";
import axios from "axios";

const categoryTagsMap = {
  "Food & Beverages": ["healthy", "protein rich", "quality", "great reviews"],
  Electronics: ["iPhone", "MacBook", "AirPods", "Samsung"],
  Fashion: ["Nike", "Adidas", "Trendy", "Comfortable"],
  "Home&Appliances": ["Durable", "Energy Saving", "Smart", "Warranty"],
};

export default function CampaignForm() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");

  const availableTags = category ? categoryTagsMap[category] || [] : [];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  const submitCampaign = async () => {
    if (!category) { setError("Select a category"); return; }
    if (tags.length < 2) { setError("Select at least 2 tags"); return; }

    try {
      const createdAt = new Date().toISOString();
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await axios.post("/api/createCampaign", {
        title, description, category, tags,
        createdAt, endDate,
        creator: { id: "1", name: "Anonymous" },
        upvotes: 0, downvotes: 0, isApproved: false
      });

      setError(""); setTitle(""); setDescription(""); setCategory(""); setTags([]);
      alert("Campaign submitted!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 border rounded max-w-lg mx-auto mt-6">
      <h2 className="font-bold text-lg mb-2">Submit a New Campaign</h2>

      <select className="border p-2 w-full mb-2" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {Object.keys(categoryTagsMap).map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />

      {category && (
        <div className="mb-2">
          <h3 className="font-medium mb-2">Select Tags (min 2)</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded ${tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={submitCampaign} className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
    </div>
  );
}
