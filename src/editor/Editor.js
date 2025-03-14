import React from "react"
import { FormControl, Modal } from "react-bootstrap"
import { Editor } from "@tinymce/tinymce-react"
import Button from "react-bootstrap/Button"
import "./editor.scss"

const MyEditor = ({
  id,
  name,
  title,
  setTitle,
  tags,
  setTags,
  show,
  content,
  setContent,
  handleClose,
  handleSave,
}) => {
  return (
    <Modal className="modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col-6">
            <h3>Title</h3>
            <FormControl value={title} onChange={setTitle}></FormControl>
          </div>
          <div className="col-6">
            <h3>Tags</h3>
            <FormControl value={tags} onChange={setTags}></FormControl>
          </div>
        </div>
        <div>
          <Editor
            apiKey="nxybzh3om3ei4wcbxrxg289tlf08xzr3peiish7mu1c3yaei"
            init={{
              height: 400,
              menubar: false,
              plugins: "lists",
              toolbar:
                "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright | fontsizeselect formatselect | forecolor backcolor | blocks fontfamily fontsize | subscript superscript | removeformat",
            }}
            value={content}
            onEditorChange={setContent}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MyEditor
