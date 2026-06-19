import { Clock3 } from "lucide-react";

export function EmptyState() {
  return (
    <section className="empty-state">
      <div>
        <Clock3 size={22} />
      </div>
      <div>
        <strong>No analyses yet</strong>
        <p>Fill in the form above and generate a sales intelligence report.</p>
      </div>
    </section>
  );
}
