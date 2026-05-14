interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  id?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar…',
  id,
}: SearchInputProps) {
  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        aria-hidden
      >
        ⌕
      </span>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-dl-border bg-dl-elevated py-3 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-dl-accent/40 focus:ring-2"
      />
    </div>
  )
}
