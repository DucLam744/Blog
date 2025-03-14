import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBlog } from "@fortawesome/free-solid-svg-icons"
import "./myBlogIcon.scss"

export default function MyBlogIcon({ handleClick }) {
  return (
    <FontAwesomeIcon
      className="blog-icon"
      onClick={handleClick}
      icon={faBlog}
    />
  )
}
