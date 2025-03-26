import { useEffect, useState } from "react"
import { useAuth } from "../../shared/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { environment } from "../../shared/constants/StorageKey.js"
import axios from "axios"

export default function EditProfile() {
  const navigate = useNavigate()
  const { state } = useAuth()
  const [account, setAccount] = useState(null)
  const [error, setError] = useState([])
  const [updateAccount, setUpdateAccount] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  })
  const getAccount = () => {
    setAccount(state.user)
    setUpdateAccount({
      ...updateAccount,
      username: state.user.username,
    })
  }

  useEffect(() => {
    getAccount()
  }, [])

  const handleUpdateProfile = async () => {
    console.log(updateAccount.oldPassword, state.user.password)

    setError([])
    let errors = []
    let isValid = true
    if (!updateAccount.username.trim()) {
      errors = [...errors, "Username cannot be empty!"]
      isValid = false
    }
    if (!updateAccount.oldPassword.trim()) {
      errors = [...errors, "Please input old password"]
      isValid = false
    }
    if (!updateAccount.newPassword.trim()) {
      errors = [...errors, "Please input new password"]
      isValid = false
    }
    if (updateAccount.oldPassword != state.user.password) {
      errors = [...errors, "Old password is incorrect!"]
      isValid = false
    }
    if (updateAccount.newPassword == state.user.password) {
      errors = [...errors, "New password must be different from old password!"]
      isValid = false
    }
    if (errors.length !== 0) {
      setError(errors)
    }
    if (isValid) {
      await axios
        .patch(`${environment.apiUrl}/users/${state.user.id}`, {
          username: updateAccount.username,
          password: updateAccount.newPassword,
        })
        .then(() => alert("Please login again!"))
        .then(() => navigate("/logout"))
    }
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Update Your Profile</h1>

            <ul className="error-messages">
              {error.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    value={account && updateAccount.username}
                    onChange={(e) =>
                      setUpdateAccount({
                        ...updateAccount,
                        username: e.target.value,
                      })
                    }
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Username"
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    value={account && account.email}
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    disabled
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    value={updateAccount.oldPassword}
                    onChange={(e) =>
                      setUpdateAccount({
                        ...updateAccount,
                        oldPassword: e.target.value,
                      })
                    }
                    className="form-control form-control-lg"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Old Password"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    value={updateAccount.newPassword}
                    onChange={(e) =>
                      setUpdateAccount({
                        ...updateAccount,
                        newPassword: e.target.value,
                      })
                    }
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  onClick={handleUpdateProfile}>
                  Update Profle
                </button>
              </fieldset>
            </div>
            <hr />
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate("/logout")}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
