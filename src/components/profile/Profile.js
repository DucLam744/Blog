import { useAuth } from "../../context/AuthContext"
import MyEditor from "../../editor/Editor"

export default function Profile() {
  const { state, dispatch } = useAuth()

  return (
    <div>
      <h1>Profile</h1>
      <h1>{state.user.email}</h1>
    </div>
  )
}
