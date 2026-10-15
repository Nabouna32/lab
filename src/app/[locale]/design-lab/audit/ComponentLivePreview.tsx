"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
  const fr = locale === "fr";
  const label = fr ? "Aperçu du composant réel" : "Live component preview";
  const stateHelp = fr
    ? "Teste directement le composant. Le survol, le focus clavier, l’appui et l’état désactivé utilisent son implémentation réelle."
    : "Interact with the actual component. Hover, keyboard focus, press and disabled states use its real implementation.";

  let content;
  switch (previewKey) {
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
