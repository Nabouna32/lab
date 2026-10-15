/**
 * Canonical structured registry for the component-by-component M3 Fidelity audit.
 *
 * Important: inventory presence is not evidence of conformance. Entries begin
 * unverified; classification, source paths, references, usage and test evidence
 * must be established during the individual component discussion/audit.
 */
export type AuditStatus =
  | "unverified"
  | "partially-verified"
  | "discrepancy-confirmed"
  | "verification-required"
  | "conformant-within-verified-scope";

export type VerificationStatus =
  | "not-started"
  | "source-reviewed"
  | "automated-tests-run"
  | "browser-reviewed"
  | "accessibility-reviewed"
  | "device-reviewed";

export type ComponentAuditRecord = {
  id: string;
  name: string;
  category: string;
  status: AuditStatus;
  verification: VerificationStatus[];
  implementationType: "unclassified";
  sourceFiles: string[];
  officialReferences: { label: string; url: string }[];
  productionUsage: "unknown";
  observedFacts: string[];
  confirmedDiscrepancies: string[];
  unverifiedQuestions: string[];
  decisions: string[];
  history: { date: string; note: string; kind: "historical-lead" | "verified-evidence" | "decision" }[];
};

const catalog: { category: string; names: string[] }[] = [
  { category: "Actions", names: [
    "Button", "ElevatedButton", "FilledTonalButton", "OutlinedButton", "TextButton",
    "IconButton", "FilledIconButton", "FilledTonalIconButton", "OutlinedIconButton",
    "IconToggleButton", "FilledIconToggleButton", "FilledTonalIconToggleButton", "OutlinedIconToggleButton",
    "FloatingActionButton", "SplitButtonLayout", "FilledSplitButton", "TonalSplitButton",
    "ElevatedSplitButton", "OutlinedSplitButton", "ButtonGroup", "ButtonGroupScope",
    "ButtonGroupMenuState", "ToggleButton", "FilledTonalToggleButton", "OutlinedToggleButton",
    "ElevatedToggleButton", "SegmentedButton", "SingleChoiceSegmentedButtonRow", "MultiChoiceSegmentedButtonRow",
  ]},
  { category: "Text entry & selection", names: [
    "TextField", "OutlinedTextField", "SecureTextField", "OutlinedSecureTextField",
    "TextArea", "MaterialTextField", "Select", "ExposedDropdownMenu", "DropdownMenu",
    "DropdownMenuItem", "DropdownMenuGroup", "SelectableDropdownMenuItem", "CheckableDropdownMenuItem",
    "Checkbox", "TriStateCheckbox", "Switch", "RadioButton", "Slider", "RangeSlider",
    "SegmentedControl", "ClearButton", "CopyButton", "ValidationMessage", "Select (native HTML wrapper)",
    "TextArea (Web wrapper)", "TimeInput (native HTML input wrapper)",
  ]},
  { category: "Navigation & app structure", names: [
    "NavigationBar", "NavigationRail", "WideNavigationRail", "WideNavigationRailItem",
    "ModalWideNavigationRail", "NavigationDrawer", "DismissibleNavigationDrawer",
    "PermanentNavigationDrawer", "NavigationSuiteScaffold", "NavigationSuiteType", "TopAppBar",
    "BottomAppBar", "AppBarWithSearch", "Scaffold", "ListItem", "Tabs", "Tab",
    "PrimaryTabRow", "SecondaryTabRow", "PrimaryScrollableTabRow", "SecondaryScrollableTabRow",
  ]},
  { category: "Surfaces, feedback & overlays", names: [
    "Card", "Panel", "ResultPanel", "Divider", "HorizontalDivider", "VerticalDivider",
    "Badge", "BadgedBox", "Snackbar", "Tooltip", "AlertDialog", "ModalBottomSheet",
    "BottomSheetScaffold", "SwipeToDismissBox", "Carousel", "PullToRefreshBox",
    "FloatingToolbar", "HorizontalFloatingToolbar", "VerticalFloatingToolbar",
  ]},
  { category: "Progress & date/time", names: [
    "ProgressIndicator", "CircularProgressIndicator", "DatePicker", "DateRangePicker",
    "DatePickerDialog", "TimePicker", "TimePickerDialog", "ScrollField", "ScrollFieldState",
    "ScrollFieldDefaults",
  ]},
  { category: "Search & menus", names: [
    "SearchBar", "ExpandedDockedSearchBar", "ExpandedFullScreenSearchBar", "FloatingActionButtonMenu",
    "FloatingActionButtonMenuItem", "ToggleFloatingActionButton",
  ]},
  { category: "Chips & supporting controls", names: [
    "AssistChip", "FilterChip", "InputChip", "SuggestionChip", "Chip",
  ]},
];

function createUnverifiedRecord(name: string, category: string): ComponentAuditRecord {
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    category,
    status: "unverified",
    verification: ["not-started"],
    implementationType: "unclassified",
    sourceFiles: [],
    officialReferences: [],
    productionUsage: "unknown",
    observedFacts: [],
    confirmedDiscrepancies: [],
    unverifiedQuestions: [],
    decisions: [],
    history: [],
  };
}

export const m3ComponentAuditRegistry: ComponentAuditRecord[] = catalog.flatMap((group) =>
  group.names.map((name) => createUnverifiedRecord(name, group.category)),
);

export const auditStatusLabels: Record<AuditStatus, { fr: string; en: string }> = {
  "unverified": { fr: "Non vérifié", en: "Unverified" },
  "partially-verified": { fr: "Partiellement vérifié", en: "Partially verified" },
  "discrepancy-confirmed": { fr: "Écart confirmé", en: "Confirmed discrepancy" },
  "verification-required": { fr: "Vérification requise", en: "Verification required" },
  "conformant-within-verified-scope": { fr: "Conforme dans le périmètre vérifié", en: "Conformant within verified scope" },
};

/**
 * Historical leads from the previous Markdown audit. These are context only:
 * they must be rechecked during the relevant component discussion and are not
 * imported as current verified findings or compliance statuses.
 */
export const historicalAuditLeads = [
  {
    id: "button-pressed-shape",
    component: "Button",
    title: { fr: "Forme du bouton à l’appui", en: "Button pressed shape" },
    note: {
      fr: "L’ancien audit signale un morphing de forme au press dans Button.tsx et un test source qui l’impose. À revalider depuis le code et les références actuelles avant toute proposition de changement.",
      en: "The previous audit reported a pressed-shape morph in Button.tsx and a source test that requires it. Re-check current code and references before proposing any change.",
    },
    source: "docs/M3-CONFORMANCE-AUDIT.md",
    status: "historical-lead" as const,
  },
  {
    id: "theme-role-wiring",
    component: "Color and theme foundations",
    title: { fr: "Rôles de couleur et thèmes", en: "Color roles and themes" },
    note: {
      fr: "L’ancien audit observait la génération de rôles et le câblage clair/sombre au niveau source, sans preuve de parité visuelle dans le navigateur. Cela ne constitue pas une validation de conformité.",
      en: "The previous audit observed source-level role generation and light/dark wiring, without browser evidence of visual parity. This is not a conformance approval.",
    },
    source: "docs/M3-CONFORMANCE-AUDIT.md",
    status: "historical-lead" as const,
  },
] as const;
