import Owner from "./Owner"

export default function ReactedUsers({ reacts }) {
    if (!reacts || reacts.length === 0) return null
    console.log(reacts)
    return (
        <ul>
            {reacts.map(react => (
                <Owner key={react._id} theUser={react} />
            ))}
        </ul>

    )
}