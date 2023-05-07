const Number = ({ name, number, handler}) => {
    return (
        <li className="note">{name} {number} <button onClick={handler}>delete</button></li>
    )
}

export default Number