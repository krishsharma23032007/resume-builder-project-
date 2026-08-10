import type { ReactNode } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  children: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
};

export function FormSection({ title, children, onAdd, addLabel = "Add", className }: FormSectionProps) {
  return (
    <Card className={cn("shadow-none", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-muted-foreground cursor-grab" />
          <h2 className="font-semibold">{title}</h2>
        </div>
        {onAdd && (
          <Button onClick={onAdd} size="sm" type="button" variant="ghost">
            <Plus size={16} />
            {addLabel}
          </Button>
        )}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  );
}

type EntryCardProps = {
  children: ReactNode;
  onDelete: () => void;
  title?: string;
};

export function EntryCard({ children, onDelete, title }: EntryCardProps) {
  return (
    <div className="rounded-lg border border-muted p-4 pr-12 space-y-3 relative">
      {title && <p className="text-sm font-medium text-muted-foreground">{title}</p>}
      {children}
      <Button
        className="absolute top-3 right-3"
        onClick={onDelete}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Trash2 size={14} className="text-red-500" />
      </Button>
    </div>
  );
}

type FieldRowProps = {
  children: ReactNode;
  className?: string;
};

export function FieldRow({ children, className }: FieldRowProps) {
  return <div className={cn("grid gap-3 sm:grid-cols-2", className)}>{children}</div>;
}
