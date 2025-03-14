import { createContext, useContext, useState } from "react"
import { Alert, CloseButton } from "react-bootstrap"

const ErrorContext = createContext()

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const showError = (message) => {
    setMessage(null)
    setError(message)
  }

  const showMessage = (message) => {
    setError(null)
    setMessage(message)
  }

  return (
    <ErrorContext.Provider value={{ error, showError, message, showMessage }}>
      {error && (
        <div className="position-fixed top-0 start-50 translate-middle-x w-100 p-3 z-3">
          <Alert
            className="d-flex align-items-center justify-content-between w-50 mx-auto shadow"
            variant="danger">
            <span>
              <pre>{error}</pre>
            </span>
            <CloseButton onClick={() => setError(null)} />
          </Alert>
        </div>
      )}
      {message && (
        <div className="position-fixed top-0 start-50 translate-middle-x w-100 p-3 z-3">
          <Alert
            className="d-flex align-items-center justify-content-between w-50 mx-auto shadow text-center"
            variant="success">
            <span>
              <pre>{message}</pre>
            </span>
            <CloseButton onClick={() => setMessage(null)} />
          </Alert>
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = () => {
  return useContext(ErrorContext)
}
