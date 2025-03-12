import { FormGroup } from "react-bootstrap";
import { useState } from "react";

export default function MyPost() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const handleCreatePost = () => {
        fetch('http://localhost:4000/posts/1', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            
          })
    }
    return (
        <div>
            <input value={title} onChange={(e) => setTitle(e.target.value)}/>
            <input value={content} onChange={(e) => setContent(e.target.value)}/>
            <button onClick={handleCreatePost}>Save</button>
        </div>
    )
}