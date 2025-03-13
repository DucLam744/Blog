import { useEffect, useState } from "react";
import React from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function PostList() {
    const [posts, setPosts] = useState([]);

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
        };
        getPostList();
    }, []);


    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`http://localhost:4000/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Không thể xóa bài viết');
            }


            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Lỗi khi xoá bài viết: ', error);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Danh sách bài viết</h2>
            <div>
                {posts.map(post => (
                    <ListGroup.Item key={post.id} className="d-flex justify-content-between">
                        <div>
                            <h5>
                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                            </h5>
                            <p>{post.content.slice(0, 100)}...</p>
                        </div>
                        <div>
                            <Button 
                                variant="danger" 
                                onClick={() => handleDelete(post.id)} 
                                className="ml-2"
                            >
                                Xoá
                            </Button>

                            {/* Nút cập nhật */}
                            <Link to={`/posts/edit/${post.id}`}>
                                <Button variant="warning" className="ml-2">
                                    Cập nhật
                                </Button>
                            </Link>
                        </div>
                    </ListGroup.Item>
                ))}
            </div>
        </Container>
    );
}
