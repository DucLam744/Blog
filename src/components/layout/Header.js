import { Link } from "react-router-dom"
import { useAuth } from "../../shared/context/AuthContext"
import { USER_CURRENT } from "../../shared/constants/StorageKey"

export default function Header() {
  const { state } = useAuth()
  return (
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="/">
          Blog
        </a>
        <ul class="nav navbar-nav pull-xs-right nav-g">
          <li class="nav-item">
            <Link class="nav-link active" to={"/"}>
              Home
            </Link>
          </li>
          {!state.isAuthenticated && (
            <>
              <li class="nav-item">
                <Link class="nav-link" to={"/login"}>
                  Sign in
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/register">
                  Sign up
                </Link>
              </li>
            </>
          )}
          {state.isAuthenticated && (
            <>
              <li class="nav-item">
                <Link class="nav-link" to={"/create-blog"}>
                  Create Blog
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link"
                  to={`/profile/${
                    JSON.parse(localStorage.getItem(USER_CURRENT)).id
                  }`}>
                  Profile
                </Link>
              </li>
              <li>
                <Link class="nav-link" to={"/logout"}>
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
