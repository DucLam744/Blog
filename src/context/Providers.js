// src/context/Providers.js
import { AuthProvider } from "./AuthContext"
import { ErrorProvider } from "./ErrorContext"
import ReplyCommentProvider from "./ReplyCommentContext"

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <ErrorProvider>
        <ReplyCommentProvider>{children}</ReplyCommentProvider>
      </ErrorProvider>
    </AuthProvider>
  )
}

export default Providers
