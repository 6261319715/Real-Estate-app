import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  const { _id, title, price, location, images } = property;

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={images?.[0] || 'https://placehold.co/600x400?text=Property'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
        <p className="text-xl font-bold text-sky-600 dark:text-sky-400">
          ${price?.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{location}</span>
        </p>
        <Link
          to={`/property/${_id}`}
          className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium text-white bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
        >
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
