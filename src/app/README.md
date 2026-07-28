# Sprint 1 Architecture

This slice establishes the product foundation before deep feature work.

- `app`: global providers and application entry.
- `components/ui`: reusable design-system primitives.
- `components/layout`: shared navigation and shell components.
- `context`: mock auth, theme, and resume state prepared for backend integration.
- `features`: focused product-area components.
- `pages`: route-level composition only.
- `routes`: central route table.
- `styles`: Tailwind token layer with light and dark themes.

Next sprint should split the resume builder into independent section editors with add, edit, delete, collapse, expand, and drag-and-drop placeholders.
