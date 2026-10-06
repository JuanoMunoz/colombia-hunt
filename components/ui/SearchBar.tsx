type SearchBarProps = {
  label: string;
  placeholder: string;
  button: string;
};

export default function SearchBar({
  label,
  placeholder,
  button,
}: SearchBarProps) {
  return (
    <form
      role="search"
      action="/"
      method="get"
      className="mx-auto flex h-14 w-[80%] items-center gap-2 rounded-full border border-(--brand)/20 bg-(--background) px-4 shadow-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--brand) sm:px-5"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 shrink-0 text-(--brand)"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.5" y2="16.5" />
      </svg>
      <label htmlFor="buscar-proyectos" className="sr-only">
        {label}
      </label>
      <input
        id="buscar-proyectos"
        name="q"
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        className="min-h-11 w-full bg-transparent text-base text-(--foreground) placeholder:text-(--foreground)/50 focus:outline-none"
      />
      <button
        type="submit"
        className="flex min-h-11 shrink-0 items-center rounded-full bg-(--brand) px-5 text-sm font-semibold text-[#FBFAF8] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
      >
        {button}
      </button>
    </form>
  );
}
