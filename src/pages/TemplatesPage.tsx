import { Badge } from "@/components/ui/Badge";

const templates = [
  {
    name: "Executive",
    description: "Navy blue accent, formal style",
    color: "bg-[#1e3a5f]",
    textColor: "text-[#1e3a5f]"
  },
  {
    name: "Modern",
    description: "Blue sidebar, clean layout",
    color: "bg-blue-600",
    textColor: "text-blue-600"
  },
  {
    name: "Classic",
    description: "Traditional, ATS-optimized",
    color: "bg-black",
    textColor: "text-black"
  },
  {
    name: "Minimal",
    description: "Clean, whitespace-focused",
    color: "bg-gray-800",
    textColor: "text-gray-800"
  },
  {
    name: "Creative",
    description: "Bold colors, modern design",
    color: "bg-[#ff6b6b]",
    textColor: "text-[#ff6b6b]"
  },
  {
    name: "Technical",
    description: "Monospace, developer-friendly",
    color: "bg-green-700",
    textColor: "text-green-700"
  },
  {
    name: "Gradient",
    description: "Modern gradient accents",
    color: "bg-gradient-to-r from-purple-600 to-blue-600",
    textColor: "text-purple-600"
  },
  {
    name: "Sidebar",
    description: "Two-column with colored sidebar",
    color: "bg-teal-600",
    textColor: "text-teal-600"
  },
  {
    name: "Timeline",
    description: "Visual timeline for experience",
    color: "bg-orange-500",
    textColor: "text-orange-500"
  },
  {
    name: "Magazine",
    description: "Editorial-inspired layout",
    color: "bg-rose-600",
    textColor: "text-rose-600"
  },
  {
    name: "Corporate",
    description: "Professional with accent bars",
    color: "bg-indigo-700",
    textColor: "text-indigo-700"
  },
  {
    name: "Bold",
    description: "Large, impactful headers",
    color: "bg-amber-600",
    textColor: "text-amber-600"
  }
];

export function TemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold">Templates</h1>
      <p className="mt-2 text-muted-foreground">ATS-friendly resume layouts that stand out from the crowd.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {templates.map((template) => (
          <div className="group relative aspect-[3/4] rounded-lg border bg-card p-4 shadow-soft transition-all hover:shadow-md hover:-translate-y-1" key={template.name}>
            {/* Template Preview */}
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              {/* Header accent */}
              <div className={`h-16 ${template.color} opacity-90`} />

              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                {/* Name */}
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                {/* Role */}
                <div className="h-2 w-1/2 rounded bg-gray-200" />
                {/* Contact */}
                <div className="flex gap-2">
                  <div className="h-1.5 w-12 rounded bg-gray-200" />
                  <div className="h-1.5 w-16 rounded bg-gray-200" />
                </div>
                {/* Section 1 */}
                <div className="mt-4">
                  <div className={`h-1 w-16 rounded ${template.color} opacity-60 mb-2`} />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                  </div>
                </div>
                {/* Section 2 */}
                <div className="mt-3">
                  <div className={`h-1 w-20 rounded ${template.color} opacity-60 mb-2`} />
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-4/5 rounded bg-gray-200" />
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                  </div>
                </div>
                {/* Skills */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 w-10 rounded ${template.color} opacity-40`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

            {/* Badge */}
            <div className="absolute top-3 left-3 z-10">
              <Badge className={`${template.color} text-white border-0`}>{template.name}</Badge>
            </div>

            {/* Description */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <p className="text-[10px] font-medium text-white bg-black/70 rounded px-2 py-1 backdrop-blur-sm">
                {template.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
