import { useState } from "react";
import axios from "axios";

const categories = {
  "Food": ["Healthy", "Protein Rich", "Quality", "Great Reviews"],
  "Electronics": ["iPhone", "MacBook", "AirPods", "Samsung"],
  "Fashion": ["Nike", "Adidas", "Puma"],
  // Add more categories here
};

export default function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");

  const toggleTag = (tag) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  const submitCampaign = async () => {
    if (tags.length < 2) {
      setError("Please select at least 2 tags");
      return;
    }
    try {
      await axios.post("/api/createCampaign", {
        title,
        description,
        category,
        tags,
        creator: { id: "1", name: "Anonymous" },
        createdAt: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isApproved: false,
        upvotes: 0,
      });
      setError("");
      setTitle("");
      setDescription("");
      setTags([]);
      alert("Campaign submitted!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 border rounded max-w-lg mx-auto mt-6">
      <h2 className="font-bold text-lg mb-2">Submit a New Campaign Idea</h2>

      <select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 w-full mb-2">
        {Object.keys(categories).map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Campaign title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Campaign description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <h3 className="font-medium mb-2">Select Tags (min 2)</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {categories[category].map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded ${tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button 
        onClick={submitCampaign}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
