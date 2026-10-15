"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
  const [checked, setChecked] = useState(true);
  const [selected, setSelected] = useState(false);
  const [text, setText] = useState("Loculary");
  const [progress, setProgress] = useState(55);
  const [radio, setRadio] = useState("all");
  const [segment, setSegment] = useState("week");
  const [choice, setChoice] = useState("one");
  const [tab, setTab] = useState("overview");
  const [multiline, setMultiline] = useState("Loculary");
  const fr = locale === "fr";
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
