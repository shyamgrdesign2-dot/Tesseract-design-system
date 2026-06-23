# Recipe — Data Listing / Index Page

The canonical List/Index archetype (archetype A): app shell + page header + status tabs + toolbar (search / date / filter) + `DataTable` with rich cells, status badges, sortable columns, row actions, selection, pagination, and loading/empty states.

This is a **starting point** — adapt columns, filters, and statuses to the entity from `product-and-domain.md`. The example below is an **All Patients** list. Prop names here are real (verified against the component sources); for any extra prop, read the component's `.stories.jsx`.

---

```jsx
"use client";

import * as React from "react";
import {
  Button,
  Badge,
  InputBox,
  Avatar,
  TPIcon,
} from "@/src/components/atoms";
import {
  Header,
  Sidebar,
  DataTable,
  DataCell,
  Filter,
  Dropdown,
  Tabs,
  TabsList,
  TabsTrigger,
  DateRangePicker,
  ConfirmDialog,
  Toast,
} from "@/src/components/molecules";
import styles from "./PatientListPage.module.scss";

/* ── Primary module nav ── */
const NAV_ITEMS = [
  { id: "appointments", label: "Appointments", icon: "calendar-1" },
  { id: "rxpad", label: "RxPad", icon: "edit-2" },
  { id: "patients", label: "All Patients", icon: "profile-2user" },
  { id: "billing", label: "OPD Billing", icon: "receipt-text" },
  { id: "analytics", label: "Analytics", icon: "chart-2" },
];

/* ── Filter groups (rendered in the Filter panel; selections show as chips) ── */
const FILTER_GROUPS = [
  { id: "gender", label: "Gender", options: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ] },
  { id: "status", label: "Status", options: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ] },
];

/* ── Status → Badge tone (see product-and-domain.md) ── */
function StatusBadge({ status }) {
  const tone = status === "Active" ? "success"
    : status === "Inactive" ? "neutral"
    : "warning";
  return <Badge variant="soft" color={tone} size="sm">{status}</Badge>;
}

export function PatientListPage({ data = [], loading = false, hasMore = false, onLoadMore }) {
  const [tab, setTab] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [range, setRange] = React.useState(null);
  const [filters, setFilters] = React.useState({});
  const [selected, setSelected] = React.useState([]);
  const [toDelete, setToDelete] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  // Client-side filter; swap for a server query in production.
  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((r) =>
      !q || r.name.toLowerCase().includes(q) || r.mrn?.toLowerCase().includes(q) || r.contact?.includes(q)
    );
  }, [data, query]);

  const columns = [
    {
      id: "patient",
      header: "Patient",
      minWidth: 240,
      sortable: true,
      sortAccessor: (r) => r.name,
      cell: (r) => (
        <DataCell
          primary={r.name}
          secondary={`MRN ${r.mrn}`}
          primaryLeftIcon={<Avatar name={r.name} size={32} />}
        />
      ),
    },
    {
      id: "demographics",
      header: "Age / Gender",
      minWidth: 140,
      cell: (r) => <DataCell primary={`${r.age} yrs`} secondary={r.gender} />,
    },
    {
      id: "contact",
      header: "Contact",
      minWidth: 160,
      cell: (r) => r.contact,
    },
    {
      id: "lastVisit",
      header: "Last Visit",
      minWidth: 140,
      sortable: true,
      sortAccessor: (r) => r.lastVisitTs,
      cell: (r) => r.lastVisit,
    },
    {
      id: "status",
      header: "Status",
      minWidth: 120,
      sortable: true,
      sortAccessor: (r) => r.status,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      sticky: "right",
      align: "right",
      minWidth: 160,
      cell: (r) => (
        <div className={styles.rowActions}>
          <Button variant="ghost" theme="neutral" size="sm" icon={<TPIcon name="eye" size={16} />} ariaLabel="View details" onClick={() => openPatient(r)} />
          <Dropdown
            variant="seamless"
            chevron={false}
            options={[
              { value: "edit", label: "Edit", icon: <TPIcon name="edit-2" size={16} /> },
              { value: "upload", label: "Upload document", icon: <TPIcon name="document-upload" size={16} /> },
              { value: "certificate", label: "Create certificate", icon: <TPIcon name="clipboard-text" size={16} /> },
              { value: "delete", label: "Delete", icon: <TPIcon name="trash" size={16} /> },
            ]}
            onChange={(v) => onRowAction(v, r)}
          />
        </div>
      ),
    },
  ];

  function openPatient(r) { /* navigate to Detail/Profile page (archetype B) */ }
  function onRowAction(action, r) {
    if (action === "delete") setToDelete(r);
    // …handle edit / upload / certificate
  }
  function confirmDelete() {
    // …call delete API
    setToast({ status: "success", title: `${toDelete.name} deleted` });
    setToDelete(null);
  }

  return (
    <div className={styles.shell}>
      <Sidebar items={NAV_ITEMS} activeId="patients" onSelect={() => {}} collapsed />

      <div className={styles.main}>
        <Header
          title="All Patients"
          subtitle={`${rows.length} patients`}
          actions={[
            { type: "cta", label: "Import", variant: "outline", theme: "neutral", icon: <TPIcon name="import" size={16} />, onClick: () => {} },
            { type: "cta", label: "Add Patient", variant: "solid", theme: "primary", icon: <TPIcon name="add" size={16} />, onClick: () => {} },
          ]}
        />

        <div className={styles.content}>
          {/* Status tabs (optional) */}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all" tag={String(data.length)}>All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <InputBox
              size="md"
              leftIcon={<TPIcon name="search-normal-1" size={18} />}
              placeholder="Search name, MRN, or contact…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              clearable
              onClear={() => setQuery("")}
            />
            <DateRangePicker
              mode="range"
              showPresets
              value={range}
              onChange={setRange}
              label={null}
              placeholder="Registration date"
            />
            <Filter groups={FILTER_GROUPS} value={filters} onChange={setFilters} />
          </div>

          {/* Bulk action bar (appears when rows selected) */}
          {selected.length > 0 && (
            <div className={styles.bulkBar}>
              <span>{selected.length} selected</span>
              <Button variant="outline" theme="neutral" size="sm" leftIcon={<TPIcon name="message" size={16} />}>Message</Button>
              <Button variant="outline" theme="neutral" size="sm" leftIcon={<TPIcon name="export" size={16} />}>Export</Button>
            </div>
          )}

          {/* Table */}
          <DataTable
            columns={columns}
            data={rows}
            rowKey={(r) => r.id}
            rowHeight="lg"
            stickyHeader
            sortable
            hoverable
            selectable
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={setSelected}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            emptyState={
              <div className={styles.empty}>
                <TPIcon name="profile-2user" size={40} color="var(--tp-fg-tertiary)" />
                <p>No patients found</p>
                <Button variant="solid" theme="primary" size="sm" leftIcon={<TPIcon name="add" size={16} />}>Add Patient</Button>
              </div>
            }
          />
        </div>
      </div>

      {/* Destructive confirm */}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete patient?"
        description={toDelete ? `${toDelete.name} (MRN ${toDelete.mrn}) will be permanently removed.` : ""}
        calloutTone="error"
        primaryLabel="Keep"
        onPrimary={() => setToDelete(null)}
        secondaryLabel="Delete"
        secondaryTone="destructive"
        onSecondary={confirmDelete}
      />

      {toast && <Toast status={toast.status} title={toast.title} dismissible duration={3000} onDismiss={() => setToast(null)} />}
    </div>
  );
}

export default PatientListPage;
```

### Companion `PatientListPage.module.scss` (token-only, even dimensions)

```scss
.shell {
  display: flex;
  height: 100vh;
  background: var(--tp-bg-page);
  font-family: var(--tp-font-body);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--tp-space-4);
  padding: var(--tp-space-4) var(--tp-space-6);
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: var(--tp-space-3);

  > :first-child { flex: 1; min-width: 0; max-width: 360px; }
  margin-left: auto;
}

.bulkBar {
  display: flex;
  align-items: center;
  gap: var(--tp-space-3);
  padding: var(--tp-space-2) var(--tp-space-3);
  border-radius: var(--tp-radius-10);
  background: var(--tp-bg-brand-soft);
  font-size: var(--tp-text-body-sm);
  color: var(--tp-fg-secondary);
}

.rowActions {
  display: inline-flex;
  align-items: center;
  gap: var(--tp-space-1);
  justify-content: flex-end;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--tp-space-3);
  padding: var(--tp-space-10) var(--tp-space-4);
  color: var(--tp-fg-secondary);
}
```

---

## Adapting this recipe

- **Different entity** (appointments, invoices, labs): swap `columns`, `FILTER_GROUPS`, status tones, and the `Header` title/CTA. Keep the structure.
- **Server pagination**: drive `loading` / `hasMore` / `onLoadMore` from your data hook; replace the client-side `useMemo` filter with a query keyed on `query`/`range`/`filters`/`tab`.
- **No bulk actions**: drop `selectable`/`selectionMode` and the bulk bar.
- **No tabs**: remove the `Tabs` block (use it only when the entity has real status segments).
- **Content-only (no shell)**: render just `.content` (tabs + toolbar + DataTable) without `Sidebar`/`Header`.
- **Verify props**: if you need a prop not shown here (e.g. `groupBy`, `getSubRows`, `rowState`), confirm it in `src/components/molecules/DataTable/DataTable.stories.jsx`.
