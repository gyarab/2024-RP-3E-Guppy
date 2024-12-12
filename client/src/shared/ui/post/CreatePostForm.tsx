import { useState } from "react";
import RichTextEditor from "./RichTextEditor";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, content });
  };

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <RichTextEditor value={content} onChange={setContent} />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePostForm;
