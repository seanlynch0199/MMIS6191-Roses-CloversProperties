# Polish Improvements

## Code Quality

### Removed Dead Code
- Deleted `components/ui/Button.tsx` — the component was never imported anywhere in the project and still referenced old color names (`prBlue`, `gray`, dark mode) from a previous design system

### Extracted Shared Utilities
- Created `lib/format.ts` with a single `formatCurrency` function — previously defined identically in four separate files (`admin/page.tsx`, `properties/[id]/page.tsx`, `admin/properties/page.tsx`, `admin/leases/page.tsx`)
- Created `hooks/useEscapeKey.ts` custom hook — previously the same `document.addEventListener('keydown', ...)` pattern was copy-pasted into six places across the three admin pages (once per modal, once per delete dialog). Now all six call `useEscapeKey(callback)` or `useEscapeKey(callback, enabled)`

### Consistency
- All three admin pages (properties, tenants, leases) now follow the identical import pattern for formatting and keyboard handling



## Accessibility

### Focus Visibility
- Added global `:focus-visible` CSS rule — a 2px green outline appears on all interactive elements (buttons, links, selects) when navigated by keyboard
- Previously, plain `<button>` elements in admin pages had no visible focus indicator

### Skip Navigation
- Added a "Skip to main content" link at the top of every page (`layout.tsx`)
- Hidden visually but appears when focused — lets keyboard users jump past the header nav directly to page content

### Keyboard Support for Modals
- Pressing **Escape** closes every modal (add/edit property, tenant, lease) and every delete confirmation dialog
- When a modal opens, focus automatically moves to the first input field (add/edit) or the Cancel button (delete confirm)

### ARIA Attributes
- All modals now declare `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` — screen readers announce the dialog name when it opens
- All error messages have `role="alert"` — screen readers announce errors immediately without the user navigating to them
- Mobile menu button has `aria-expanded` — screen readers announce whether the menu is open or closed
- Edit/Delete table buttons have `aria-label` identifying which row they act on (e.g. `"Delete 123 Main St"`)
- Amenity remove buttons (`×`) have `aria-label="Remove [amenity name]"` instead of being invisible to screen readers
- Status filter select (leases page) has a visually-hidden `<label>` for screen readers

### Semantic HTML
- All `<th>` table headers across properties, tenants, and leases pages have `scope="col"`
- All form `<label>` elements now use `htmlFor` linked to their input's `id` — clicking a label focuses the input, and screen readers announce the label when the field is focused

## Clarity

### Button Labels
- Delete confirmation buttons changed from generic `"Delete"` to specific `"Delete Property"`, `"Delete Tenant"`, `"Delete Lease"`
- Amenity input placeholder updated to explain the keyboard shortcut: `"Type an amenity and press Enter or Add"`
