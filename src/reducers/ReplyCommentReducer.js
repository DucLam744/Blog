import { ADD_PARENT, COMMENT } from "../constants/ReplyCommentAction"

export const replyComment = {
  parentId: null,
  content: "",
}

export const replyCommentReducer = (state, action) => {
  switch (action.type) {
    case ADD_PARENT:
      return {
        ...state,
        parentId: state.parentId === action.payload ? null : action.payload,
      }
    case COMMENT:
      return {
        ...state,
        content: action.payload,
      }
  }
}
