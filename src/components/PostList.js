import { useEffect, useState } from "react"
import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function PostList() {
    const [posts, setPosts] = useState([])

    

    useEffect(() => {
        const getPostList = async () => {
            try {
                const response = await fetch('http://localhost:4000/posts');

                if (!response.ok) {
                    throw new Error('Không thể kết nối API');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Lỗi khi kết nối với API: ', error);
            }
        }
        getPostList()
    }, [])
    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Danh sách bài viết</h2>
            <div>
                {posts.map(post => (
                    <ListGroup.Item key={post.id}>
                        <h5>
                            <Link to={`/posts/${post.id}`}>{post.title}</Link>
                        </h5>
                        <p>{post.content.slice(0, 100)}...</p>
                    </ListGroup.Item>
                ))}
            </div>
        </Container>
    )
}