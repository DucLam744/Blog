import { Button, Image, Dropdown } from "react-bootstrap"
import { AVATAR_DEFAULT } from "../../../config/env"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import MyInput from "../myInput/MyInput"
import {
  faEdit,
  faEllipsisVertical,
  faReply,
  faTrash,
} from "@fortawesome/free-solid-svg-icons"
import "./myComment.scss"
import { useReplyComment } from "../../../context/ReplyCommentContext"
import { ADD_PARENT, COMMENT } from "../../../constants/ReplyCommentAction"
import api from "../../../api/api"
import { useState } from "react"
import Swal from "sweetalert2"
import { useAuth } from "../../../context/AuthContext"
import axios from "axios"

export default function MyComment({ comment, parent, isChild, trigger }) {
  const { state: authState } = useAuth()
  const { state, dispatch } = useReplyComment()
  const [updateComment, setUpdateComment] = useState({
    id: null,
    content: "",
  })

  console.log(comment)

  const sendComment = async () => {
    const parentComment = await axios.get(
      `http://localhost:4000/comments/${comment.id}`
    )
    await axios.patch(`http://localhost:4000/comments/${comment.id}`, {
      childrenComments: [
        ...parentComment.data.childrenComments,
        {
          id: Math.floor(Math.random() * 1000000).toString(),
          blogId: comment.blogId.toString(),
          accountResponse: {
            email: authState.user.email,
          },
          content: state.content,
          childrenComments: [],
          createdAt: new Date().toISOString(),
          updatedAt: null,
        },
      ],
    })
    dispatch({ type: ADD_PARENT, payload: null })
    dispatch({ type: COMMENT, payload: "" })
    trigger()
  }

  const handleUpdateComment = async () => {
    if (!isChild) {
      await axios.patch(`http://localhost:4000/comments/${updateComment.id}`, {
        content: updateComment.content,
        updatedAt: new Date().toISOString(),
      })
    } else {
      let parentComment = await axios.get(
        `http://localhost:4000/comments/${parent.id}`
      )
      parentComment = parentComment.data.childrenComments.map((comment) => {
        if (comment.id === updateComment.id) {
          return {
            ...comment,
            content: updateComment.content,
            updatedAt: new Date().toISOString(),
          }
        } else {
          return comment
        }
      })
      await axios.patch(`http://localhost:4000/comments/${parent.id}`, {
        childrenComments: parentComment,
      })
    }
    setUpdateComment({ id: null, content: "" })
    trigger()
  }

  const handleDeleteComment = (id) => {
    console.log(parent.id)

    Swal.fire({
      title: "Do you want to delete this comment?",
      showConfirmButton: true,
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "danger",
      cancelButtonColor: "grey",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!isChild) {
          await axios.delete(`http://localhost:4000/comments/${comment.id}`)
        } else {
          const parentComment = await axios.get(
            `http://localhost:4000/comments/${parent.id}`
          )
          let newCmt = parentComment.data.childrenComments.filter(
            (child) => child.id !== id
          )
          await axios.patch(`http://localhost:4000/comments/${parent.id}`, {
            childrenComments: newCmt,
          })
        }
        trigger()
      }
    })
  }

  return (
    <div className="ps-3 ms-3">
      <div
        className={
          isChild ? "d-flex mb-2 border-start border-primary" : "d-flex mb-2"
        }>
        <Image className="avatar mx-2" src={AVATAR_DEFAULT} roundedCircle />
        <div className="rounded p-3 bg-body-secondary">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              {<h6 className="fw-bold">{comment.accountResponse.email}</h6>}
              <p className="fs-6 ms-5 text-black-50">
                {comment.createdAt.substring(0, 10) +
                  " " +
                  comment.createdAt.substring(11, 19)}
              </p>
            </div>
            {authState.user &&
              authState.user.email === comment.accountResponse.email && (
                <div className="dropdown">
                  <Dropdown>
                    <Dropdown.Toggle className="dropdown-toggle bg-transparent border-0 text-black">
                      <FontAwesomeIcon
                        className="pt-1"
                        icon={faEllipsisVertical}
                      />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="text-success ps-4 border-bottom"
                        onClick={() =>
                          setUpdateComment({
                            id: comment.id,
                            content: comment.content,
                          })
                        }>
                        <FontAwesomeIcon icon={faEdit} /> Update
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-danger ps-4"
                        onClick={() => handleDeleteComment(comment.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
          </div>
          <div>
            {updateComment.id === null ? (
              <p className="text-break ms-4">{comment.content}</p>
            ) : (
              <MyInput
                value={updateComment.content}
                type="textarea"
                name={"Update comment"}
                onChange={(e) =>
                  setUpdateComment({
                    ...updateComment,
                    content: e.target.value,
                  })
                }
              />
            )}
          </div>
          <div className="mt-1">
            {!updateComment.id ? (
              <Button
                hidden={isChild}
                className="bg-transparent border-0 text-primary"
                onClick={() =>
                  dispatch({ type: ADD_PARENT, payload: comment.id })
                }>
                <FontAwesomeIcon icon={faReply} /> Reply
              </Button>
            ) : (
              <>
                <Button
                  className="mx-2 bg-secondary border-0"
                  onClick={() => setUpdateComment({ id: null, content: "" })}>
                  Cancel
                </Button>
                <Button
                  className="mx-2 bg-success border-0"
                  onClick={handleUpdateComment}>
                  Update
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {state.parentId === comment.id && (
        <div className="w-50 ms-5 ps-5 px-5 mx-5 mb-2">
          <MyInput
            type="textarea"
            name="Reply"
            value={state.content}
            onChange={(e) =>
              dispatch({ type: COMMENT, payload: e.target.value })
            }
          />
          <Button className="mt-3" onClick={sendComment}>
            Send
          </Button>
        </div>
      )}
      {comment.childrenComments.length !== 0 &&
        comment.childrenComments.map((child) => (
          <MyComment
            comment={child}
            parent={comment}
            isChild={true}
            trigger={trigger}
          />
        ))}
    </div>
  )
}
