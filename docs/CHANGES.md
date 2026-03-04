# Project Changes Summary

A record of significant changes made to the Roses & Clovers Properties app.

---

## Accessibility & Polish Pass

### Accessibility — Focus Visibility
**Files:** `app/globals.css`

Added a global `:focus-visible` CSS rule so any interactive element (button, link, select) shows a visible 2px green outline when navigated by keyboard. Previously, plain `<button>` elements in the admin pages had no visible focus indicator at all.

---

### Accessibility — Skip Navigation Link
**Files:** `app/layout.tsx`

Added a "Skip to main content" link at the very top of every page. It is visually hidden until focused, then jumps keyboard users past the header nav straight to the page content. The `<main>` element received `id="main-content"` as the target.

---

### Accessibility — Keyboard Support for Modals
**Files:** `app/admin/properties/page.tsx`, `app/admin/tenants/page.tsx`, `app/admin/leases/page.tsx`, `hooks/useEscapeKey.ts`

Pressing **Escape** now closes every modal and delete confirmation dialog. Implemented via a shared `useEscapeKey` custom hook (see Code Quality section). When a modal opens, focus automatically moves to the first input (add/edit modals) or the Cancel button (delete confirm dialogs).

---

### Accessibility — ARIA Attributes
**Files:** `app/admin/properties/page.tsx`, `app/admin/tenants/page.tsx`, `app/admin/leases/page.tsx`, `components/SiteHeader.tsx`, `app/admin/login/page.tsx`

- All modals have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the dialog title
- All error messages have `role="alert"` so screen readers announce them immediately
- Mobile menu button has `aria-expanded` reflecting open/closed state
- Edit and Delete table buttons have `aria-label` specifying which row they act on
- Amenity remove (`×`) buttons have `aria-label="Remove [amenity]"`
- Status filter select on the leases page has a visually-hidden `<label>`

---

### Accessibility — Semantic HTML
**Files:** `app/admin/properties/page.tsx`, `app/admin/tenants/page.tsx`, `app/admin/leases/page.tsx`, `app/admin/login/page.tsx`

- All `<th>` table headers have `scope="col"`
- All form `<label>` elements use `htmlFor` linked to the matching input's `id`, so clicking a label focuses the correct input and screen readers read the label when the field is focused

---

### Clarity — Button Labels
**Files:** `app/admin/properties/page.tsx`, `app/admin/tenants/page.tsx`, `app/admin/leases/page.tsx`

- Delete confirmation buttons changed from `"Delete"` to `"Delete Property"`, `"Delete Tenant"`, or `"Delete Lease"` so it is clear what is being deleted
- Amenity input placeholder updated to `"Type an amenity and press Enter or Add"` to surface the keyboard shortcut

---

### Code Quality — Removed Dead Code
**Files:** `components/ui/Button.tsx` (deleted)

Deleted `Button.tsx` — the component was never imported anywhere in the project and still referenced color names (`prBlue`, `gray`, dark mode) from a previous design system that no longer exists.

---

### Code Quality — Shared Currency Formatter
**Files:** `lib/format.ts` (new), `app/admin/page.tsx`, `app/properties/[id]/page.tsx`, `app/admin/properties/page.tsx`, `app/admin/leases/page.tsx`

`formatCurrency` was defined identically in four separate files. Extracted into `lib/format.ts` and replaced all four local copies with a single import.

---

### Code Quality — Shared Escape Key Hook
**Files:** `hooks/useEscapeKey.ts` (new), `app/admin/properties/page.tsx`, `app/admin/tenants/page.tsx`, `app/admin/leases/page.tsx`

The same `document.addEventListener('keydown', ...)` / `removeEventListener` pattern was copy-pasted into six places (one per modal component, one per delete dialog per page). Extracted into `hooks/useEscapeKey(callback, enabled?)` and replaced all six copies with a single-line call.
