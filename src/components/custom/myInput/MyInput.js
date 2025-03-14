import { FormControl, InputGroup, FloatingLabel, Form } from "react-bootstrap"

export default function MyInput({ name, type, value, onChange }) {
  return (
    <>
      {type === "textarea" ? (
        <FloatingLabel controlId="floatingTextarea2" label={name}>
          <Form.Control
            as="textarea"
            placeholder={name}
            value={value}
            onChange={onChange}
            style={{ height: "100px" }}
          />
        </FloatingLabel>
      ) : (
        <InputGroup>
          <FormControl placeholder={name} value={value} onChange={onChange} />
        </InputGroup>
      )}
    </>
  )
}
