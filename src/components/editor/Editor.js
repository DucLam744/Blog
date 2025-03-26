import React, { useEffect, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css" // Import Quill's snow theme CSS

const Editor = ({ content, handleChange }) => {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    // Khởi tạo Quill editor nếu chưa được khởi tạo
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ align: [] }],
            ["clean"],
          ],
        },
      })

      // Đăng ký sự kiện thay đổi nội dung
      quillRef.current.on("text-change", () => {
        handleChange(quillRef.current.root.innerHTML) // Gửi nội dung đến handleChange
      })
    }

    // Cập nhật nội dung trong editor khi `content` prop thay đổi
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content
    }
  }, [content, handleChange])

  return (
    <div>
      <div ref={editorRef} style={{ height: "300px" }}></div>{" "}
      {/* Quill editor */}
    </div>
  )
}

export default Editor
