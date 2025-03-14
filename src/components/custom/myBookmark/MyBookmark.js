import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons"
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons"
import { useState } from "react"

export default function MyBookmark({ status, onClick }) {
  const check = Boolean(status)
  return (
    <>
      {check === true ? (
        <FontAwesomeIcon
          icon={solidBookmark}
          style={{ color: "#FFD43B" }}
          onClick={onClick}
        />
      ) : (
        <FontAwesomeIcon icon={regularBookmark} onClick={onClick} />
      )}
    </>
  )
}
