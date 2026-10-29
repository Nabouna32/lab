"use client";

import { useState } from "react";
import { Button, ElevatedButton, FilledTonalButton, OutlinedButton, TextButton } from "@/components/ui/Button";
import { Card, ElevatedCard, OutlinedCard } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Chip } from "@/components/ui/Chip";
import { IconToggleButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { TextArea } from "@/components/ui/TextArea";
import { TextField } from "@/components/ui/TextField";
import styles from "./visual-lab.module.css";

type Locale = "fr" | "en";

export default function VisualLab({ initialLocale }: { initialLocale: Locale }) {
  const fr = initialLocale === "fr";
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [progress, setProgress] = useState(64);
  const [selectedChip, setSelectedChip] = useState(false);
  const [navigation, setNavigation] = useState("home");
  const [format, setFormat] = useState("webp");
  const [notice, setNotice] = useState("");
  const actionLabel = fr ? "Action testée" : "Action tested";

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Loculary · Material 3</p>
        <h1>{fr ? "Galerie de composants" : "Component gallery"}</h1>
        <p className={styles.intro}>
          {fr
            ? "Spécimens des composants réellement utilisés par le site. La galerie suit le thème actif ; elle ne constitue pas, à elle seule, une preuve de conformité AndroidX."
            : "Specimens of components actually used by the site. The gallery follows the active theme; it is not, by itself, proof of AndroidX conformance."}
        </p>
      </header>

      <section className={styles.section} aria-labelledby="actions-title">
        <div className={styles.sectionHeading}>
          <h2 id="actions-title">{fr ? "Actions" : "Actions"}</h2>
          <p>{fr ? "Variantes de bouton et états interactifs." : "Button variants and interactive states."}</p>
        </div>
        <div className={styles.specimens}>
          <div className={styles.specimen}>
            <h3>Button</h3>
            <div className={styles.row}>
              <Button type="button" onClick={() => setNotice(actionLabel)}>{fr ? "Rempli" : "Filled"}</Button>
              <ElevatedButton type="button" onClick={() => setNotice(actionLabel)}>{fr ? "Surélevé" : "Elevated"}</ElevatedButton>
              <FilledTonalButton type="button" onClick={() => setNotice(actionLabel)}>{fr ? "Tonal" : "Filled tonal"}</FilledTonalButton>
              <OutlinedButton type="button" onClick={() => setNotice(actionLabel)}>{fr ? "Contour" : "Outlined"}</OutlinedButton>
              <TextButton type="button" onClick={() => setNotice(actionLabel)}>{fr ? "Texte" : "Text"}</TextButton>
            </div>
            <div className={styles.row}>
              <IconToggleButton label={fr ? "Basculer le favori" : "Toggle favorite"} checked={favorite} onCheckedChange={setFavorite}>
                <MaterialIcon name="favorite" size={24} />
              </IconToggleButton>
              <Button type="button" disabled>{fr ? "Désactivé" : "Disabled"}</Button>
              <Button type="button" colors={{ containerColor: "var(--error)", contentColor: "var(--on-error)" }} onClick={() => setNotice(fr ? "Couleurs sémantiques d’erreur" : "Semantic error colors")}>
                {fr ? "Action d’erreur" : "Error action"}
              </Button>
            </div>
            {notice ? <p className={styles.notice} role="status">{notice}</p> : null}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="fields-title">
        <div className={styles.sectionHeading}>
          <h2 id="fields-title">{fr ? "Champs et sélection" : "Fields and selection"}</h2>
          <p>{fr ? "Contrôles natifs ou composants partagés avec leurs libellés." : "Native controls and shared components with persistent labels."}</p>
        </div>
        <div className={styles.specimens}>
          <div className={styles.specimen}>
            <h3>{fr ? "Saisie" : "Input"}</h3>
            <div className={styles.fieldGrid}>
              <TextField inputId="lab-name" label={fr ? "Nom" : "Name"} defaultValue="Loculary" />
              <Select id="lab-format" label={fr ? "Format" : "Format"} value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="jpeg">JPEG</option>
              </Select>
            </div>
            <TextArea inputId="lab-description" label={fr ? "Description" : "Description"} rows={3} defaultValue={fr ? "Exemple de texte multiligne." : "Multiline text example."} />
          </div>
          <div className={styles.specimen}>
            <h3>{fr ? "États" : "States"}</h3>
            <div className={styles.controlList}>
              <Checkbox inputId="lab-checkbox" checked={checked} onCheckedChange={setChecked} label={fr ? "Inclure les sous-catégories" : "Include subcategories"} />
              <Switch id="lab-switch" checked={enabled} onCheckedChange={setEnabled} label={fr ? "Activer l’option" : "Enable option"} />
              <Slider inputId="lab-progress" label={fr ? "Progression" : "Progress"} value={progress} min={0} max={100} valueLabel={`${progress}%`} onValueChange={setProgress} />
              <ProgressIndicator label={fr ? "Progression de démonstration" : "Demo progress"} value={progress} />
              <div className={styles.row}>
                <Chip variant="filter" label={fr ? "Filtre actif" : "Active filter"} selected={selectedChip} onSelectedChange={setSelectedChip} />
                <span className={styles.muted}>{fr ? "Format choisi :" : "Selected format:"} {format.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="surfaces-title">
        <div className={styles.sectionHeading}>
          <h2 id="surfaces-title">{fr ? "Surfaces" : "Surfaces"}</h2>
          <p>{fr ? "Variantes de carte partagées, sans maquettes de composants fictifs." : "Shared card variants, without mock components."}</p>
        </div>
        <div className={styles.surfaceGrid}>
          <Card className={styles.surfaceCard}>
            <h3>{fr ? "Carte remplie" : "Filled card"}</h3>
            <p>{fr ? "Surface tonale issue du thème actif." : "Tonal surface from the active theme."}</p>
          </Card>
          <ElevatedCard className={styles.surfaceCard}>
            <h3>{fr ? "Carte élevée" : "Elevated card"}</h3>
            <p>{fr ? "Élévation discrète et partagée." : "Shared, subtle elevation."}</p>
          </ElevatedCard>
          <OutlinedCard className={styles.surfaceCard}>
            <h3>{fr ? "Carte contourée" : "Outlined card"}</h3>
            <p>{fr ? "Contour sémantique sans ombre." : "Semantic outline without shadow."}</p>
          </OutlinedCard>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="navigation-title">
        <div className={styles.sectionHeading}>
          <h2 id="navigation-title">NavigationBar</h2>
          <p>{fr ? "Interaction locale pour inspecter l’état sélectionné." : "Local interaction for inspecting the selected state."}</p>
        </div>
        <NavigationBar
          label={fr ? "Destinations de démonstration" : "Demo destinations"}
          selectedKey={navigation}
          onSelect={setNavigation}
          items={[
            { key: "home", label: fr ? "Accueil" : "Home", icon: "home" },
            { key: "explore", label: fr ? "Explorer" : "Explore", icon: "search" },
            { key: "saved", label: fr ? "Favoris" : "Saved", icon: "favorite" },
            { key: "profile", label: fr ? "Profil" : "Profile", icon: "person" },
          ]}
        />
      </section>

      <p className={styles.footer}>
        {fr
          ? "Référence de travail : le code et les spécifications AndroidX versionnées dans Git. Les différences propres au Web doivent rester explicites."
          : "Working reference: AndroidX source and specifications versioned in Git. Web-specific differences must remain explicit."}
      </p>
    </main>
  );
}
