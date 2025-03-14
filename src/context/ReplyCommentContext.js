import { createContext, useContext, useReducer } from "react"
import {
  replyComment,
  replyCommentReducer,
} from "../reducers/ReplyCommentReducer"

const ReplyCommentContext = createContext()

export default function ReplyCommentProvider({ children }) {
  const [state, dispatch] = useReducer(replyCommentReducer, replyComment)
  return (
    <ReplyCommentContext.Provider value={{ state, dispatch }}>
      {children}
    </ReplyCommentContext.Provider>
  )
}

export const useReplyComment = () => {
  return useContext(ReplyCommentContext)
}
