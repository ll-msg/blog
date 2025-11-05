export default function Card({ category, handleClick }) {
  return (
    <div
      onClick={() => handleClick(category.id)}
      className="cursor-pointer border border-border rounded-lg bg-bg-soft p-6 text-center hover:border-darkblue-800 hover:shadow-sm transition"
    >
      <h2 className="text-lg font-semibold text-darkblue-900 mb-2">
        {category.name}
      </h2>
      <p className="text-sm text-darkblue-600 leading-relaxed">
        {category.description}
      </p>
    </div>
  );
}
