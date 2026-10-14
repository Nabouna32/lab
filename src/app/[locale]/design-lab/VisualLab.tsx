"use client";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./visual-lab.module.css";
import { MaterialIcon, type MaterialIconName } from "@/components/ui/MaterialIcon";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Card } from "@/components/ui/Card";
import { Panel } from "@/components/ui/Panel";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { Checkbox } from "@/components/ui/Checkbox";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { colorHex, createM3Scheme, seedPresets } from "./m3-theme";

type Locale = "en" | "fr";
type Theme = "light" | "dark";
type Screen = "home" | "explore" | "tool" | "saved" | "profile";
type DesignDirection = "pixel" | "utility";
type LabIconName = "home" | "search" | "heart" | "user" | "calculator" | "image" | "text" | "arrow-up-right" | "plus" | "bell" | "sun" | "sparkles" | "back" | "check" | "close";
const labIconNames: Record<LabIconName, MaterialIconName> = {
  home: "home",
  search: "search",
  heart: "favorite",
  user: "person",
  calculator: "calculate",
  image: "image",
  text: "text_fields",
  "arrow-up-right": "arrow_outward",
  plus: "add",
  bell: "notifications",
  sun: "light_mode",
  sparkles: "stars",
  back: "arrow_back",
  check: "check",
  close: "close",
};
function LabIcon({ name, size = 20 }: { name: LabIconName; size?: number }) {
  return <MaterialIcon name={labIconNames[name]} size={size} />;
}
const copy = {
  en: {
    eyebrow:"Experimental playground · not production",title:"Find Loculary’s visual personality.",intro:"Compare the same phone interface in two Android-inspired directions. Change only the options that help judge the experience.",categoryColors:"Category identity colors",categoryColorsHelp:"Category colors stay independent from the brand color. The official MCU Rainbow scheme generates their hues and tonal values; the solid option uses generated foreground colors for readability.",
    directions:"Android style directions",directionsHelp:"Compare the same phone interface in two directions. These are exploratory interpretations, not official Google screenshots.",pixelDirection:"Pixel / faithful M3",pixelDirectionHelp:"Quiet tonal surfaces, familiar Android navigation and restrained emphasis.",expressiveDirection:"Expressive",expressiveDirectionHelp:"Bolder hierarchy, playful shape contrast and a more noticeable primary action.",utilityDirection:"Productivity",utilityDirectionHelp:"Compact, information-first layout with clear grouping and efficient scanning.",directionEyebrow:"Direction preview",directionAction:"Open tool",directionRecent:"Continue where you left off",directionBrowse:"Browse categories",directionBottomHome:"Home",directionBottomExplore:"Explore",directionBottomSaved:"Saved",directionBottomProfile:"Profile",theme:"Theme",style:"Visual language",viewport:"Preview width",categorySet:"Category color set",currentSet:"Current seeds",mcuRainbowSet:"Official M3 Rainbow",blueSet:"Blue-forward",categoryStyle:"Category treatment",softStyle:"Soft tint",stripeStyle:"Strong stripe",solidStyle:"Solid color",language:"Preview language",light:"Light",dark:"Dark",classic:"Material 3",expressive:"M3 Expressive",desktop:"Desktop",tablet:"Tablet",mobile:"Mobile",
    home:"Home",explore:"Explore",tool:"Tool page",search:"What do you need to do?",searchButton:"Find a tool",quick:"Popular tasks",welcome:"A toolbox for your next idea",subhead:"Small tasks, useful tools, less friction.",browse:"Explore tools",
    results:"Suggested tools",resultOne:"Percentage calculator",resultTwo:"Image converter",resultThree:"Text cleaner",toolTitle:"Percentage calculator",toolDesc:"Calculate a percentage of any value.",value:"Value",percent:"Percentage",calculate:"Calculate",output:"Your result",
    components:"Component gallery",settings:"Account & preferences",settingsHelp:"Examples of options a user can turn on or off.",syncFavorites:"Sync favorites",syncFavoritesHelp:"Keep your favorites available on your account.",automaticTheme:"Use device theme",automaticThemeHelp:"Follow your phone or computer light/dark setting.",reducedMotion:"Reduce motion",reducedMotionHelp:"Limit non-essential animations.",switchOnLabel:"On",switchOffLabel:"Off",actions:"Actions & controls",forms:"Forms & selection",surfaces:"Surfaces & feedback",type:"Typography & shape",states:"Interaction states",filled:"Filled",elevated:"Elevated",tonal:"Filled tonal",outlined:"Outlined",textButton:"Text",disabled:"Disabled",focus:"Keyboard focus",motion:"Replay motion",
    email:"Email address",choose:"Choose a category",selected:"Selected",chip:"Image tools",filter:"Filters",tabA:"Overview",tabB:"Details",cardTitle:"A useful result",cardText:"Keep the task clear and the next step obvious.",
    dialogTitle:"Ready to continue?",dialogText:"This is a sample dialog preview, not a real confirmation.",close:"Not now",confirm:"Continue",success:"Everything looks good",warning:"Check this value",error:"Enter a valid email address",
    composition:"Real-world compositions",compositionHelp:"Illustrative layouts using the selected tokens, not screenshots of the current production UI.",contrast:"Contrast review",contrastHelp:"Review computed role pairs before adopting a palette.",wcag:"Material contrast is informative, not a full WCAG audit.",seed:"Source color",sourceColor:"Source color (hex)",sourceColorHelp:"Choose any color or start from a reference preset. Generated roles come from the official Material Color Utilities engine.",invalidSeed:"Enter a valid 3- or 6-digit hex color.",seedPresets:"Reference presets",variant:"Dynamic scheme variant",variantHelp:"Official Material Color Utilities variant; category mapping remains a Loculary-specific choice.",specVersion:"Material spec version",platform:"Target platform",phone:"Phone",watch:"Watch",platform2021:"Platform only affects the 2025 spec; it is ignored for the 2021 spec.",platform2025:"The 2025 spec supports phone and watch platform tuning.",contrastLevel:"Contrast level",normalContrast:"Default · 0",reducedContrast:"Reduced · −1",highContrast:"Higher · 0.5",maxContrast:"Maximum · 1",semanticRoles:"Semantic color roles",rolePairs:"Foreground/background contrast pairs",tonalPalettes:"Generated tonal palettes",typeScale:"Material 3 type scale",typeScaleHelp:"Official M3 role/size conventions, previewed with Roboto.",categorySourceHelp:"All displayed accents are generated with the official MCU Rainbow scheme. The seven hue anchors are Loculary-specific; the actual light/dark colors and foregrounds are generated and contrast-checked by MCU.",mcuRainbowHelp:"Official MCU Rainbow variant applied to each category hue anchor.",
    note:"Nothing here changes Loculary’s production design. This is a decision aid; the final palette and style remain open.",closeDialog:"Close dialog",fieldHelp:"Shape, spacing and type respond to the selected visual language.",actionsHelp:"Use the controls above to compare the same components.",
  },
  fr: {
    eyebrow:"Laboratoire expérimental · hors production",title:"Trouvons la personnalité visuelle de Loculary.",intro:"Compare la même interface de téléphone selon deux pistes inspirées d’Android. Garde uniquement les réglages utiles pour juger le rendu.",categoryColors:"Couleurs d’identité des catégories",categoryColorsHelp:"Les couleurs des catégories restent indépendantes de la couleur de marque. La variante officielle Rainbow de MCU génère leurs teintes et tons ; les aplats utilisent une couleur de texte générée pour rester lisibles.",
    directions:"Pistes de style Android",directionsHelp:"Compare deux interprétations cohérentes du langage visuel Android. Ce sont des pistes d’exploration, pas des captures officielles de Google.",pixelDirection:"Pixel / M3 fidèle",pixelDirectionHelp:"Surfaces tonales discrètes, navigation Android familière et accentuation mesurée.",expressiveDirection:"Expressif",expressiveDirectionHelp:"Hiérarchie plus marquée, contraste de formes ludique et action principale visible.",utilityDirection:"Productivité",utilityDirectionHelp:"Mise en page compacte, priorité à l’information et lecture rapide.",directionEyebrow:"Aperçu de la piste",directionAction:"Ouvrir l’outil",directionRecent:"Reprendre là où tu en étais",directionBrowse:"Parcourir les catégories",directionBottomHome:"Accueil",directionBottomExplore:"Explorer",directionBottomSaved:"Enregistrés",directionBottomProfile:"Profil",theme:"Thème",style:"Langage visuel",viewport:"Largeur d’aperçu",categorySet:"Jeu de couleurs des catégories",currentSet:"Sources actuelles",mcuRainbowSet:"Rainbow officiel M3",blueSet:"Dominante bleue",categoryStyle:"Traitement des catégories",softStyle:"Teinte légère",stripeStyle:"Bande franche",solidStyle:"Aplat coloré",language:"Langue de l’aperçu",light:"Clair",dark:"Sombre",classic:"Material 3",expressive:"M3 Expressive",desktop:"Ordinateur",tablet:"Tablette",mobile:"Mobile",
    home:"Accueil",explore:"Explorer",tool:"Page outil",search:"De quoi as-tu besoin ?",searchButton:"Trouver un outil",quick:"Actions populaires",welcome:"Une boîte à outils pour tes idées",subhead:"Des tâches simples, des outils utiles, moins de friction.",browse:"Explorer les outils",
    results:"Outils suggérés",resultOne:"Calcul de pourcentage",resultTwo:"Convertisseur d’image",resultThree:"Nettoyeur de texte",toolTitle:"Calcul de pourcentage",toolDesc:"Calcule un pourcentage de n’importe quelle valeur.",value:"Valeur",percent:"Pourcentage",calculate:"Calculer",output:"Ton résultat",
    components:"Galerie de composants",settings:"Compte et préférences",settingsHelp:"Exemples d’options que l’utilisateur peut activer ou désactiver.",syncFavorites:"Synchroniser les favoris",syncFavoritesHelp:"Retrouver les favoris sur son compte.",automaticTheme:"Suivre le thème de l’appareil",automaticThemeHelp:"Utiliser le mode clair ou sombre du téléphone ou de l’ordinateur.",reducedMotion:"Réduire les animations",reducedMotionHelp:"Limiter les animations non essentielles.",switchOnLabel:"Activé",switchOffLabel:"Désactivé",actions:"Actions et commandes",forms:"Formulaires et choix",surfaces:"Surfaces et retours",type:"Typographie et formes",states:"États d’interaction",filled:"Rempli",elevated:"Surélevé",tonal:"Tonal",outlined:"Contour",textButton:"Texte",disabled:"Désactivé",focus:"Focus clavier",motion:"Rejouer l’animation",
    email:"Adresse e-mail",choose:"Choisir une catégorie",selected:"Sélectionné",chip:"Outils image",filter:"Filtres",tabA:"Aperçu",tabB:"Détails",cardTitle:"Un résultat utile",cardText:"La tâche reste claire et la prochaine étape évidente.",
    dialogTitle:"Prêt à continuer ?",dialogText:"Ceci est un aperçu de dialogue, pas une vraie confirmation.",close:"Pas maintenant",confirm:"Continuer",success:"Tout semble correct",warning:"Vérifie cette valeur",error:"Saisis une adresse e-mail valide",
    composition:"Mises en situation",compositionHelp:"Compositions illustratives avec les tokens sélectionnés, pas des captures de l’interface actuelle.",contrast:"Vérification du contraste",contrastHelp:"Examine les paires de rôles calculées avant d’adopter une palette.",wcag:"Le contraste Material est informatif, pas un audit WCAG complet.",seed:"Couleur source",sourceColor:"Couleur source (hex)",sourceColorHelp:"Choisis n’importe quelle couleur ou pars d’un preset de référence. Les rôles sont générés par le moteur officiel Material Color Utilities.",invalidSeed:"Saisis une couleur hexadécimale valide à 3 ou 6 chiffres.",seedPresets:"Presets de référence",variant:"Variante de schéma dynamique",variantHelp:"Variante officielle de Material Color Utilities ; l’affectation des catégories reste un choix propre à Loculary.",specVersion:"Version de la spécification Material",platform:"Plateforme cible",phone:"Téléphone",watch:"Montre",platform2021:"La plateforme n’influence que la spécification 2025 ; elle est ignorée en 2021.",platform2025:"La spécification 2025 adapte les palettes aux plateformes téléphone et montre.",contrastLevel:"Niveau de contraste",normalContrast:"Défaut · 0",reducedContrast:"Réduit · −1",highContrast:"Renforcé · 0,5",maxContrast:"Maximum · 1",semanticRoles:"Rôles de couleur sémantiques",rolePairs:"Paires premier plan / arrière-plan",tonalPalettes:"Palettes tonales générées",typeScale:"Échelle typographique Material 3",typeScaleHelp:"Conventions officielles des rôles et tailles M3, avec un aperçu en Roboto.",categorySourceHelp:"Tous les accents affichés sont générés par la variante officielle Rainbow de MCU. Les sept points d’ancrage de teinte sont propres à Loculary ; les couleurs clair/sombre et les avant-plans sont générés par MCU puis contrôlés en contraste.",mcuRainbowHelp:"Variante officielle Rainbow de MCU appliquée à chaque point d’ancrage de catégorie.",
    note:"Rien ici ne modifie le design de production de Loculary. C’est un outil d’aide à la décision ; palette et style restent à choisir.",closeDialog:"Fermer le dialogue",fieldHelp:"Formes, espacements et typographie suivent le langage visuel sélectionné.",actionsHelp:"Utilise les contrôles ci-dessus pour comparer les mêmes composants.",
  },
};

function createLabTokens(scheme: ReturnType<typeof createM3Scheme>, theme: Theme): CSSProperties & Record<string,string> {
  return {
    "--lab-bg":colorHex(scheme.background),"--lab-surface":colorHex(scheme.surface),"--lab-surface-2":colorHex(scheme.surfaceVariant),
    "--lab-surface-low":colorHex(scheme.surfaceContainerLow),"--lab-surface-container":colorHex(scheme.surfaceContainer),
    "--lab-surface-high":colorHex(scheme.surfaceContainerHigh),"--lab-surface-highest":colorHex(scheme.surfaceContainerHighest),
    "--lab-font":"var(--font-roboto), Roboto, Arial, sans-serif","--lab-text":colorHex(scheme.onSurface),
    "--lab-muted":colorHex(scheme.onSurfaceVariant),"--lab-outline":colorHex(scheme.outline),
    "--lab-primary":colorHex(scheme.primary),"--lab-on-primary":colorHex(scheme.onPrimary),
    "--lab-primary-soft":colorHex(scheme.primaryContainer),"--lab-on-primary-soft":colorHex(scheme.onPrimaryContainer),
    "--lab-secondary":colorHex(scheme.secondary),"--lab-on-secondary":colorHex(scheme.onSecondary),
    "--lab-secondary-container":colorHex(scheme.secondaryContainer),"--lab-on-secondary-container":colorHex(scheme.onSecondaryContainer),
    "--lab-tertiary":colorHex(scheme.tertiary),"--lab-on-tertiary":colorHex(scheme.onTertiary),
    "--lab-tertiary-container":colorHex(scheme.tertiaryContainer),"--lab-on-tertiary-container":colorHex(scheme.onTertiaryContainer),
    "--lab-error":colorHex(scheme.error),"--lab-on-error":colorHex(scheme.onError),
    "--lab-success-bg":theme==="dark"?"#173B2A":"#D5F5D6","--lab-success-text":theme==="dark"?"#A7F3C0":"#14532D",
    "--lab-warning-bg":theme==="dark"?"#4A350F":"#FFF0B3","--lab-warning-text":theme==="dark"?"#FFE08A":"#704400",
    "--lab-error-bg":theme==="dark"?"#4B1F24":"#FFE0E0","--lab-error-text":theme==="dark"?"#FFB4AB":"#8F1717",
    "--lab-radius":"0.8rem","--lab-radius-small":"0.35rem","--lab-motion":"180ms",
  } as CSSProperties & Record<string,string>;
}
export default function VisualLab({ initialLocale }: { initialLocale: string }) {
  const locale: Locale = initialLocale==="fr"?"fr":"en";
  const [theme,setTheme]=useState<Theme>("light");
  const [screen,setScreen]=useState<Screen>("home");
  const [direction,setDirection]=useState<DesignDirection>("pixel");
  const [seed,setSeed]=useState("#4285F4");
  const [paletteOpen,setPaletteOpen]=useState(false);
  const [viewport,setViewport]=useState<"desktop"|"tablet"|"mobile">("mobile");
  const [dialogOpen,setDialogOpen]=useState(true);
  const [motionReplay,setMotionReplay]=useState(0);
  const [snackbarOpen,setSnackbarOpen]=useState(false);
  const [bottomSheetOpen,setBottomSheetOpen]=useState(false);
  const [sampleChecked,setSampleChecked]=useState(true);
  const [sampleProgress,setSampleProgress]=useState(55);
  const [sampleRadio,setSampleRadio]=useState("all");
  const [sampleTab,setSampleTab]=useState("overview");
  const [sampleMenuOpen,setSampleMenuOpen]=useState(false);
  const [sampleFilterSelected,setSampleFilterSelected]=useState(true);
  const [value,setValue]=useState("180");
  const [percent,setPercent]=useState("25");
  const [preferences,setPreferences]=useState({syncFavorites:true,automaticTheme:false,reducedMotion:false});
  const t=copy[locale];
  const scheme=useMemo(()=>createM3Scheme(seed,"fidelity",theme==="dark",0,"2025","phone"),[theme,seed]);
  const tokens=useMemo(()=>createLabTokens(scheme,theme),[scheme,theme]);
  const amount=Number(value)*Number(percent)/100;
  const result=Number.isFinite(amount)?amount.toLocaleString(locale==="fr"?"fr-FR":"en-US",{maximumFractionDigits:3}):"—";
  const isMulticolorPalette=true;

  return <main data-theme={theme} data-reduced-motion={preferences.reducedMotion} className={styles.lab} style={tokens}>
    <header className={styles.intro}>
      <div className={styles.introTop}><span className={styles.eyebrow}><span className={styles.sparkle} aria-hidden="true"><MaterialIcon name="stars" size={16} /></span>{t.eyebrow}</span>
        
      </div><h1>{t.title}</h1><p>{t.intro}</p>
    </header>
    <section className={styles.directionSection} aria-labelledby="directions-title">
      <div className={styles.sectionHeading}>
        <div><span className={styles.sectionKicker}>01 / {t.directions}</span><h2 id="directions-title">{t.directions}</h2><p>{t.directionsHelp}</p></div>
        <div className={styles.screenTabs} role="tablist" aria-label={t.directions}>
          {(["pixel","utility"] as const).map(item=><button key={item} type="button" role="tab" aria-selected={direction===item} onClick={()=>setDirection(item)}>{t[item==="pixel"?"pixelDirection":"utilityDirection"]}</button>)}
        </div>
      </div>
      <p className={styles.directionHelp}>{t[direction==="pixel"?"pixelDirectionHelp":"utilityDirectionHelp"]}</p>
      <div className={styles.controlRow}>
        <fieldset className={styles.segmentField}><legend>{t.theme}</legend><div className={styles.segmented}><button type="button" aria-pressed={theme==="light"} onClick={()=>setTheme("light")}><MaterialIcon name="light_mode" size={16} /> {t.light}</button><button type="button" aria-pressed={theme==="dark"} onClick={()=>setTheme("dark")}><MaterialIcon name="dark_mode" size={16} /> {t.dark}</button></div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.viewport}</legend><div className={styles.segmented}>{(["mobile","tablet","desktop"] as const).map(size=><button key={size} type="button" aria-pressed={viewport===size} onClick={()=>setViewport(size)}>{t[size]}</button>)}</div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.home} / {t.explore} / {t.tool}</legend><div className={styles.segmented}>{(["home","explore","tool"] as const).map(item=><button key={item} type="button" aria-pressed={screen===item} onClick={()=>setScreen(item)}>{t[item]}</button>)}</div></fieldset>
        <div className={styles.seedPicker}>
          <span className={styles.seedPickerLabel}>{locale==="fr"?"Couleur de l’interface":"Interface color"}</span>
          <button type="button" className={styles.seedPickerTrigger} aria-expanded={paletteOpen} aria-controls="design-lab-color-palette" onClick={()=>setPaletteOpen(open=>!open)}>
            <span className={styles.seedSwatch} style={{backgroundColor:seed}} aria-hidden="true" />
            <span>{locale==="fr"?"Choisir une couleur":"Choose a color"}</span>
            <code>{seed}</code>
            <span aria-hidden="true"><MaterialIcon name={paletteOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={20} /></span>
          </button>
          {paletteOpen&&<div className={styles.seedPalette} id="design-lab-color-palette">
            <div className={styles.seedPaletteHeading}>{locale==="fr"?"Couleurs de départ":"Color presets"}</div>
            <div className={styles.seedSwatchGrid}>
              {seedPresets.map(preset=><button key={preset.seed} type="button" className={styles.seedPreset} aria-label={locale==="fr"?preset.nameFr:preset.name} aria-pressed={seed===preset.seed} title={locale==="fr"?preset.nameFr:preset.name} onClick={()=>setSeed(preset.seed)}><span style={{backgroundColor:preset.seed}} /><small>{locale==="fr"?preset.nameFr:preset.name}</small></button>)}
            </div>
            <label className={styles.customSeedControl}>
              <span>{locale==="fr"?"Personnaliser":"Custom color"}</span>
              <input type="color" value={seed} onChange={event=>setSeed(event.target.value.toUpperCase())} aria-label={locale==="fr"?"Choisir une couleur personnalisée":"Choose a custom color"} />
            </label>
          </div>}
        </div>
      </div>
      <div className={styles.singlePreview} style={createLabTokens(scheme,theme)}>      <div className={`${styles.directionStage} ${styles["directionViewport_"+viewport]}`} data-direction={direction} data-theme={theme}>
        <header className={styles.directionHeader}><span className={styles.directionBrand}><span aria-hidden="true"><LabIcon name="sparkles" size={18} /></span> Loculary</span><button type="button" aria-label={locale==="fr"?"Notifications":"Notifications"}><LabIcon name="bell" /></button></header>
        <div key={screen} className={styles.directionContent}>
          {screen==="home"&&<>
            <span className={styles.directionEyebrow}>{t.directionEyebrow}</span>
            <h3>{t.welcome}</h3><p className={styles.directionSubtitle}>{t.subhead}</p>
            <div className={styles.directionSearch}><LabIcon name="search" /><span>{t.search}</span><span className={styles.directionSearchAction} aria-hidden="true"><LabIcon name="arrow-up-right" size={18} /></span></div>
            <div className={styles.directionSectionTitle}><strong>{t.quick}</strong><button type="button" onClick={()=>setScreen("explore")}>{t.directionBrowse} <MaterialIcon name="arrow_outward" size={16} /></button></div>
            <div className={styles.directionGrid}>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="calculator" size={22} /></span><div><strong>{t.resultOne}</strong><small>{t.directionRecent}</small></div><span aria-hidden="true"><LabIcon name="arrow-up-right" size={18} /></span></article>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="image" size={22} /></span><div><strong>{t.resultTwo}</strong><small>PNG · JPG · WEBP</small></div><span aria-hidden="true"><LabIcon name="arrow-up-right" size={18} /></span></article>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="text" size={22} /></span><div><strong>{t.resultThree}</strong><small>{t.cardText}</small></div><span aria-hidden="true"><LabIcon name="arrow-up-right" size={18} /></span></article>
            </div>
            <button type="button" className={styles.directionPrimary} onClick={()=>setScreen("explore")}><LabIcon name="plus" /> {t.directionAction}</button>
          </>}
          {screen==="explore"&&<>
            <span className={styles.directionEyebrow}>{t.filter}</span><h3>{t.results}</h3><p className={styles.directionSubtitle}>{t.subhead}</p>
            <div className={styles.directionSearch}><LabIcon name="search" /><span>{t.search}</span></div>
            <div className={styles.directionSectionTitle}><strong>{t.quick}</strong><button type="button">{t.selected} · 3</button></div>
            <div className={styles.directionGrid}>
              {[t.resultOne,t.resultTwo,t.resultThree].map((name,index)=><article className={styles.directionCard} key={name}><span className={styles.directionIcon}>{[<LabIcon key="calculator" name="calculator" size={22} />,<LabIcon key="image" name="image" size={22} />,<LabIcon key="text" name="text" size={22} />][index]}</span><div><strong>{name}</strong><small>{t.cardText}</small></div><span aria-hidden="true"><LabIcon name="arrow-up-right" size={18} /></span></article>)}
            </div>
          </>}
          {screen==="saved"&&<>
            <span className={styles.directionEyebrow}>{t.directionBottomSaved}</span><h3>{t.directionBottomSaved}</h3><p className={styles.directionSubtitle}>{t.directionRecent}</p>
            <div className={styles.directionGrid}>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="calculator" size={22} /></span><div><strong>{t.resultOne}</strong><small>{t.cardText}</small></div><button type="button" aria-label={t.toolTitle} onClick={()=>setScreen("tool")}><LabIcon name="arrow-up-right" size={18} /></button></article>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="image" size={22} /></span><div><strong>{t.resultTwo}</strong><small>PNG · JPG · WEBP</small></div><span aria-hidden="true"><LabIcon name="arrow-up-right" size={18} /></span></article>
            </div>
          </>}
          {screen==="profile"&&<>
            <span className={styles.directionEyebrow}>{t.directionBottomProfile}</span><h3>{t.settings}</h3><p className={styles.directionSubtitle}>{t.settingsHelp}</p>
            <div className={styles.directionGrid}>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="sun" size={22} /></span><div><strong>{t.automaticTheme}</strong><small>{t.automaticThemeHelp}</small></div><button type="button" aria-pressed={theme==="dark"} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?t.dark:t.light}</button></article>
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="heart" size={22} /></span><div><strong>{t.syncFavorites}</strong><small>{t.syncFavoritesHelp}</small></div><span aria-hidden="true"><MaterialIcon name="chevron_right" size={20} /></span></article>
            </div>
          </>}
          {screen==="tool"&&<>
            <button type="button" className={styles.directionBack} onClick={()=>setScreen("home")}><LabIcon name="back" size={18} /> {t.home}</button>
            <span className={styles.directionEyebrow}>{t.tool}</span><h3>{t.toolTitle}</h3><p className={styles.directionSubtitle}>{t.toolDesc}</p>
            <div className={styles.directionCalculator}>
              <label>{t.value}<input value={value} inputMode="decimal" onChange={e=>setValue(e.target.value)}/></label>
              <label>{t.percent}<input value={percent} inputMode="decimal" onChange={e=>setPercent(e.target.value)}/></label>
              <div className={styles.directionResult}><span>{t.output}</span><strong>{result}</strong></div>
              <button type="button" className={styles.directionPrimary} onClick={()=>setScreen("home")}><LabIcon name="calculator" size={18} /> {t.calculate}</button>
            </div>
          </>}
        </div>
        <nav className={styles.directionBottomNav} aria-label={locale==="fr"?"Navigation de l’aperçu":"Preview navigation"}>
          <button type="button" aria-current={screen==="home"?"page":undefined} onClick={()=>setScreen("home")}><b><LabIcon name="home" size={22} /></b>{t.directionBottomHome}</button><button type="button" aria-current={screen==="explore"?"page":undefined} onClick={()=>setScreen("explore")}><b><LabIcon name="search" size={22} /></b>{t.directionBottomExplore}</button><button type="button" aria-current={screen==="saved"?"page":undefined} onClick={()=>setScreen("saved")}><b><LabIcon name="heart" size={22} /></b>{t.directionBottomSaved}</button><button type="button" aria-current={screen==="profile"?"page":undefined} onClick={()=>setScreen("profile")}><b><LabIcon name="user" size={22} /></b>{t.directionBottomProfile}</button>
        </nav>
      </div></div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="gallery-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>02 / {t.components}</span><h2 id="gallery-title">{t.components}</h2><p>{t.actionsHelp}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{t.actions}</h3><div className={styles.buttonStack}><Button variant="filled">{t.filled}</Button><Button variant="elevated">{t.elevated}</Button><Button variant="filled-tonal">{t.tonal}</Button><Button variant="outlined">{t.outlined}</Button><Button variant="text">{t.textButton}</Button><Button variant="filled" disabled>{t.disabled}</Button></div><div className={styles.stateSamples}><button type="button" className={styles.focusSample}>{t.focus}</button><button type="button" className={styles.rippleSample} onClick={()=>setMotionReplay(n=>n+1)}>{t.motion}</button></div><p className={styles.helper}>{t.fieldHelp}</p><div key={motionReplay} className={styles.motionDemo} aria-hidden="true"><span><LabIcon name="sparkles" size={18} /></span><span><LabIcon name="check" size={18} /></span><span><LabIcon name="heart" size={18} /></span></div></article>
        <article className={styles.galleryCard}><h3>{t.forms}</h3><label className={styles.fieldLabel}>{t.email}<input type="email" placeholder="bonjour@loculary.com"/></label><label className={styles.fieldLabel}>{t.choose}<select defaultValue="images"><option value="images">{t.resultTwo}</option><option value="text">{t.resultThree}</option></select></label><div className={styles.chipRow}><button type="button" className={styles.chipSelected}>{t.selected} <MaterialIcon name="check" size={16} /></button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipSecondary:""}`}>{t.chip}</button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipTertiary:""}`}>{t.filter}</button></div><div className={styles.tabRow} role="tablist" aria-label={locale==="fr"?"Onglets de démonstration":"Demo tabs"}><button type="button" role="tab" aria-selected={sampleTab==="overview"} className={sampleTab==="overview"?styles.tabSelected:styles.tab} onClick={()=>setSampleTab("overview")}>{t.tabA}</button><button type="button" role="tab" aria-selected={sampleTab==="details"} className={sampleTab==="details"?styles.tabSelected:styles.tab} onClick={()=>setSampleTab("details")}>{t.tabB}</button></div><p className={styles.helper}>{sampleTab==="overview"?(locale==="fr"?"Contenu de l’aperçu sélectionné.":"Overview tab selected."):(locale==="fr"?"Contenu des détails sélectionné.":"Details tab selected.")}</p>
          <div className={styles.preferenceList}><div className={styles.preferenceHeading}><h4>{t.settings}</h4><p>{t.settingsHelp}</p></div>
            {([{key:"syncFavorites",title:t.syncFavorites,help:t.syncFavoritesHelp},{key:"automaticTheme",title:t.automaticTheme,help:t.automaticThemeHelp},{key:"reducedMotion",title:t.reducedMotion,help:t.reducedMotionHelp}] as const).map(item=><div className={styles.preferenceRow} key={item.key}><div className={styles.preferenceCopy}><strong id={`lab-pref-label-${item.key}`}>{item.title}</strong><p id={`lab-pref-desc-${item.key}`}>{item.help}</p></div><Switch id={`lab-pref-${item.key}`} label={item.title} aria-labelledby={`lab-pref-label-${item.key}`} aria-describedby={`lab-pref-desc-${item.key}`} checked={preferences[item.key]} onCheckedChange={(checked)=>setPreferences(current=>({...current,[item.key]:checked}))}/><span className={styles.preferenceState}>{preferences[item.key]?t.switchOnLabel:t.switchOffLabel}</span></div>)}
          </div></article>
        <article className={styles.galleryCard}><h3>{t.surfaces}</h3><div className={styles.infoCard}><span className={`${styles.cardIcon} ${isMulticolorPalette?styles.accentTertiary:""}`}><LabIcon name="sparkles" /></span><strong>{t.cardTitle}</strong><p>{t.cardText}</p><button type="button" className={styles.textButton}>{t.browse} <MaterialIcon name="arrow_outward" size={16} /></button></div><div className={styles.status} role="status"><LabIcon name="check" size={18} />{t.success}</div><div className={styles.statusWarning}><MaterialIcon name="warning" size={18} />{t.warning}</div><div className={styles.statusError} role="alert"><LabIcon name="close" size={18} />{t.error}</div></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="states-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>03 / {t.states}</span><h2 id="states-title">{t.states}</h2><p>{t.dialogText}</p></div><Button type="button" variant="outlined" className={styles.dialogPreviewTrigger} onClick={()=>setDialogOpen(true)}>{t.confirm} · dialog</Button></div>
      {dialogOpen&&<div className={styles.dialogPreview} role="group" aria-label={t.states}><div className={styles.dialogIcon}><MaterialIcon name="stars" size={24} /></div><h3>{t.dialogTitle}</h3><p>{t.dialogText}</p><div><button type="button" className={styles.textButton} onClick={()=>setDialogOpen(false)}>{t.close}</button><button type="button" className={styles.filled} onClick={()=>setDialogOpen(false)}>{t.confirm}</button></div></div>}
    </section>
    <section className={styles.gallerySection} aria-labelledby="android-controls-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>04 / {locale==="fr"?"Contrôles Android":"Android controls"}</span><h2 id="android-controls-title">{locale==="fr"?"Autres composants à tester":"More components to test"}</h2><p>{locale==="fr"?"Contrôles interactifs courants de Material 3.":"Interactive Material 3 controls commonly used in apps."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Sélection et progression":"Selection & progress"}</h3><label className={styles.sampleCheck}><input type="checkbox" checked={sampleChecked} onChange={e=>setSampleChecked(e.target.checked)} />{locale==="fr"?"Activer cette option":"Enable this option"}</label><label className={styles.sampleSlider}>{locale==="fr"?"Niveau":"Level"} <output>{sampleProgress}%</output><input type="range" min="0" max="100" step="5" value={sampleProgress} onChange={e=>setSampleProgress(Number(e.target.value))} /></label><div className={styles.sampleProgress} role="progressbar" aria-label={locale==="fr"?"Progression de démonstration":"Demo progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={sampleProgress}><span style={{width:sampleProgress+"%"}} /></div><p className={styles.helper}>{locale==="fr"?"Le curseur pilote la barre de progression.":"The slider controls the progress indicator."}</p></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Retour et panneau inférieur":"Feedback & bottom sheet"}</h3><div className={styles.sampleActions}><button type="button" className={styles.tonal} onClick={()=>setSnackbarOpen(true)}>{locale==="fr"?"Afficher un snackbar":"Show snackbar"}</button><button type="button" className={styles.outlined} onClick={()=>setBottomSheetOpen(open=>!open)}>{bottomSheetOpen?(locale==="fr"?"Fermer le panneau":"Close sheet"):(locale==="fr"?"Ouvrir un panneau":"Open bottom sheet")}</button></div>{bottomSheetOpen&&<div className={styles.sampleBottomSheet} role="region" aria-label={locale==="fr"?"Panneau inférieur de démonstration":"Demo bottom sheet"}><div className={styles.sheetHandle}/><strong>{locale==="fr"?"Actions rapides":"Quick actions"}</strong><p>{locale==="fr"?"Un panneau ancré au bas de l’écran, avec une hiérarchie claire.":"A bottom-anchored panel with a clear content hierarchy."}</p><button type="button" className={styles.textButton} onClick={()=>setBottomSheetOpen(false)}>{locale==="fr"?"Terminé":"Done"}</button></div>}{snackbarOpen&&<div className={styles.sampleSnackbar} role="status"><span>{locale==="fr"?"Préférence enregistrée":"Preference saved"}</span><button type="button" onClick={()=>setSnackbarOpen(false)} aria-label={locale==="fr"?"Fermer":"Dismiss"}><LabIcon name="close" size={18}/></button></div>}</article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="m3-missing-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>05 / ${locale==="fr"?"Bibliothèque M3 étendue":"Extended M3 library"}</span><h2 id="m3-missing-title">{locale==="fr"?"Composants Android à ne pas oublier":"Android components not to miss"}</h2><p>{locale==="fr"?"Une couverture plus large des composants Material 3 courants, avec états sélectionnables et couleurs reliées au thème actif.":"Broader coverage of common Material 3 components, with selectable states and colors linked to the active theme."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Barre supérieure, navigation et action flottante":"Top app bar, navigation & FAB"}</h3>
          <div className={styles.sampleTopBar}><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Ouvrir le menu":"Open menu"}><MaterialIcon name="menu" size={22}/></button><strong>Loculary</strong><span className={styles.sampleTopBarSpacer}/><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Rechercher":"Search"}><MaterialIcon name="search" size={22}/></button><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Notifications":"Notifications"}><MaterialIcon name="notifications" size={22}/><i className={styles.sampleBadgeDot}/></button></div>
          <div className={styles.sampleNavigationRow}><nav className={styles.sampleNavigationRail} aria-label={locale==="fr"?"Navigation de démonstration":"Demo navigation"}><button type="button" aria-current="page"><span><MaterialIcon name="home" size={20}/></span><small>{locale==="fr"?"Accueil":"Home"}</small></button><button type="button"><span><MaterialIcon name="search" size={20}/></span><small>{locale==="fr"?"Explorer":"Explore"}</small></button><button type="button"><span><MaterialIcon name="collections_bookmark" size={20}/></span><small>{locale==="fr"?"Enregistrés":"Saved"}</small></button></nav><div className={styles.sampleNavDescription}><span className={styles.sampleBadge}>{locale==="fr"?"3 nouveaux":"3 new"}</span><p>{locale==="fr"?"Rail de navigation avec destination active et badge informatif.":"Navigation rail with selected destination and an informative badge."}</p><button type="button" className={styles.sampleFab} aria-label={locale==="fr"?"Ajouter un élément":"Create item"} onClick={()=>setSnackbarOpen(true)}><MaterialIcon name="add" size={24}/></button></div></div>
          <p className={styles.helper}>{locale==="fr"?"Barre d’application, boutons icône, badge, rail et FAB.":"App bar, icon buttons, badge, navigation rail and FAB."}</p>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Champs, choix et filtres":"Text fields, choices & filters"}</h3>
          <label className={styles.sampleMaterialField}><span>{locale==="fr"?"Nom de l’outil":"Tool name"}</span><input type="text" defaultValue={locale==="fr"?"Convertisseur d’image":"Image converter"} /><small>{locale==="fr"?"Texte d’aide sous le champ":"Supporting text below the field"}</small></label>
          <label className={styles.sampleMaterialField}><span>{locale==="fr"?"Champ avec erreur":"Field with error"}</span><input type="email" aria-invalid="true" defaultValue="adresse-invalide" /><small className={styles.sampleFieldError}>{locale==="fr"?"Saisis une adresse e-mail valide.":"Enter a valid email address."}</small></label>
          <fieldset className={styles.sampleRadioGroup}><legend>{locale==="fr"?"Afficher les éléments":"Show items"}</legend><label><input type="radio" name="lab-filter" value="all" checked={sampleRadio==="all"} onChange={()=>setSampleRadio("all")}/>{locale==="fr"?"Tous":"All"}</label><label><input type="radio" name="lab-filter" value="favorites" checked={sampleRadio==="favorites"} onChange={()=>setSampleRadio("favorites")}/>{locale==="fr"?"Favoris":"Favorites"}</label></fieldset>
          <div className={styles.chipRow}><button type="button" aria-pressed={sampleFilterSelected} className={sampleFilterSelected?styles.chipSelected:styles.chip} onClick={()=>setSampleFilterSelected(value=>!value)}>{sampleFilterSelected&&<MaterialIcon name="check" size={16}/>} {locale==="fr"?"Filtre sélectionnable":"Selectable filter"}</button><button type="button" className={styles.chip}>{locale==="fr"?"Suggestion":"Suggestion"}</button></div>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Listes, séparateurs et menus":"Lists, dividers & menus"}</h3>
          <div className={styles.sampleListItem}><span className={styles.sampleListIcon}><MaterialIcon name="image" size={20}/></span><span className={styles.sampleListCopy}><strong>{locale==="fr"?"Convertisseur d’image":"Image converter"}</strong><small>{locale==="fr"?"PNG, JPEG, WebP":"PNG, JPEG, WebP"}</small></span><span className={styles.sampleListMeta}>12</span><MaterialIcon name="chevron_right" size={20}/></div>
          <div className={styles.sampleDivider}/>
          <div className={styles.sampleListItem}><span className={styles.sampleListIcon}><MaterialIcon name="text_fields" size={20}/></span><span className={styles.sampleListCopy}><strong>{locale==="fr"?"Nettoyeur de texte":"Text cleaner"}</strong><small>{locale==="fr"?"Nettoyer et reformater":"Clean and reformat"}</small></span><MaterialIcon name="chevron_right" size={20}/></div>
          <div className={styles.sampleMenuWrap}><button type="button" className={styles.outlined} aria-expanded={sampleMenuOpen} onClick={()=>setSampleMenuOpen(open=>!open)}><MaterialIcon name="apps" size={18}/>{locale==="fr"?"Options du composant":"Component options"}</button>{sampleMenuOpen&&<div className={styles.sampleMenu} role="menu"><button type="button" role="menuitem" onClick={()=>setSampleMenuOpen(false)}><MaterialIcon name="text_fields" size={18}/>{locale==="fr"?"Modifier":"Edit"}</button><button type="button" role="menuitem" onClick={()=>setSampleMenuOpen(false)}><MaterialIcon name="content_copy" size={18}/>{locale==="fr"?"Dupliquer":"Duplicate"}</button><button type="button" role="menuitem" onClick={()=>setSampleMenuOpen(false)}><MaterialIcon name="close" size={18}/>{locale==="fr"?"Supprimer":"Delete"}</button></div>}</div>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Indicateurs et chargement":"Progress & loading"}</h3>
          <div className={styles.sampleProgressRow}><div className={styles.sampleCircularProgress} role="progressbar" aria-label={locale==="fr"?"Progression circulaire":"Circular progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={sampleProgress} style={{background:"conic-gradient(var(--lab-primary) "+sampleProgress+"%,var(--lab-surface-high) 0)"}}><span>{sampleProgress}%</span></div><div className={styles.sampleProgressCopy}><strong>{locale==="fr"?"Importation en cours":"Import in progress"}</strong><p>{locale==="fr"?"Progression déterminée par le curseur de la section précédente.":"Progress is controlled by the slider in the section above."}</p><div className={styles.sampleProgress}><span style={{width:sampleProgress+"%"}}/></div></div></div>
          <div className={styles.sampleSkeleton}><span/><span/><span/></div><p className={styles.helper}>{locale==="fr"?"Progression circulaire, linéaire et squelette de chargement.":"Circular and linear progress plus loading skeleton."}</p>
          <div className={styles.sampleTooltipWrap}><button type="button" className={styles.sampleIconButton} title={locale==="fr"?"Aide contextuelle":"Contextual help"} aria-label={locale==="fr"?"Aide contextuelle":"Contextual help"}><MaterialIcon name="info" size={20}/></button><span>{locale==="fr"?"Survole ou focalise l’icône pour voir l’aide.":"Hover or focus the icon to reveal help."}</span></div>
        </article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="shared-components-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>06 / ${locale==="fr"?"Composants partagés":"Shared primitives"}</span><h2 id="shared-components-title">{locale==="fr"?"Composants réels de Loculary":"Loculary shared components"}</h2><p>{locale==="fr"?"Aperçu direct des primitives partagées du site, reliées aux mêmes tokens du thème actif.":"Live samples of the site's shared UI primitives, wired to the same active theme tokens."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Boutons et boutons icône":"Buttons & icon buttons"}</h3>
          <div className={styles.buttonStack}><Button variant="filled">{locale==="fr"?"Rempli":"Filled"}</Button><Button variant="elevated">{locale==="fr"?"Surélevé":"Elevated"}</Button><Button variant="filled-tonal">{locale==="fr"?"Tonal":"Filled tonal"}</Button><Button variant="outlined">{locale==="fr"?"Contour":"Outlined"}</Button><Button variant="text">{locale==="fr"?"Texte":"Text"}</Button><Button variant="danger">{locale==="fr"?"Destructif":"Danger"}</Button></div>
          <div className={styles.buttonStack}><IconButton label={locale==="fr"?"Favoris":"Favorites"} variant="standard"><MaterialIcon name="favorite" size={24}/></IconButton><IconButton label={locale==="fr"?"Ajouter":"Add"} variant="filled"><MaterialIcon name="add" size={24}/></IconButton><IconButton label={locale==="fr"?"Rechercher":"Search"} variant="filled-tonal"><MaterialIcon name="search" size={24}/></IconButton><IconButton label={locale==="fr"?"Plus d’options":"More options"} variant="outlined"><MaterialIcon name="apps" size={24}/></IconButton></div>
          <p className={styles.helper}>{locale==="fr"?"Primitives de production Button et IconButton, pas des imitations locales.":"Production Button and IconButton primitives, not local lookalikes."}</p>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Champs et sélection partagés":"Shared fields & selection"}</h3>
          <div className={styles.sharedFieldStack}><TextField inputId="lab-shared-text-field" label={locale==="fr"?"Valeur":"Value"} defaultValue="180" type="number" unit="px"/><TextArea inputId="lab-shared-text-area" label={locale==="fr"?"Description":"Description"} rows={3} defaultValue={locale==="fr"?"Un exemple de zone de texte partagée.":"An example of the shared multiline field."} className={styles.sharedTextArea}/><Select id="lab-shared-select" label={locale==="fr"?"Format":"Format"} defaultValue="png"><option value="png">PNG</option><option value="webp">WebP</option><option value="jpeg">JPEG</option></Select></div>
          <Checkbox inputId="lab-shared-checkbox" checked={sampleChecked} onCheckedChange={setSampleChecked} label={locale==="fr"?"Inclure les sous-catégories":"Include subcategories"}/>
          <SegmentedControl ariaLabel={locale==="fr"?"Disposition de la liste":"List layout"} value={sampleRadio} onChange={setSampleRadio} items={[{id:"all",label:locale==="fr"?"Tout":"All"},{id:"favorites",label:locale==="fr"?"Favoris":"Favorites"}]}/>
          <ValidationMessage id="lab-shared-validation">{locale==="fr"?"Exemple de message de validation.":"Example validation message."}</ValidationMessage>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Cartes et panneaux partagés":"Shared cards & panels"}</h3>
          <div className={styles.sharedSurfaceStack}><Card variant="elevated" className={styles.sharedCard}><strong>{locale==="fr"?"Carte élevée":"Elevated card"}</strong><p>{locale==="fr"?"Surface avec élévation légère.":"Surface with subtle elevation."}</p></Card><Card variant="filled" className={styles.sharedCard}><strong>{locale==="fr"?"Carte remplie":"Filled card"}</strong><p>{locale==="fr"?"Surface remplie tonale.":"Tonal filled surface."}</p></Card><Card variant="outlined" className={styles.sharedCard}><strong>{locale==="fr"?"Carte contour":"Outlined card"}</strong><p>{locale==="fr"?"Contour discret, sans ombre.":"Subtle outline, no shadow."}</p></Card></div>
          <Panel className={styles.sharedPanel}><strong>{locale==="fr"?"Panneau":"Panel"}</strong><p>{locale==="fr"?"Conteneur partagé pour regrouper les paramètres.":"Shared container for grouped settings."}</p></Panel>
          <ResultPanel label={locale==="fr"?"Résultat calculé":"Calculated result"} value={result} tone="accent"/>
        </article>
      </div>
    </section>
    <footer className={styles.labFooter}><p>{t.note}</p></footer>
  </main>;
}
