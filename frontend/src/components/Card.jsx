export default function Card({ category, handleClick }) {
  return (
    <div
      onClick={() => handleClick(category.id)}
      className="cursor-pointer border border-neutral-300 rounded-lg bg-white p-6 text-center hover:border-black hover:shadow-sm transition"
    >
      <h2 className="text-lg font-semibold text-neutral-900 mb-2">
        {category.name}
      </h2>
      <p className="text-sm text-neutral-600 leading-relaxed">
        {category.description}
      </p>
    </div>
  );
}
