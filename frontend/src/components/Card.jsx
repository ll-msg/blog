export default function Card({category, handleClick}) {
    return (
        <div className="card" onClick={() => handleClick(category.id)}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
        </div>
    )
}