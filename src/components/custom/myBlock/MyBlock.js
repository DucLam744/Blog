export default function MyBlock({ name, children }) {
  return (
    <div className="mt-5 ml-1 border border-black p-5">
      <div className="border border-black p-2">
        <h5 className="border-bottom pb-2">{name}</h5>
        {children}
      </div>
    </div>
  )
}
