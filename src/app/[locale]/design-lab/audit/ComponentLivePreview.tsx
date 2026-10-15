"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AppBarWithSearch } from "@/components/ui/AppBarWithSearch";
import { BottomSheetScaffold } from "@/components/ui/BottomSheetScaffold";
import { Carousel } from "@/components/ui/Carousel";
import { CopyButton } from "@/components/ui/CopyButton";
import { DatePickerDialog } from "@/components/ui/DatePickerDialog";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { ExposedDropdownMenu } from "@/components/ui/ExposedDropdownMenu";
import { FloatingActionButtonMenu } from "@/components/ui/FloatingActionButtonMenu";
import { FloatingToolbar } from "@/components/ui/FloatingToolbar";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { NavigationDrawer } from "@/components/ui/NavigationDrawer";
import { NavigationRail } from "@/components/ui/NavigationRail";
import { NavigationSuiteScaffold } from "@/components/ui/NavigationSuiteScaffold";
import { Scaffold } from "@/components/ui/Scaffold";
import { SegmentedButtonGroup } from "@/components/ui/SegmentedButtonGroup";
import { TimePicker } from "@/components/ui/TimePicker";
import { TimePickerDialog } from "@/components/ui/TimePickerDialog";
import { WideNavigationRail } from "@/components/ui/WideNavigationRail";
import { ToolRuntimeProvider } from "@/components/tools/ToolPage/ToolRuntimeProvider";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { BottomAppBar } from "@/components/ui/BottomAppBar";
import { ClearButton } from "@/components/ui/ClearButton";
import { DatePicker } from "@/components/ui/DatePicker";
import { ModalBottomSheet } from "@/components/ui/ModalBottomSheet";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { ScrollField } from "@/components/ui/ScrollField";
import { SearchBar } from "@/components/ui/SearchBar";
import { SplitButton } from "@/components/ui/SplitButton";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { ListItem } from "@/components/ui/ListItem";
import { MaterialTextField } from "@/components/ui/MaterialTextField";
import { Panel } from "@/components/ui/Panel";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { Snackbar } from "@/components/ui/Snackbar";
import { Tooltip } from "@/components/ui/Tooltip";
import { TriStateCheckbox } from "@/components/ui/TriStateCheckbox";
import { Badge } from "@/components/ui/Badge";
import { CircularProgressIndicator } from "@/components/ui/CircularProgressIndicator";
import { Divider } from "@/components/ui/Divider";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { RadioButton } from "@/components/ui/RadioButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Tabs } from "@/components/ui/Tabs";
import { TextArea } from "@/components/ui/TextArea";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { IconButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Switch } from "@/components/ui/Switch";
import { SwipeToDismissBox } from "@/components/ui/SwipeToDismissBox";
import { TextField } from "@/components/ui/TextField";
import { ToggleButton } from "@/components/ui/ToggleButton";

type Locale = "fr" | "en";

export default function ComponentLivePreview({
  previewKey,
  locale,
}: {
  previewKey: string | null;
  locale: Locale;
}) {
  const fr = locale === "fr";
  const [checked, setChecked] = useState(true);
  const [selected, setSelected] = useState(false);
  const [text, setText] = useState("Loculary");
  const [progress, setProgress] = useState(55);
  const [radio, setRadio] = useState("all");
  const [segment, setSegment] = useState("week");
  const [choice, setChoice] = useState("one");
  const [tab, setTab] = useState("overview");
  const [multiline, setMultiline] = useState("Loculary");
  const [triState, setTriState] = useState<"off" | "on" | "indeterminate">("indeterminate");
  const [groupSelected, setGroupSelected] = useState<string[]>(["work"]);
  const [fieldValue, setFieldValue] = useState("bonjour@loculary.com");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [range, setRange] = useState<[number, number]>([20, 80]);
  const [scrollIndex, setScrollIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [splitResult, setSplitResult] = useState(fr ? "Aucune action" : "No action");
  const [dismissed, setDismissed] = useState(false);
  const [appBarQuery, setAppBarQuery] = useState("");
  const [appBarSubmitted, setAppBarSubmitted] = useState("");
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({start:"2026-10-01",end:"2026-10-15"});
  const [menuLayout, setMenuLayout] = useState("grid");
  const [exposedFormat, setExposedFormat] = useState("png");
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const [toolbarExpanded, setToolbarExpanded] = useState(true);
  const [navigationSelection, setNavigationSelection] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSelection, setDrawerSelection] = useState("home");
  const [railSelection, setRailSelection] = useState("home");
  const [suiteSelection, setSuiteSelection] = useState("home");
  const [singleSegments, setSingleSegments] = useState<string[]>(["week"]);
  const [multiSegments, setMultiSegments] = useState<string[]>(["bold"]);
  const [timeValue, setTimeValue] = useState("09:30");
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [wideRailExpanded, setWideRailExpanded] = useState(true);
  const [wideRailSelected, setWideRailSelected] = useState("home");
  const label = fr ? "Aperçu du composant réel" : "Live component preview";
  const stateHelp = fr
    ? "Teste directement le composant. Le survol, le focus clavier, l’appui et l’état désactivé utilisent son implémentation réelle."
    : "Interact with the actual component. Hover, keyboard focus, press and disabled states use its real implementation.";

  let content;
  switch (previewKey) {
    case "badge":
      content = <div className="flex items-center gap-8"><span className="inline-flex items-center gap-3"><span>{fr ? "Notifications" : "Notifications"}</span><Badge content="3" accessibleLabel="3 notifications" /></span><span className="inline-flex items-center gap-3"><span>{fr ? "Indicateur discret" : "Small indicator"}</span><Badge /></span></div>;
      break;
    case "divider":
      content = <div className="grid gap-4"><p>{fr ? "Contenu au-dessus" : "Content above"}</p><Divider /><p>{fr ? "Contenu en dessous" : "Content below"}</p><div className="flex h-12 items-center gap-4"><span>{fr ? "Gauche" : "Left"}</span><Divider orientation="vertical" /><span>{fr ? "Droite" : "Right"}</span></div></div>;
      break;
    case "progress-indicator":
      content = <div className="grid gap-5"><ProgressIndicator label={fr ? "Progression déterminée" : "Determinate progress"} value={progress} /><ProgressIndicator label={fr ? "Progression indéterminée" : "Indeterminate progress"} /><Slider inputId="audit-progress-value" label={fr ? "Progression" : "Progress"} value={progress} min={0} max={100} step={5} valueLabel={progress + "%"} onValueChange={setProgress} /></div>;
      break;
    case "circular-progress-indicator":
      content = <div className="flex flex-wrap items-center gap-6"><CircularProgressIndicator label={fr ? "Progression déterminée" : "Determinate progress"} value={progress} size={48} /><CircularProgressIndicator label={fr ? "Progression indéterminée" : "Indeterminate progress"} size={48} /><div className="min-w-48 flex-1"><Slider inputId="audit-circular-progress-value" label={fr ? "Progression" : "Progress"} value={progress} min={0} max={100} step={5} valueLabel={progress + "%"} onValueChange={setProgress} /></div></div>;
      break;
    case "radio-button":
      content = <fieldset className="grid gap-2"><legend>{fr ? "Choisis une option" : "Choose an option"}</legend><RadioButton name="audit-radio" value="all" label={fr ? "Toutes les options" : "All options"} checked={radio === "all"} onChange={setRadio} /><RadioButton name="audit-radio" value="selected" label={fr ? "Sélectionnées" : "Selected only"} checked={radio === "selected"} onChange={setRadio} /><RadioButton name="audit-radio-disabled" value="disabled" label={fr ? "Désactivée" : "Disabled"} checked={false} disabled onChange={() => undefined} /></fieldset>;
      break;
    case "slider":
      content = <div className="grid gap-5"><Slider inputId="audit-slider" label={fr ? "Valeur ajustable" : "Adjustable value"} value={progress} min={0} max={100} step={5} valueLabel={progress + "%"} onValueChange={setProgress} /><Slider inputId="audit-slider-disabled" label={fr ? "Désactivé" : "Disabled"} value={40} min={0} max={100} disabled onValueChange={() => undefined} /></div>;
      break;
    case "segmented-control":
      content = <div className="grid gap-4"><SegmentedControl ariaLabel={fr ? "Période" : "Period"} value={segment} onChange={setSegment} items={[{id:"day",label:fr?"Jour":"Day"},{id:"week",label:fr?"Semaine":"Week"},{id:"month",label:fr?"Mois":"Month"}]} /><p className="text-sm text-[var(--muted)]">{fr ? "Sélection actuelle : " : "Current selection: "}{segment}</p></div>;
      break;
    case "select":
      content = <div className="grid gap-4 sm:grid-cols-2"><Select id="audit-select" label="Format" value={choice} onChange={event=>setChoice(event.target.value)}><option value="one">PNG</option><option value="two">JPEG</option><option value="three">WebP</option></Select><Select id="audit-select-disabled" label={fr ? "Champ désactivé" : "Disabled field"} value="one" disabled onChange={() => undefined}><option value="one">PNG</option></Select></div>;
      break;
    case "text-area":
      content = <div className="grid gap-4 sm:grid-cols-2"><TextArea label={fr ? "Description" : "Description"} inputId="audit-text-area" value={multiline} onChange={event=>setMultiline(event.target.value)} helperText={fr ? "Champ multiligne réel." : "Actual multiline field."} /><TextArea label={fr ? "Champ désactivé" : "Disabled field"} inputId="audit-text-area-disabled" value={fr ? "Non modifiable" : "Not editable"} disabled onChange={() => undefined} /></div>;
      break;
    case "tabs":
      content = <div className="grid gap-4"><Tabs ariaLabel={fr ? "Exemple d’onglets" : "Tab example"} selectedKey={tab} onSelect={setTab} items={[{key:"overview",label:fr?"Aperçu":"Overview"},{key:"details",label:fr?"Détails":"Details"},{key:"disabled",label:fr?"Indisponible":"Unavailable",enabled:false}]} /><p className="text-sm text-[var(--muted)]">{fr ? "Onglet actif : " : "Selected tab: "}{tab}</p></div>;
      break;
    case "floating-action-button":
      content = <div className="flex flex-wrap items-center gap-5"><FloatingActionButton ariaLabel={fr ? "Ajouter" : "Add"} icon="add" /><FloatingActionButton size="small" ariaLabel={fr ? "Ajouter petit" : "Small add"} icon="add" /><FloatingActionButton size="extended" label={fr ? "Créer" : "Create"} icon="add" /></div>;
      break;
    case "tri-state-checkbox":
      content = <div className="grid gap-3"><TriStateCheckbox inputId="audit-tristate" label={fr ? "Sélection partielle" : "Partial selection"} state={triState} onStateChange={setTriState} /><TriStateCheckbox inputId="audit-tristate-disabled" label={fr ? "État désactivé" : "Disabled state"} state="indeterminate" disabled onStateChange={() => undefined} /></div>;
      break;
    case "panel":
      content = <Panel><h4 className="font-semibold">{fr ? "Panneau réel" : "Real panel"}</h4><p className="mt-2 text-sm text-[var(--muted)]">{fr ? "Surface partagée utilisée dans Loculary." : "Shared surface used in Loculary."}</p></Panel>;
      break;
    case "result-panel":
      content = <div className="grid gap-3 sm:grid-cols-2"><ResultPanel label={fr ? "Résultat calculé" : "Calculated result"} value="42,5 %" tone="accent" /><ResultPanel label={fr ? "Résultat vide" : "Empty result"} value={null} emptyMessage={fr ? "Aucun résultat pour le moment." : "No result yet."} /></div>;
      break;
    case "list-item":
      content = <div className="grid gap-2"><ListItem headline={fr ? "Convertir une image" : "Convert an image"} supporting={fr ? "PNG, JPEG et WebP" : "PNG, JPEG and WebP"} leading={<MaterialIcon name="image" size={24} />} trailing={<MaterialIcon name="arrow_outward" size={20} />} /><ListItem headline={fr ? "Élément désactivé" : "Disabled item"} supporting={fr ? "Exemple à deux lignes" : "Two-line example"} leading={<MaterialIcon name="info" size={24} />} aria-disabled="true" /></div>;
      break;
    case "button-group":
      content = <div className="grid gap-3"><ButtonGroup label={fr ? "Outils" : "Tools"} items={[{key:"work",label:fr?"Travail":"Work"},{key:"personal",label:fr?"Personnel":"Personal"},{key:"archive",label:fr?"Archive":"Archive"},{key:"disabled",label:fr?"Indisponible":"Unavailable",disabled:true}]} selectedKeys={groupSelected} onSelectionChange={setGroupSelected} mode="single" overflowLabel={fr ? "Plus" : "More"} /><p className="text-sm text-[var(--muted)]">{fr ? "Sélection : " : "Selected: "}{groupSelected.join(", ")}</p></div>;
      break;
    case "material-text-field":
      content = <div className="grid gap-4 sm:grid-cols-2"><MaterialTextField id="audit-material-text-field" label={fr ? "Adresse e-mail" : "Email address"} value={fieldValue} onChange={setFieldValue} supportingText={fr ? "Champ partagé de Loculary" : "Shared Loculary field"} /><MaterialTextField id="audit-material-text-field-disabled" label={fr ? "Champ désactivé" : "Disabled field"} value="Non modifiable" onChange={() => undefined} disabled /></div>;
      break;
    case "tooltip":
      content = <div className="flex flex-wrap items-center gap-4"><Tooltip content={fr ? "Information complémentaire" : "Additional information"}><Button variant="outlined">{fr ? "Survole ou focalise" : "Hover or focus"}</Button></Tooltip><Tooltip variant="rich" title={fr ? "Astuce" : "Tip"} content={fr ? "Le contenu apparaît au survol ou au focus clavier." : "Content appears on hover or keyboard focus."}><Button variant="text">{fr ? "Info détaillée" : "Rich tooltip"}</Button></Tooltip></div>;
      break;
    case "snackbar":
      content = <div className="grid gap-3"><Button variant="outlined" onClick={() => setSnackbarOpen(true)}>{fr ? "Afficher le message" : "Show message"}</Button><Snackbar open={snackbarOpen} message={fr ? "Modifications enregistrées" : "Changes saved"} actionLabel={fr ? "Annuler" : "Undo"} onAction={() => setSnackbarOpen(false)} dismissLabel={fr ? "Fermer" : "Dismiss"} onDismiss={() => setSnackbarOpen(false)} durationMs={0} /></div>;
      break;
    case "alert-dialog":
      content = <div className="grid gap-3"><Button variant="outlined" onClick={() => setDialogOpen(true)}>{fr ? "Ouvrir la boîte de dialogue" : "Open alert dialog"}</Button><AlertDialog open={dialogOpen} title={fr ? "Confirmer l’action ?" : "Confirm action?"} description={fr ? "Ceci est un exemple interactif du composant réel." : "This is an interactive sample of the real component."} confirmLabel={fr ? "Confirmer" : "Confirm"} dismissLabel={fr ? "Annuler" : "Cancel"} onConfirm={() => setDialogOpen(false)} onDismiss={() => setDialogOpen(false)} /></div>;
      break;
    case "modal-bottom-sheet":
      content = <div className="grid gap-3"><Button variant="outlined" onClick={() => setSheetOpen(true)}>{fr ? "Ouvrir la feuille" : "Open bottom sheet"}</Button><ModalBottomSheet open={sheetOpen} title={fr ? "Actions disponibles" : "Available actions"} description={fr ? "Exemple de feuille modale." : "Modal sheet example."} dismissLabel={fr ? "Fermer" : "Dismiss"} onDismiss={() => setSheetOpen(false)}><p className="py-4 text-sm">{fr ? "Contenu de la feuille modale." : "Modal sheet content."}</p><Button onClick={() => setSheetOpen(false)}>{fr ? "Terminé" : "Done"}</Button></ModalBottomSheet></div>;
      break;
    case "top-app-bar":
      content = <div className="grid gap-4"><TopAppBar title={fr ? "Titre de la page" : "Page title"} variant="small" navigationIcon="arrow_back" navigationLabel={fr ? "Retour" : "Back"} onNavigationClick={() => undefined} actions={<IconButton label={fr ? "Rechercher" : "Search"}><MaterialIcon name="search" size={24} /></IconButton>} /><TopAppBar title={fr ? "Grand titre" : "Large title"} variant="large" collapsed={false} navigationLabel={fr ? "Menu" : "Menu"} onNavigationClick={() => undefined} /></div>;
      break;
    case "bottom-app-bar":
      content = <BottomAppBar actions={<div className="flex gap-2"><IconButton label={fr ? "Rechercher" : "Search"}><MaterialIcon name="search" size={24} /></IconButton><IconButton label={fr ? "Favoris" : "Favorites"}><MaterialIcon name="favorite" size={24} /></IconButton></div>} floatingActionButton={<FloatingActionButton ariaLabel={fr ? "Ajouter" : "Add"} icon="add" />} />;
      break;
    case "clear-button":
      content = <div className="grid gap-3"><TextField label={fr ? "Texte de test" : "Sample text"} inputId="audit-clear-text" value={text} onChange={event => setText(event.target.value)} /><ClearButton onClear={() => setText("")} disabled={!text} label={fr ? "Effacer le champ" : "Clear field"} /></div>;
      break;
    case "validation-message":
      content = <div className="grid gap-4"><TextField label={fr ? "Adresse e-mail" : "Email address"} inputId="audit-validation-email" value="adresse-invalide" onChange={() => undefined} /><ValidationMessage id="audit-validation-message">{fr ? "Saisis une adresse e-mail valide." : "Enter a valid email address."}</ValidationMessage></div>;
      break;
    case "range-slider":
      content = <div className="grid gap-4"><RangeSlider inputId="audit-range" label={fr ? "Plage de valeurs" : "Value range"} value={range} min={0} max={100} step={5} onValueChange={setRange} /><p className="text-sm text-[var(--muted)]">{range[0]} – {range[1]}</p><RangeSlider inputId="audit-range-disabled" label={fr ? "Plage désactivée" : "Disabled range"} value={[20, 60]} min={0} max={100} disabled onValueChange={() => undefined} /></div>;
      break;
    case "scroll-field":
      content = <div className="grid gap-3"><ScrollField label={fr ? "Jour" : "Day"} options={fr ? ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]} selectedIndex={scrollIndex} onSelectedIndexChange={setScrollIndex} /><p className="text-sm text-[var(--muted)]">{fr ? "Sélection : " : "Selected: "}{scrollIndex + 1}</p></div>;
      break;
    case "search-bar":
      content = <div className="grid gap-3"><SearchBar label={fr ? "Rechercher un outil" : "Search tools"} query={searchQuery} onQueryChange={setSearchQuery} onSearch={setSearchSubmitted} suggestions={fr ? ["Calculatrice de pourcentage", "Convertisseur d’image", "Nettoyeur de texte"] : ["Percentage calculator", "Image converter", "Text cleaner"]} placeholder={fr ? "Rechercher…" : "Search…"} locale={locale} /><p className="text-sm text-[var(--muted)]">{fr ? "Dernière recherche : " : "Last search: "}{searchSubmitted || "—"}</p></div>;
      break;
    case "split-button":
      content = <div className="grid gap-3"><SplitButton label={fr ? "Créer un élément" : "Create item"} menuLabel={fr ? "Autres options" : "More options"} onClick={() => setSplitResult(fr ? "Action principale" : "Primary action")} items={[{label:fr?"Créer une copie":"Create a copy",onSelect:()=>setSplitResult(fr?"Copie créée":"Copy created")},{label:fr?"Archiver":"Archive",onSelect:()=>setSplitResult(fr?"Élément archivé":"Item archived")},{label:fr?"Action indisponible":"Disabled action",onSelect:()=>setSplitResult("—"),disabled:true}]} /><p className="text-sm text-[var(--muted)]">{fr ? "Dernière action : " : "Last action: "}{splitResult}</p></div>;
      break;
    case "date-picker":
      content = <div className="grid gap-4 sm:grid-cols-2"><DatePicker label={fr ? "Date" : "Date"} value={dateValue} onChange={setDateValue} displayMode="input" locale={locale} /><DatePicker label={fr ? "Date désactivée" : "Disabled date"} value="2026-10-15" displayMode="input" locale={locale} /></div>;
      break;
    case "swipe-to-dismiss-box":
      content = <div className="grid gap-3"><p className="text-sm text-[var(--muted)]">{fr ? "Fais glisser l’élément horizontalement pour le retirer." : "Swipe the item horizontally to dismiss it."}</p>{dismissed ? <Button variant="outlined" onClick={() => setDismissed(false)}>{fr ? "Réinitialiser l’exemple" : "Reset example"}</Button> : <SwipeToDismissBox dismissLabel={fr ? "Retirer" : "Dismiss"} onDismiss={() => setDismissed(true)}><Panel><p className="font-medium">{fr ? "Élément à retirer" : "Dismissible item"}</p><p className="mt-1 text-sm text-[var(--muted)]">{fr ? "Composant réel de Loculary" : "Actual Loculary component"}</p></Panel></SwipeToDismissBox>}</div>;
      break;
    case "app-bar-with-search":
      content = <div className="grid gap-3"><AppBarWithSearch title="Loculary" searchLabel={fr ? "Rechercher" : "Search"} placeholder={fr ? "Rechercher un outil" : "Search tools"} query={appBarQuery} onQueryChange={setAppBarQuery} onSearch={setAppBarSubmitted} suggestions={fr ? ["Outils récents","Convertisseur d’images","Calculatrice"] : ["Recent tools","Image converter","Calculator"]} navigationLabel={fr ? "Ouvrir la navigation" : "Open navigation"} locale={locale}/><p className="text-sm text-[var(--muted)]">{fr ? "Recherche envoyée : " : "Submitted search: "}{appBarSubmitted || "—"}</p></div>;
      break;
    case "carousel":
      content = <Carousel label={fr ? "Parcourir les catégories" : "Browse categories"} layout="uncontained" itemWidth={190} items={[{id:"image",label:fr?"Images":"Images",content:<Card variant="outlined" className="grid gap-2 p-4"><MaterialIcon name="image" size={28}/><strong>{fr?"Outils image":"Image tools"}</strong><span className="text-sm text-[var(--muted)]">12 {fr?"outils":"tools"}</span></Card>},{id:"text",label:fr?"Texte":"Text",content:<Card variant="outlined" className="grid gap-2 p-4"><MaterialIcon name="text_fields" size={28}/><strong>{fr?"Outils texte":"Text tools"}</strong><span className="text-sm text-[var(--muted)]">8 {fr?"outils":"tools"}</span></Card>},{id:"calculate",label:fr?"Calcul":"Calculate",content:<Card variant="outlined" className="grid gap-2 p-4"><MaterialIcon name="calculate" size={28}/><strong>{fr?"Calculatrices":"Calculators"}</strong></Card>}]} />;
      break;
    case "bottom-sheet-scaffold":
      content = <div className="max-w-xl"><BottomSheetScaffold title={fr ? "Détails de l’élément" : "Item details"} expanded={bottomSheetExpanded} onExpandedChange={setBottomSheetExpanded} collapsedLabel={fr ? "Développer les détails" : "Expand details"} expandedLabel={fr ? "Réduire les détails" : "Collapse details"} content={<><strong>{fr ? "Contenu principal" : "Main content"}</strong><p>{fr ? "La feuille est ancrée en bas de ce conteneur." : "The sheet is anchored to the bottom of this container."}</p></>} sheetContent={<p>{fr ? "Informations complémentaires et actions liées à l’élément." : "Additional information and related actions."}</p>} /></div>;
      break;
    case "copy-button":
      content = <ToolRuntimeProvider access="anonymous" capabilities={["clipboard"]}><CopyButton value={text} label={fr ? "Copier le texte" : "Copy text"} copiedLabel={fr ? "Texte copié" : "Text copied"}/></ToolRuntimeProvider>;
      break;
    case "date-picker-dialog":
      content = <div className="grid gap-3"><Button variant="outlined" onClick={() => setDateDialogOpen(true)}>{fr ? "Ouvrir le calendrier modal" : "Open modal date picker"}</Button><p className="text-sm text-[var(--muted)]">{fr ? "Date actuelle : " : "Current date: "}{dateValue || "—"}</p><DatePickerDialog open={dateDialogOpen} title={fr ? "Choisir une date" : "Choose a date"} label={fr ? "Date de démonstration" : "Demo date"} value={dateValue} rangeValue={dateRange} confirmLabel={fr ? "Confirmer" : "Confirm"} cancelLabel={fr ? "Annuler" : "Cancel"} locale={locale} onConfirm={selection=>{if(selection.mode==="single")setDateValue(selection.value);else setDateRange(selection.value);setDateDialogOpen(false);}} onDismiss={() => setDateDialogOpen(false)} /></div>;
      break;
    case "dropdown-menu":
      content = <div className="grid gap-3"><DropdownMenu label={fr ? "Options du composant" : "Component options"} triggerLabel={fr ? "Ouvrir les options" : "Open options"} triggerContent={<><MaterialIcon name="apps" size={18}/>{fr ? "Options" : "Options"}</>} items={[{key:"layout-grid",label:fr?"Disposition grille":"Grid layout",group:fr?"Disposition":"Layout",selectionMode:"single",selected:menuLayout==="grid",leadingIcon:<MaterialIcon name="apps" size={18}/>,onSelect:()=>setMenuLayout("grid")},{key:"layout-list",label:fr?"Disposition liste":"List layout",group:fr?"Disposition":"Layout",selectionMode:"single",selected:menuLayout==="list",leadingIcon:<MaterialIcon name="view_list" size={18}/>,onSelect:()=>setMenuLayout("list")},{key:"disabled",label:fr?"Action indisponible":"Unavailable action",disabled:true,onSelect:()=>undefined}]} /><p className="text-sm text-[var(--muted)]">{fr ? "Disposition : " : "Layout: "}{menuLayout}</p></div>;
      break;
    case "exposed-dropdown-menu":
      content = <div className="grid gap-3 sm:grid-cols-2"><ExposedDropdownMenu id="audit-exposed-dropdown" label={fr ? "Format" : "Format"} value={exposedFormat} onChange={setExposedFormat} options={[{value:"png",label:"PNG"},{value:"webp",label:"WebP"},{value:"jpeg",label:"JPEG"}]} /><ExposedDropdownMenu id="audit-exposed-dropdown-disabled" label={fr ? "Champ désactivé" : "Disabled field"} value="png" disabled options={[{value:"png",label:"PNG"},{value:"webp",label:"WebP"}]} onChange={() => undefined}/></div>;
      break;
    case "button":
      content = (
        <div className="flex flex-wrap items-center gap-3">
          <Button>Filled</Button>
          <Button variant="elevated">Elevated</Button>
          <Button variant="filled-tonal">Filled tonal</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button disabled>Disabled</Button>
        </div>
      );
      break;
    case "checkbox":
      content = (
        <div className="grid gap-2 sm:grid-cols-2">
          <Checkbox inputId="audit-checkbox-enabled" label={fr ? "Option activée" : "Enabled option"} checked={checked} onCheckedChange={setChecked} />
          <Checkbox inputId="audit-checkbox-disabled" label={fr ? "Option désactivée" : "Disabled option"} checked disabled onCheckedChange={() => undefined} />
          <Checkbox inputId="audit-checkbox-unchecked" label={fr ? "Option non cochée" : "Unchecked option"} checked={false} onCheckedChange={() => undefined} />
          <Checkbox inputId="audit-checkbox-indeterminate" label={fr ? "État indéterminé" : "Indeterminate state"} checked={false} indeterminate onCheckedChange={() => undefined} />
        </div>
      );
      break;
    case "switch":
      content = (
        <div className="grid gap-4 sm:grid-cols-2">
          <Switch id="audit-switch-on" label={fr ? "Activer la fonctionnalité" : "Enable feature"} checked={checked} onCheckedChange={setChecked} />
          <Switch id="audit-switch-disabled" label={fr ? "Fonctionnalité désactivée" : "Disabled feature"} checked disabled onCheckedChange={() => undefined} />
        </div>
      );
      break;
    case "text-field":
      content = (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={fr ? "Nom" : "Name"} inputId="audit-text-field" value={text} onChange={(event) => setText(event.target.value)} placeholder={fr ? "Saisir un texte" : "Enter text"} />
          <TextField label={fr ? "Champ désactivé" : "Disabled field"} inputId="audit-text-field-disabled" value={fr ? "Non modifiable" : "Not editable"} disabled onChange={() => undefined} />
        </div>
      );
      break;
    case "chip":
      content = (
        <div className="flex flex-wrap items-center gap-3">
          <Chip label="Assist" variant="assist" />
          <Chip label="Filter" variant="filter" selected={selected} onSelectedChange={setSelected} />
          <Chip label="Suggestion" variant="suggestion" />
          <Chip label="Elevated" variant="elevated-assist" />
        </div>
      );
      break;
    case "toggle-button":
      content = (
        <div className="flex flex-wrap items-center gap-3">
          <ToggleButton label={fr ? "Sélectionnable" : "Toggle option"} checked={selected} onCheckedChange={setSelected} icon={<MaterialIcon name="check" size={18} />} />
          <ToggleButton label={fr ? "Désactivé" : "Disabled"} checked={false} disabled onCheckedChange={() => undefined} />
        </div>
      );
      break;
    case "icon-button":
      content = (
        <div className="flex flex-wrap items-center gap-3">
          <IconButton label={fr ? "Action standard" : "Standard action"}><MaterialIcon name="favorite" size={24} /></IconButton>
          <IconButton label={fr ? "Action remplie" : "Filled action"} variant="filled"><MaterialIcon name="add" size={24} /></IconButton>
          <IconButton label={fr ? "Action tonale" : "Tonal action"} variant="filled-tonal"><MaterialIcon name="check" size={24} /></IconButton>
          <IconButton label={fr ? "Action désactivée" : "Disabled action"} disabled><MaterialIcon name="info" size={24} /></IconButton>
        </div>
      );
      break;
    case "card":
      content = (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card variant="elevated" className="p-4"><p className="font-medium">Elevated</p><p className="mt-1 text-sm text-[var(--muted)]">{fr ? "Surface avec élévation" : "Elevated surface"}</p></Card>
          <Card variant="filled" className="p-4"><p className="font-medium">Filled</p><p className="mt-1 text-sm text-[var(--muted)]">{fr ? "Surface remplie" : "Filled surface"}</p></Card>
          <Card variant="outlined" className="p-4"><p className="font-medium">Outlined</p><p className="mt-1 text-sm text-[var(--muted)]">{fr ? "Surface avec contour" : "Outlined surface"}</p></Card>
        </div>
      );
      break;
    default:
      content = null;
  }

  if (!content) {
    return (
      <section className="mt-5 rounded-2xl border border-[var(--border)] p-4" aria-label={label}>
        <h3 className="font-semibold">{fr ? "Aperçu réel non raccordé" : "Live preview not connected yet"}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {fr
            ? "L’implémentation existe dans le dépôt, mais ce composant n’est pas encore raccordé au banc d’essai. Aucun faux composant n’est affiché. Tu peux consulter le code source et signaler un problème."
            : "The implementation exists in the repository, but this component is not wired into the workbench yet. No substitute component is shown. You can inspect its source and report an issue."}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-2xl border border-[var(--border)] p-4" aria-label={label}>
      <h3 className="font-semibold">{label}</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{stateHelp}</p>
      <div className="mt-4 rounded-xl bg-[var(--surface)] p-4">{content}</div>
    </section>
  );
}
