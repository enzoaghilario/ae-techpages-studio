export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <a href="#topo" onClick={onClick} className="flex items-center gap-2.5 font-display font-bold tracking-wider" aria-label="AE Tech Pages — início">
      <span className="grid size-9 place-items-center rounded-full border-2 border-primary text-sm text-primary shadow-glow">AE</span>
      <span className="text-sm sm:text-base">TECH <span className="text-primary">PAGES</span></span>
    </a>
  );
}

export const IG = "https://www.instagram.com/ae.techpages/";
