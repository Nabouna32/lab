"use client";
import { useMemo, useState } from "react";
import { Snackbar } from "@/components/ui/Snackbar";
import { ModalBottomSheet } from "@/components/ui/ModalBottomSheet";
import { AlertDialog } from "@/components/ui/AlertDialog";
import { NavigationBar } from "@/components/ui/NavigationBar";
import { NavigationRail } from "@/components/ui/NavigationRail";
import { NavigationDrawer } from "@/components/ui/NavigationDrawer";
import { CircularProgressIndicator } from "@/components/ui/CircularProgressIndicator";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Badge, BadgedBox } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Carousel } from "@/components/ui/Carousel";
import { TopAppBar } from "@/components/ui/TopAppBar";
import { BottomAppBar } from "@/components/ui/BottomAppBar";
import { Scaffold } from "@/components/ui/Scaffold";
import { Divider } from "@/components/ui/Divider";
import { ListItem } from "@/components/ui/ListItem";
import { Chip } from "@/components/ui/Chip";
import { RadioButton } from "@/components/ui/RadioButton";
import { Tabs } from "@/components/ui/Tabs";
import { DatePicker } from "@/components/ui/DatePicker";
import { DatePickerDialog } from "@/components/ui/DatePickerDialog";
import { TimePicker } from "@/components/ui/TimePicker";
import { TimePickerDialog } from "@/components/ui/TimePickerDialog";
import { SearchBar } from "@/components/ui/SearchBar";
import { AppBarWithSearch } from "@/components/ui/AppBarWithSearch";
import { WideNavigationRail } from "@/components/ui/WideNavigationRail";
import { PullToRefreshBox } from "@/components/ui/PullToRefreshBox";
import { BottomSheetScaffold } from "@/components/ui/BottomSheetScaffold";
import { SegmentedButtonGroup } from "@/components/ui/SegmentedButtonGroup";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { SplitButton } from "@/components/ui/SplitButton";
import { MaterialTextField } from "@/components/ui/MaterialTextField";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { SwipeToDismissBox } from "@/components/ui/SwipeToDismissBox";
import { FloatingActionButtonMenu } from "@/components/ui/FloatingActionButtonMenu";
import { Select } from "@/components/ui/Select";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { ToolRuntimeProvider } from "@/components/tools/ToolPage/ToolRuntimeProvider";
import { useTheme } from "@teispace/next-themes";
import type { CSSProperties } from "react";
import styles from "./visual-lab.module.css";
import { MaterialIcon, type MaterialIconName } from "@/components/ui/MaterialIcon";
import { Switch } from "@/components/ui/Switch";
import { Slider } from "@/components/ui/Slider";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Card } from "@/components/ui/Card";
import { Panel } from "@/components/ui/Panel";
import { ResultPanel } from "@/components/ui/ResultPanel";
import { Checkbox } from "@/components/ui/Checkbox";
import { TriStateCheckbox } from "@/components/ui/TriStateCheckbox";
import { TextField } from "@/components/ui/TextField";
import { TextArea } from "@/components/ui/TextArea";
import { ExposedDropdownMenu } from "@/components/ui/ExposedDropdownMenu";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { colorHex, createM3Scheme, seedPresets } from "./m3-theme";

type Locale = "en" | "fr";
type Theme = "light" | "dark";
type Screen = "home" | "explore" | "tool" | "saved" | "profile";
type DesignDirection = "fidelity" | "expressive";
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
    directions:"Android style directions",directionsHelp:"Compare the same phone interface in two directions. These are exploratory interpretations, not official Google screenshots.",pixelDirection:"M3 Fidelity",pixelDirectionHelp:"Référence M3 Fidelity : composants et états selon les sources AndroidX vérifiées.",expressiveDirection:"M3 Expressive",expressiveDirectionHelp:"Variante M3 Expressive : seuls les écarts confirmés par les sources Android sont activés.",directionEyebrow:"Direction preview",directionAction:"Open tool",directionRecent:"Continue where you left off",directionBrowse:"Browse categories",directionBottomHome:"Home",directionBottomExplore:"Explore",directionBottomSaved:"Saved",directionBottomProfile:"Profile",theme:"Theme",style:"Visual language",viewport:"Preview width",roundingDegree:"Corner rounding",roundingDegreeHelp:"0% is square; 100% uses the documented Material Web shape scale. It affects shared/token-based components; legacy mockups are still being migrated.",categorySet:"Category color set",currentSet:"Current seeds",mcuRainbowSet:"Official M3 Rainbow",blueSet:"Blue-forward",categoryStyle:"Category treatment",softStyle:"Soft tint",stripeStyle:"Strong stripe",solidStyle:"Solid color",language:"Preview language",light:"Light",dark:"Dark",classic:"Material 3",expressive:"M3 Expressive",desktop:"Desktop",tablet:"Tablet",mobile:"Mobile",
    home:"Home",explore:"Explore",tool:"Tool page",search:"What do you need to do?",searchButton:"Find a tool",quick:"Popular tasks",welcome:"A toolbox for your next idea",subhead:"Small tasks, useful tools, less friction.",browse:"Explore tools",
    results:"Suggested tools",resultOne:"Percentage calculator",resultTwo:"Image converter",resultThree:"Text cleaner",toolTitle:"Percentage calculator",toolDesc:"Calculate a percentage of any value.",value:"Value",percent:"Percentage",calculate:"Calculate",output:"Your result",
    components:"Component gallery",settings:"Account & preferences",settingsHelp:"Examples of options a user can turn on or off.",syncFavorites:"Sync favorites",syncFavoritesHelp:"Keep your favorites available on your account.",automaticTheme:"Use device theme",automaticThemeHelp:"Follow your phone or computer light/dark setting.",reducedMotion:"Reduce motion",reducedMotionHelp:"Limit non-essential animations.",switchOnLabel:"On",switchOffLabel:"Off",actions:"Buttons · M3 component comparison",buttonFidelity:"M3 Fidelity",buttonExpressive:"M3 Expressive",buttonExpressiveHelp:"Expressive medium-button adaptation: 56 CSS px, full shape at rest and medium corner while pressed. CSS px are not asserted to equal Android dp.",forms:"Forms & selection",surfaces:"Surfaces & feedback",type:"Typography & shape",states:"Interaction states",filled:"Filled",elevated:"Elevated",tonal:"Filled tonal",outlined:"Outlined",textButton:"Text",disabled:"Disabled",focus:"Keyboard focus",motion:"Replay motion",
    email:"Email address",choose:"Choose a category",selected:"Selected",chip:"Image tools",filter:"Filters",tabA:"Overview",tabB:"Details",cardTitle:"A useful result",cardText:"Keep the task clear and the next step obvious.",
    dialogTitle:"Ready to continue?",dialogText:"This is a sample dialog preview, not a real confirmation.",close:"Not now",confirm:"Continue",success:"Everything looks good",warning:"Check this value",error:"Enter a valid email address",
    composition:"Real-world compositions",compositionHelp:"Illustrative layouts using the selected tokens, not screenshots of the current production UI.",contrast:"Contrast review",contrastHelp:"Review computed role pairs before adopting a palette.",wcag:"Material contrast is informative, not a full WCAG audit.",seed:"Source color",sourceColor:"Source color (hex)",sourceColorHelp:"Choose any color or start from a reference preset. Generated roles come from the official Material Color Utilities engine.",invalidSeed:"Enter a valid 3- or 6-digit hex color.",seedPresets:"Reference presets",variant:"Dynamic scheme variant",variantHelp:"Official Material Color Utilities variant; category mapping remains a Loculary-specific choice.",specVersion:"Material spec version",platform:"Target platform",phone:"Phone",watch:"Watch",platform2021:"Platform only affects the 2025 spec; it is ignored for the 2021 spec.",platform2025:"The 2025 spec supports phone and watch platform tuning.",contrastLevel:"Contrast level",normalContrast:"Default · 0",reducedContrast:"Reduced · −1",highContrast:"Higher · 0.5",maxContrast:"Maximum · 1",semanticRoles:"Semantic color roles",rolePairs:"Foreground/background contrast pairs",tonalPalettes:"Generated tonal palettes",typeScale:"Material 3 type scale",typeScaleHelp:"Official M3 role/size conventions, previewed with Roboto.",categorySourceHelp:"All displayed accents are generated with the official MCU Rainbow scheme. The seven hue anchors are Loculary-specific; the actual light/dark colors and foregrounds are generated and contrast-checked by MCU.",mcuRainbowHelp:"Official MCU Rainbow variant applied to each category hue anchor.",
    note:"Nothing here changes Loculary’s production design. This is a decision aid; the final palette and style remain open.",closeDialog:"Close dialog",fieldHelp:"Shape, spacing and type respond to the selected visual language.",actionsHelp:"Use the controls above to compare the same components.",
  },
  fr: {
    eyebrow:"Laboratoire expérimental · hors production",title:"Trouvons la personnalité visuelle de Loculary.",intro:"Compare la même interface de téléphone selon deux pistes inspirées d’Android. Garde uniquement les réglages utiles pour juger le rendu.",categoryColors:"Couleurs d’identité des catégories",categoryColorsHelp:"Les couleurs des catégories restent indépendantes de la couleur de marque. La variante officielle Rainbow de MCU génère leurs teintes et tons ; les aplats utilisent une couleur de texte générée pour rester lisibles.",
    directions:"Pistes de style Android",directionsHelp:"Compare deux interprétations cohérentes du langage visuel Android. Ce sont des pistes d’exploration, pas des captures officielles de Google.",pixelDirection:"M3 Fidelity",pixelDirectionHelp:"Référence M3 Fidelity : composants et états selon les sources AndroidX vérifiées.",expressiveDirection:"M3 Expressive",expressiveDirectionHelp:"Variante M3 Expressive : seuls les écarts confirmés par les sources Android sont activés.",directionEyebrow:"Aperçu de la piste",directionAction:"Ouvrir l’outil",directionRecent:"Reprendre là où tu en étais",directionBrowse:"Parcourir les catégories",directionBottomHome:"Accueil",directionBottomExplore:"Explorer",directionBottomSaved:"Enregistrés",directionBottomProfile:"Profil",theme:"Thème",style:"Langage visuel",viewport:"Largeur d’aperçu",roundingDegree:"Degré d’arrondi",roundingDegreeHelp:"0 % donne des angles droits ; 100 % utilise l’échelle de formes documentée par Material Web. Il agit sur les composants partagés fondés sur les tokens ; les anciennes maquettes sont encore en cours de migration.",categorySet:"Jeu de couleurs des catégories",currentSet:"Sources actuelles",mcuRainbowSet:"Rainbow officiel M3",blueSet:"Dominante bleue",categoryStyle:"Traitement des catégories",softStyle:"Teinte légère",stripeStyle:"Bande franche",solidStyle:"Aplat coloré",language:"Langue de l’aperçu",light:"Clair",dark:"Sombre",classic:"Material 3",expressive:"M3 Expressive",desktop:"Ordinateur",tablet:"Tablette",mobile:"Mobile",
    home:"Accueil",explore:"Explorer",tool:"Page outil",search:"De quoi as-tu besoin ?",searchButton:"Trouver un outil",quick:"Actions populaires",welcome:"Une boîte à outils pour tes idées",subhead:"Des tâches simples, des outils utiles, moins de friction.",browse:"Explorer les outils",
    results:"Outils suggérés",resultOne:"Calcul de pourcentage",resultTwo:"Convertisseur d’image",resultThree:"Nettoyeur de texte",toolTitle:"Calcul de pourcentage",toolDesc:"Calcule un pourcentage de n’importe quelle valeur.",value:"Valeur",percent:"Pourcentage",calculate:"Calculer",output:"Ton résultat",
    components:"Galerie de composants",settings:"Compte et préférences",settingsHelp:"Exemples d’options que l’utilisateur peut activer ou désactiver.",syncFavorites:"Synchroniser les favoris",syncFavoritesHelp:"Retrouver les favoris sur son compte.",automaticTheme:"Suivre le thème de l’appareil",automaticThemeHelp:"Utiliser le mode clair ou sombre du téléphone ou de l’ordinateur.",reducedMotion:"Réduire les animations",reducedMotionHelp:"Limiter les animations non essentielles.",switchOnLabel:"Activé",switchOffLabel:"Désactivé",actions:"Boutons · comparaison des composants M3",buttonFidelity:"M3 Fidelity",buttonExpressive:"M3 Expressive",buttonExpressiveHelp:"Adaptation du bouton Expressive moyen : 56 px CSS, forme pleine au repos et angle moyen à l’appui. Les px CSS ne sont pas présentés comme équivalents aux dp Android.",forms:"Formulaires et choix",surfaces:"Surfaces et retours",type:"Typographie et formes",states:"États d’interaction",filled:"Rempli",elevated:"Surélevé",tonal:"Tonal",outlined:"Contour",textButton:"Texte",disabled:"Désactivé",focus:"Focus clavier",motion:"Rejouer l’animation",
    email:"Adresse e-mail",choose:"Choisir une catégorie",selected:"Sélectionné",chip:"Outils image",filter:"Filtres",tabA:"Aperçu",tabB:"Détails",cardTitle:"Un résultat utile",cardText:"La tâche reste claire et la prochaine étape évidente.",
    dialogTitle:"Prêt à continuer ?",dialogText:"Ceci est un aperçu de dialogue, pas une vraie confirmation.",close:"Pas maintenant",confirm:"Continuer",success:"Tout semble correct",warning:"Vérifie cette valeur",error:"Saisis une adresse e-mail valide",
    composition:"Mises en situation",compositionHelp:"Compositions illustratives avec les tokens sélectionnés, pas des captures de l’interface actuelle.",contrast:"Vérification du contraste",contrastHelp:"Examine les paires de rôles calculées avant d’adopter une palette.",wcag:"Le contraste Material est informatif, pas un audit WCAG complet.",seed:"Couleur source",sourceColor:"Couleur source (hex)",sourceColorHelp:"Choisis n’importe quelle couleur ou pars d’un preset de référence. Les rôles sont générés par le moteur officiel Material Color Utilities.",invalidSeed:"Saisis une couleur hexadécimale valide à 3 ou 6 chiffres.",seedPresets:"Presets de référence",variant:"Variante de schéma dynamique",variantHelp:"Variante officielle de Material Color Utilities ; l’affectation des catégories reste un choix propre à Loculary.",specVersion:"Version de la spécification Material",platform:"Plateforme cible",phone:"Téléphone",watch:"Montre",platform2021:"La plateforme n’influence que la spécification 2025 ; elle est ignorée en 2021.",platform2025:"La spécification 2025 adapte les palettes aux plateformes téléphone et montre.",contrastLevel:"Niveau de contraste",normalContrast:"Défaut · 0",reducedContrast:"Réduit · −1",highContrast:"Renforcé · 0,5",maxContrast:"Maximum · 1",semanticRoles:"Rôles de couleur sémantiques",rolePairs:"Paires premier plan / arrière-plan",tonalPalettes:"Palettes tonales générées",typeScale:"Échelle typographique Material 3",typeScaleHelp:"Conventions officielles des rôles et tailles M3, avec un aperçu en Roboto.",categorySourceHelp:"Tous les accents affichés sont générés par la variante officielle Rainbow de MCU. Les sept points d’ancrage de teinte sont propres à Loculary ; les couleurs clair/sombre et les avant-plans sont générés par MCU puis contrôlés en contraste.",mcuRainbowHelp:"Variante officielle Rainbow de MCU appliquée à chaque point d’ancrage de catégorie.",
    note:"Rien ici ne modifie le design de production de Loculary. C’est un outil d’aide à la décision ; palette et style restent à choisir.",closeDialog:"Fermer le dialogue",fieldHelp:"Formes, espacements et typographie suivent le langage visuel sélectionné.",actionsHelp:"Utilise les contrôles ci-dessus pour comparer les mêmes composants.",
  },
};

type M3Variant = "fidelity" | "expressive";
function ComponentIdentifier({ names, kind = "shared", locale = "fr" }: { names: string[]; kind?: "shared" | "adaptation" | "mockup"; locale?: Locale }) {
  const kindLabel = kind === "shared"
    ? (locale === "fr" ? "Primitive partagée" : "Shared primitive")
    : kind === "adaptation"
      ? (locale === "fr" ? "Adaptation Web" : "Web adaptation")
      : (locale === "fr" ? "Maquette locale" : "Local mockup");
  return <p className={styles.componentIdentifier} data-kind={kind}>
    <span>{kindLabel}</span>
    {names.map((name) => <code key={name}>{name}</code>)}
  </p>;
}
function ComponentVariantControl({ label, value, onChange, expressiveNote }: { label: string; value: M3Variant; onChange: (value: M3Variant) => void; expressiveNote?: string }) {
  return <div className={styles.componentVariantControl}>
    <span>{label}</span>
    <div className={styles.segmented} role="group" aria-label={label}>
      <button type="button" aria-pressed={value==="fidelity"} onClick={()=>onChange("fidelity")}>M3 Fidelity</button>
      <button type="button" aria-pressed={value==="expressive"} onClick={()=>onChange("expressive")}>M3 Expressive</button>
    </div>
    {value==="expressive"&&expressiveNote&&<p className={styles.helper}>{expressiveNote}</p>}
  </div>;
}
function createLabTokens(scheme: ReturnType<typeof createM3Scheme>, theme: Theme, roundingDegree = 100): CSSProperties & Record<string,string> {
  const scale = roundingDegree / 100;
  return {
    "--lab-bg":colorHex(scheme.background),"--lab-surface":colorHex(scheme.surface),"--lab-surface-2":colorHex(scheme.surfaceVariant),
    "--lab-surface-low":colorHex(scheme.surfaceContainerLow),"--lab-surface-container":colorHex(scheme.surfaceContainer),
    "--lab-surface-high":colorHex(scheme.surfaceContainerHigh),"--lab-surface-highest":colorHex(scheme.surfaceContainerHighest),
    "--lab-font":"var(--font-roboto), Roboto, Arial, sans-serif","--lab-text":colorHex(scheme.onSurface),
    "--lab-inverse-surface":colorHex(scheme.inverseSurface),"--lab-inverse-on-surface":colorHex(scheme.inverseOnSurface),
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
    "--shape-corner-none":"0px",
    "--shape-corner-extra-small":`${(4*scale).toFixed(2)}px`,
    "--shape-corner-small":`${(8*scale).toFixed(2)}px`,
    "--shape-corner-medium":`${(12*scale).toFixed(2)}px`,
    "--shape-corner-large":`${(16*scale).toFixed(2)}px`,
    "--shape-corner-extra-large":`${(28*scale).toFixed(2)}px`,
    "--shape-corner-full":"9999px",
    "--lab-radius":`${(16*scale).toFixed(2)}px`,"--lab-radius-small":`${(8*scale).toFixed(2)}px`,"--lab-motion":"180ms",
  } as CSSProperties & Record<string,string>;
}
export default function VisualLab({ initialLocale }: { initialLocale: string }) {
  const locale: Locale = initialLocale==="fr"?"fr":"en";
  const { resolvedTheme } = useTheme();
  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";
  const [screen,setScreen]=useState<Screen>("home");
  const [navigationSelection,setNavigationSelection]=useState<"home"|"explore"|"saved"|"profile">("home");
  const [direction,setDirection]=useState<DesignDirection>("fidelity");
  const [buttonVariant,setButtonVariant]=useState<"fidelity"|"expressive">("fidelity");
  const [iconButtonVariant,setIconButtonVariant]=useState<"fidelity"|"expressive">("fidelity");
  const [sampleIconSelected,setSampleIconSelected]=useState(false);
  const [checkboxVariant,setCheckboxVariant]=useState<M3Variant>("fidelity");
  const [switchVariant,setSwitchVariant]=useState<M3Variant>("fidelity");
  const [textFieldVariant,setTextFieldVariant]=useState<M3Variant>("fidelity");
  const [textAreaVariant,setTextAreaVariant]=useState<M3Variant>("fidelity");
  const [selectVariant,setSelectVariant]=useState<M3Variant>("fidelity");
  const [sampleFormat,setSampleFormat]=useState("png");
  const [seed,setSeed]=useState("#4285F4");
  const [paletteOpen,setPaletteOpen]=useState(false);
  const [viewport,setViewport]=useState<"desktop"|"tablet"|"mobile">("mobile");
  const [roundingDegree,setRoundingDegree]=useState(100);
  const [dialogOpen,setDialogOpen]=useState(true);
  const [motionReplay,setMotionReplay]=useState(0);
  const [snackbarOpen,setSnackbarOpen]=useState(false);
  const [snackbarVariant,setSnackbarVariant]=useState<M3Variant>("fidelity");
  const [bottomSheetOpen,setBottomSheetOpen]=useState(false);
  const [alertDialogOpen,setAlertDialogOpen]=useState(false);
  const [sampleChecked,setSampleChecked]=useState(true);
  const [sampleTriState,setSampleTriState]=useState<"off"|"on"|"indeterminate">("indeterminate");
  const [sampleProgress,setSampleProgress]=useState(55);
  const [sampleRange,setSampleRange]=useState<[number,number]>([20,80]);
  const [sampleToggleFilled,setSampleToggleFilled]=useState(false);
  const [sampleToggleTonal,setSampleToggleTonal]=useState(true);
  const [sampleToggleOutlined,setSampleToggleOutlined]=useState(false);
  const [sampleToggleElevated,setSampleToggleElevated]=useState(false);
  const [sampleM3Email,setSampleM3Email]=useState("bonjour@loculary.com");
  const [sampleM3Password,setSampleM3Password]=useState("loculary-demo");
  const [sampleDismissed,setSampleDismissed]=useState(false);
  const [sampleFabMenuOpen,setSampleFabMenuOpen]=useState(false);
  const [sampleWideRailExpanded,setSampleWideRailExpanded]=useState(false);
  const [sampleModalWideRailExpanded,setSampleModalWideRailExpanded]=useState(false);
  const [sampleWideRailSelected,setSampleWideRailSelected]=useState("home");
  const [sampleRefreshing,setSampleRefreshing]=useState(false);
  const [sampleRefreshCount,setSampleRefreshCount]=useState(0);
  const [sampleBottomSheetExpanded,setSampleBottomSheetExpanded]=useState(false);
  const [sampleSingleSegment,setSampleSingleSegment]=useState(["week"]);
  const [sampleMultiSegments,setSampleMultiSegments]=useState(["bold","italic"]);
  const [sampleRailSelection,setSampleRailSelection]=useState<"home"|"explore"|"saved">("home");
  const [sampleDrawerOpen,setSampleDrawerOpen]=useState(false);
  const [sampleDrawerSelection,setSampleDrawerSelection]=useState<"home"|"explore"|"saved"|"settings">("home");
  const [sampleRadio,setSampleRadio]=useState("all");
  const [sampleLayout,setSampleLayout]=useState("all");
  const [sampleTab,setSampleTab]=useState("overview");
  const [sampleSecondaryTab,setSampleSecondaryTab]=useState("specifications");
  const [sampleDate,setSampleDate]=useState("");
  const [sampleDateDialogOpen,setSampleDateDialogOpen]=useState(false);
  const [sampleTime,setSampleTime]=useState("09:30");
  const [sampleTimeDialogOpen,setSampleTimeDialogOpen]=useState(false);
  const [sampleSearchQuery,setSampleSearchQuery]=useState("");
  const [sampleSearchSubmitted,setSampleSearchSubmitted]=useState("");
  const [sampleFullSearchQuery,setSampleFullSearchQuery]=useState("");
  const [sampleFullSearchSubmitted,setSampleFullSearchSubmitted]=useState("");
  const [sampleAppBarSearchQuery,setSampleAppBarSearchQuery]=useState("");
  const [sampleAppBarSearchSubmitted,setSampleAppBarSearchSubmitted]=useState("");
  const [sampleDateRange,setSampleDateRange]=useState({start:"",end:""});
  const [sampleFilterSelected,setSampleFilterSelected]=useState(true);
  const [sampleInputChipVisible,setSampleInputChipVisible]=useState(true);
  const [value,setValue]=useState("180");
  const [percent,setPercent]=useState("25");
  const [preferences,setPreferences]=useState({syncFavorites:true,automaticTheme:false,reducedMotion:false});
  const t=copy[locale];
  const scheme=useMemo(()=>createM3Scheme(seed,"fidelity",theme==="dark",0,"2025","phone"),[theme,seed]);
  const tokens=useMemo(()=>createLabTokens(scheme,theme,roundingDegree),[scheme,theme,roundingDegree]);
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
          {(["fidelity","expressive"] as const).map(item=><button key={item} type="button" role="tab" aria-selected={direction===item} onClick={()=>setDirection(item)}>{t[item==="fidelity"?"pixelDirection":"expressiveDirection"]}</button>)}
        </div>
      </div>
      <p className={styles.directionHelp}>{t[direction==="fidelity"?"pixelDirectionHelp":"expressiveDirectionHelp"]}</p>
      <div className={styles.controlRow}>
        
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
      <div className={styles.roundingControl}>
        <Slider
          inputId="lab-rounding-degree"
          label={t.roundingDegree}
          value={roundingDegree}
          valueLabel={`${roundingDegree}%`}
          min={0}
          max={100}
          step={5}
          onValueChange={setRoundingDegree}
          style={{"--slider-active":"var(--lab-primary)","--slider-inactive":"var(--lab-surface-2)","--slider-label-color":"var(--lab-text)","--slider-value-color":"var(--lab-primary)","--slider-focus-ring":"var(--lab-primary)"}}
        />
        <p className={styles.helper}>{t.roundingDegreeHelp}</p>
      </div>
      <div className={styles.singlePreview} style={createLabTokens(scheme,theme,roundingDegree)}>      <div className={`${styles.directionStage} ${styles["directionViewport_"+viewport]}`} data-direction={direction} data-theme={theme}>
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
              <article className={styles.directionCard}><span className={styles.directionIcon}><LabIcon name="sun" size={22} /></span><div><strong>{t.automaticTheme}</strong><small>{t.automaticThemeHelp}</small></div><button type="button" onClick={()=>setPreferences(current=>({...current,automaticTheme:!current.automaticTheme}))} aria-pressed={preferences.automaticTheme}>{preferences.automaticTheme?t.switchOnLabel:t.switchOffLabel}</button></article>
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
        <NavigationBar
          className={styles.directionBottomNav}
          label={locale==="fr"?"Navigation de l’aperçu":"Preview navigation"}
          selectedKey={screen==="explore"||screen==="saved"||screen==="profile"?screen:"home"}
          onSelect={(key)=>setScreen(key)}
          items={[
            {key:"home",label:t.directionBottomHome,icon:"home"},
            {key:"explore",label:t.directionBottomExplore,icon:"search"},
            {key:"saved",label:t.directionBottomSaved,icon:"favorite"},
            {key:"profile",label:t.directionBottomProfile,icon:"person"},
          ]}
        />
      </div></div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="gallery-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>02 / {t.components}</span><h2 id="gallery-title">{t.components}</h2><p>{t.actionsHelp}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard} data-button-variant={buttonVariant}><h3>{t.actions}</h3><ComponentIdentifier names={["Button","MaterialIcon"]} locale={locale}/><div className={styles.segmentField}><span>{locale==="fr"?"Version du composant":"Component version"}</span><div className={styles.segmented} role="group" aria-label={locale==="fr"?"Version du bouton":"Button version"}><button type="button" aria-pressed={buttonVariant==="fidelity"} onClick={()=>setButtonVariant("fidelity")}>{t.buttonFidelity}</button><button type="button" aria-pressed={buttonVariant==="expressive"} onClick={()=>setButtonVariant("expressive")}>{t.buttonExpressive}</button></div></div>{buttonVariant==="expressive"&&<p className={styles.helper}>{t.buttonExpressiveHelp}</p>}<div className={styles.buttonStack}><Button variant="filled">{t.filled}</Button><Button variant="elevated">{t.elevated}</Button><Button variant="filled-tonal">{t.tonal}</Button><Button variant="outlined">{t.outlined}</Button><Button variant="text">{t.textButton}</Button><Button variant="filled" disabled>{t.disabled}</Button></div><div className={styles.stateSamples}><button type="button" className={styles.focusSample}>{t.focus}</button><button type="button" className={styles.rippleSample} onClick={()=>setMotionReplay(n=>n+1)}>{t.motion}</button></div><p className={styles.helper}>{t.fieldHelp}</p><div key={motionReplay} className={styles.motionDemo} aria-hidden="true"><span><LabIcon name="sparkles" size={18} /></span><span><LabIcon name="check" size={18} /></span><span><LabIcon name="heart" size={18} /></span></div></article>
        <article className={styles.galleryCard}><h3>{t.forms}</h3><ComponentIdentifier names={["TextField (mockup)","ExposedDropdownMenu (mockup)","FilterChip (mockup)","PrimaryTab (mockup)"]} kind="mockup" locale={locale}/><label className={styles.fieldLabel}>{t.email}<input type="email" placeholder="bonjour@loculary.com"/></label><label className={styles.fieldLabel}>{t.choose}<select defaultValue="images"><option value="images">{t.resultTwo}</option><option value="text">{t.resultThree}</option></select></label><div className={styles.chipRow}><button type="button" className={styles.chipSelected}>{t.selected} <MaterialIcon name="check" size={16} /></button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipSecondary:""}`}>{t.chip}</button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipTertiary:""}`}>{t.filter}</button></div><ComponentIdentifier names={["Tab","PrimaryTabRow","SecondaryTabRow","PrimaryScrollableTabRow","SecondaryScrollableTabRow"]} kind="adaptation" locale={locale}/><Tabs ariaLabel={locale==="fr"?"Onglets principaux de démonstration":"Demo primary tabs"} selectedKey={sampleTab} onSelect={setSampleTab} variant="primary" items={[{key:"overview",label:t.tabA,content:<p className={styles.helper}>{locale==="fr"?"Contenu de l’aperçu sélectionné.":"Overview tab selected."}</p>},{key:"details",label:t.tabB,content:<p className={styles.helper}>{locale==="fr"?"Contenu des détails sélectionné.":"Details tab selected."}</p>}]}/><p className={styles.helper}>{locale==="fr"?"Onglets principaux : navigation de premier niveau sous la barre supérieure. Les onglets secondaires servent à organiser une hiérarchie interne.":"Primary tabs organize top-level destinations below the app bar; secondary tabs organize a nested content hierarchy."}</p><Tabs ariaLabel={locale==="fr"?"Onglets secondaires défilants":"Scrollable secondary tabs"} selectedKey={sampleSecondaryTab} onSelect={setSampleSecondaryTab} variant="secondary" scrollable items={[{key:"specifications",label:locale==="fr"?"Spécifications":"Specifications",content:<p className={styles.helper}>{locale==="fr"?"Les paramètres de l’exemple sont regroupés ici.":"Example settings are grouped here."}</p>},{key:"accessibility",label:locale==="fr"?"Accessibilité":"Accessibility",content:<p className={styles.helper}>{locale==="fr"?"Les onglets exposent leur état sélectionné et une navigation clavier par flèches.":"Tabs expose selected state and arrow-key keyboard navigation."}</p>},{key:"motion",label:locale==="fr"?"Mouvement et animation":"Motion & animation",content:<p className={styles.helper}>{locale==="fr"?"L’indicateur est animé ; les transitions sont réduites si le système le demande.":"The indicator animates; transitions are reduced when the system requests it."}</p>},{key:"limitations",label:locale==="fr"?"Limites de l’adaptation Web":"Web adaptation limits",content:<p className={styles.helper}>{locale==="fr"?"Ceci reste une adaptation React/CSS, pas un composant Compose natif.":"This remains a React/CSS adaptation, not a native Compose component."}</p>}]}/>
          <ComponentIdentifier names={["Switch"]} locale={locale}/><ComponentVariantControl label={locale==="fr"?"Version du switch":"Switch version"} value={switchVariant} onChange={setSwitchVariant} expressiveNote={locale==="fr"?"Aucune différence visuelle par défaut propre à Expressive n’a été confirmée pour Switch. Le rendu reste identique ; le mouvement du pouce sera audité séparément.":"No default Expressive-specific visual difference was confirmed for Switch. Rendering stays the same; thumb motion will be audited separately."}/><div className={styles.preferenceList}><div className={styles.preferenceHeading}><h4>{t.settings}</h4><p>{t.settingsHelp}</p></div>
            {([{key:"syncFavorites",title:t.syncFavorites,help:t.syncFavoritesHelp},{key:"automaticTheme",title:t.automaticTheme,help:t.automaticThemeHelp},{key:"reducedMotion",title:t.reducedMotion,help:t.reducedMotionHelp}] as const).map(item=><div className={styles.preferenceRow} key={item.key}><div className={styles.preferenceCopy}><strong id={`lab-pref-label-${item.key}`}>{item.title}</strong><p id={`lab-pref-desc-${item.key}`}>{item.help}</p></div><Switch id={`lab-pref-${item.key}`} label={item.title} aria-labelledby={`lab-pref-label-${item.key}`} aria-describedby={`lab-pref-desc-${item.key}`} checked={preferences[item.key]} onCheckedChange={(checked)=>setPreferences(current=>({...current,[item.key]:checked}))} style={{"--switch-active":"var(--lab-primary)","--switch-on-thumb":"var(--lab-on-primary)","--switch-track":"var(--lab-surface-2)","--switch-thumb":"var(--lab-outline)","--switch-outline":"var(--lab-outline)","--switch-focus-ring":"var(--lab-primary)","--switch-focus-offset":"var(--lab-surface)","--switch-disabled-selected-track":"color-mix(in srgb, var(--lab-text) 12%, transparent)","--switch-disabled-unselected-track":"color-mix(in srgb, var(--lab-surface-highest) 12%, transparent)","--switch-disabled-outline":"color-mix(in srgb, var(--lab-text) 12%, transparent)","--switch-disabled-selected-thumb":"var(--lab-surface)","--switch-disabled-thumb":"color-mix(in srgb, var(--lab-text) 38%, transparent)"}}/><span className={styles.preferenceState}>{preferences[item.key]?t.switchOnLabel:t.switchOffLabel}</span></div>)}
          </div></article>
        <article className={styles.galleryCard}><h3>{t.surfaces}</h3><ComponentIdentifier names={["Card (mockup)","StatusMessage (Loculary-specific)"]} kind="mockup" locale={locale}/><div className={styles.infoCard}><span className={`${styles.cardIcon} ${isMulticolorPalette?styles.accentTertiary:""}`}><LabIcon name="sparkles" /></span><strong>{t.cardTitle}</strong><p>{t.cardText}</p><button type="button" className={styles.textButton}>{t.browse} <MaterialIcon name="arrow_outward" size={16} /></button></div><div className={styles.status} role="status"><LabIcon name="check" size={18} />{t.success}</div><div className={styles.statusWarning}><MaterialIcon name="warning" size={18} />{t.warning}</div><div className={styles.statusError} role="alert"><LabIcon name="close" size={18} />{t.error}</div></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="states-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>03 / {t.states}</span><h2 id="states-title">{t.states}</h2><p>{t.dialogText}</p><ComponentIdentifier names={["Dialog (mockup, non-modal)"]} kind="mockup" locale={locale}/></div><Button type="button" variant="outlined" className={styles.dialogPreviewTrigger} onClick={()=>setDialogOpen(true)}>{t.confirm} · dialog</Button></div>
      {dialogOpen&&<div className={styles.dialogPreview} role="group" aria-label={t.states}><div className={styles.dialogIcon}><MaterialIcon name="stars" size={24} /></div><h3>{t.dialogTitle}</h3><p>{t.dialogText}</p><div><button type="button" className={styles.textButton} onClick={()=>setDialogOpen(false)}>{t.close}</button><button type="button" className={styles.filled} onClick={()=>setDialogOpen(false)}>{t.confirm}</button></div></div>}
    </section>
    <section className={styles.gallerySection} aria-labelledby="android-controls-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>04 / {locale==="fr"?"Contrôles Android":"Android controls"}</span><h2 id="android-controls-title">{locale==="fr"?"Autres composants à tester":"More components to test"}</h2><p>{locale==="fr"?"Contrôles interactifs courants de Material 3.":"Interactive Material 3 controls commonly used in apps."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Sélection et progression":"Selection & progress"}</h3><ComponentIdentifier names={["Checkbox","Slider","RangeSlider","ProgressIndicator"]} locale={locale}/>
          <Checkbox
            inputId="lab-sample-checkbox"
            name="labSample"
            label={locale==="fr"?"Activer cette option":"Enable this option"}
            checked={sampleChecked}
            onCheckedChange={setSampleChecked}
            className={styles.sampleCheck}
            style={{
              "--checkbox-active": "var(--lab-primary)",
              "--checkbox-on-active": "var(--lab-on-primary)",
              "--checkbox-container-shape": `${(2*roundingDegree/100).toFixed(2)}px`,
              "--checkbox-outline": "var(--lab-outline)",
              "--checkbox-surface": "var(--lab-surface)",
              "--checkbox-focus-ring": "var(--lab-primary)",
              "--checkbox-focus-offset": "var(--lab-surface)",
              "--checkbox-label-color": "var(--lab-text)",
              "--checkbox-disabled-active": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--checkbox-disabled-outline": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--checkbox-disabled-icon": "color-mix(in srgb, var(--lab-surface) 38%, transparent)",
              "--checkbox-disabled-label": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
            }}
          />
          <Slider
            inputId="lab-sample-slider"
            label={locale==="fr"?"Niveau":"Level"}
            value={sampleProgress}
            valueLabel={`${sampleProgress}%`}
            min={0}
            max={100}
            step={5}
            onValueChange={setSampleProgress}
            className={styles.sampleSlider}
            style={{
              "--slider-active": "var(--lab-primary)",
              "--slider-inactive": "var(--lab-surface-2)",
              "--slider-label-color": "var(--lab-text)",
              "--slider-value-color": "var(--lab-primary)",
              "--slider-description-color": "var(--lab-muted)",
              "--slider-focus-ring": "var(--lab-primary)",
            }}
          />
          <ComponentIdentifier names={["RangeSlider"]} kind="adaptation" locale={locale}/>
          <RangeSlider inputId="lab-sample-range-slider" label={locale==="fr"?"Plage de valeurs":"Value range"} value={sampleRange} min={0} max={100} step={5} minGap={5} onValueChange={setSampleRange} valueText={(number)=>`${number}%`} style={{"--range-active":"var(--lab-primary)","--range-inactive":"var(--lab-surface-2)","--range-focus":"var(--lab-primary)","--range-label":"var(--lab-primary)"}}/>
          <ProgressIndicator
            label={locale==="fr"?"Progression de démonstration":"Demo progress"}
            value={sampleProgress}
            className={styles.sampleProgress}
            style={{ "--progress-color": "var(--lab-primary)", "--progress-track": "var(--lab-primary-soft)" }}
          />
          <p className={styles.helper}>{locale==="fr"?"Le curseur pilote la barre de progression.":"The slider controls the progress indicator."}</p>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"États désactivés":"Disabled states"}</h3><ComponentIdentifier names={["Checkbox","Switch","Slider"]} locale={locale}/>
          <Checkbox
            inputId="lab-disabled-checkbox"
            label={locale==="fr"?"Option sélectionnée mais indisponible":"Selected but unavailable"}
            checked
            disabled
            onCheckedChange={() => undefined}
            style={{
              "--checkbox-active": "var(--lab-primary)",
              "--checkbox-on-active": "var(--lab-on-primary)",
              "--checkbox-container-shape": `${(2*roundingDegree/100).toFixed(2)}px`,
              "--checkbox-outline": "var(--lab-outline)",
              "--checkbox-surface": "var(--lab-surface)",
              "--checkbox-focus-ring": "var(--lab-primary)",
              "--checkbox-focus-offset": "var(--lab-surface)",
              "--checkbox-label-color": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--checkbox-disabled-active": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--checkbox-disabled-outline": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--checkbox-disabled-icon": "color-mix(in srgb, var(--lab-surface) 38%, transparent)",
              "--checkbox-disabled-label": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
            }}
          />
          <div className={styles.disabledSwitchRow}>
            <span>{locale==="fr"?"Réglage indisponible":"Unavailable setting"}</span>
            <Switch
              id="lab-disabled-switch"
              label={locale==="fr"?"Réglage indisponible":"Unavailable setting"}
              checked
              disabled
              onCheckedChange={() => undefined}
              style={{
                "--switch-active": "var(--lab-primary)",
                "--switch-on-thumb": "var(--lab-on-primary)",
                "--switch-track": "var(--lab-surface-2)",
                "--switch-thumb": "var(--lab-outline)",
                "--switch-outline": "var(--lab-outline)",
                "--switch-focus-ring": "var(--lab-primary)",
                "--switch-focus-offset": "var(--lab-surface)",
                "--switch-disabled-selected-track": "color-mix(in srgb, var(--lab-text) 12%, transparent)",
                "--switch-disabled-unselected-track": "color-mix(in srgb, var(--lab-surface-highest) 12%, transparent)",
                "--switch-disabled-outline": "color-mix(in srgb, var(--lab-text) 12%, transparent)",
                "--switch-disabled-selected-thumb": "var(--lab-surface)",
                "--switch-disabled-thumb": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              }}
            />
          </div>
          <Slider
            inputId="lab-disabled-slider"
            label={locale==="fr"?"Niveau indisponible":"Unavailable level"}
            value={45}
            valueLabel="45%"
            min={0}
            max={100}
            disabled
            onValueChange={() => undefined}
            style={{
              "--slider-active": "var(--lab-primary)",
              "--slider-inactive": "var(--lab-surface-2)",
              "--slider-label-color": "var(--lab-text)",
              "--slider-value-color": "var(--lab-primary)",
              "--slider-focus-ring": "var(--lab-primary)",
              "--slider-disabled-active": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--slider-disabled-inactive": "color-mix(in srgb, var(--lab-text) 12%, transparent)",
              "--slider-disabled-thumb": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
              "--slider-disabled-label": "color-mix(in srgb, var(--lab-text) 38%, transparent)",
            }}
          />
          <p className={styles.helper}>{locale==="fr"?"Les contrôles indisponibles utilisent les rôles désactivés plutôt qu’une simple baisse d’opacité globale.":"Disabled controls use disabled semantic roles instead of globally fading every part."}</p>
        </article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Retour et panneau inférieur":"Feedback & bottom sheet"}</h3><ComponentIdentifier names={["Snackbar","ModalBottomSheet","AlertDialog"]} kind="adaptation" locale={locale}/><ComponentVariantControl label={locale==="fr"?"Version de la snackbar":"Snackbar version"} value={snackbarVariant} onChange={setSnackbarVariant} expressiveNote={locale==="fr"?"La source AndroidX consultée ne confirme pas de différence visuelle par défaut propre à Expressive pour Snackbar : aucun style distinct n’est inventé. La gestion reste une adaptation Web.":"The inspected AndroidX source does not confirm a separate default Expressive Snackbar appearance; no distinct style is invented. Lifecycle remains a Web adaptation."}/><div className={styles.sampleActions}><button type="button" className={styles.tonal} onClick={()=>setSnackbarOpen(true)}>{locale==="fr"?"Afficher une snackbar":"Show snackbar"}</button><button type="button" className={styles.outlined} onClick={()=>setBottomSheetOpen(open=>!open)}>{bottomSheetOpen?(locale==="fr"?"Fermer le panneau":"Close sheet"):(locale==="fr"?"Ouvrir un panneau":"Open bottom sheet")}</button><button type="button" className={styles.outlined} onClick={()=>setAlertDialogOpen(true)}>{locale==="fr"?"Afficher une alerte":"Show alert dialog"}</button></div><ModalBottomSheet open={bottomSheetOpen} title={locale==="fr"?"Actions rapides":"Quick actions"} description={locale==="fr"?"Un panneau modal ancré en bas de l’écran, avec une hiérarchie claire.":"A modal sheet anchored to the bottom of the screen, with a clear content hierarchy."} dismissLabel={locale==="fr"?"Terminé":"Done"} onDismiss={()=>setBottomSheetOpen(false)}><p>{locale==="fr"?"Le contenu principal est bloqué tant que ce panneau modal est ouvert.":"The main content is blocked while this modal sheet is open."}</p></ModalBottomSheet><AlertDialog open={alertDialogOpen} title={locale==="fr"?"Supprimer cet élément ?":"Delete this item?"} description={locale==="fr"?"Cette action de démonstration illustre une confirmation destructive. Aucun élément réel ne sera supprimé.":"This demo illustrates a destructive confirmation. No real item will be deleted."} confirmLabel={locale==="fr"?"Supprimer":"Delete"} dismissLabel={locale==="fr"?"Annuler":"Cancel"} destructive onDismiss={()=>setAlertDialogOpen(false)} onConfirm={()=>setAlertDialogOpen(false)}/><Snackbar open={snackbarOpen} variant={snackbarVariant} message={locale==="fr"?"Préférence enregistrée":"Preference saved"} actionLabel={locale==="fr"?"Détails":"Details"} onAction={()=>setBottomSheetOpen(true)} dismissLabel={locale==="fr"?"Fermer":"Dismiss"} onDismiss={()=>setSnackbarOpen(false)}/><p className={styles.helper}>{locale==="fr"?"Adaptation Web partagée : minuterie sans action, action persistante jusqu’à interaction, fermeture explicite. File d’attente, geste de balayage, insets Scaffold et mouvement Compose restent à auditer.":"Shared Web adaptation: timeout without action, action stays until interaction, explicit dismissal. Queueing, swipe gesture, Scaffold insets and Compose motion remain to be audited."}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="m3-missing-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>05 / ${locale==="fr"?"Bibliothèque M3 étendue":"Extended M3 library"}</span><h2 id="m3-missing-title">{locale==="fr"?"Composants Android à ne pas oublier":"Android components not to miss"}</h2><p>{locale==="fr"?"Une couverture plus large des composants Material 3 courants, avec états sélectionnables et couleurs reliées au thème actif.":"Broader coverage of common Material 3 components, with selectable states and colors linked to the active theme."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Barre supérieure, navigation et action flottante":"Top app bar, navigation & FAB"}</h3><ComponentIdentifier names={["TopAppBar"]} kind="adaptation" locale={locale}/><ComponentIdentifier names={["NavigationRail","FloatingActionButton"]} kind="adaptation" locale={locale}/>
          <TopAppBar title="Loculary" navigationLabel={locale==="fr"?"Ouvrir le menu":"Open menu"} onNavigationClick={()=>setSampleDrawerOpen(true)} actions={<div className={styles.topBarActions}><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Rechercher":"Search"}><MaterialIcon name="search" size={22}/></button><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Notifications":"Notifications"}><BadgedBox badge={<Badge accessibleLabel={locale==="fr"?"Nouvelles notifications":"New notifications"}/>}><MaterialIcon name="notifications" size={22}/></BadgedBox></button></div>}/><div className={styles.topAppBarVariants}><TopAppBar variant="center-aligned" title={locale==="fr"?"Titre centré":"Centered title"} navigationLabel={locale==="fr"?"Retour":"Back"} navigationIcon="arrow_back"/><TopAppBar variant="medium" title={locale==="fr"?"Barre moyenne":"Medium app bar"}/><TopAppBar variant="large" title={locale==="fr"?"Grande barre":"Large app bar"} collapsed={true}/></div>          <div className={styles.fabSpecimen}>
            <h4>{locale==="fr"?"Barre d’application inférieure":"Bottom app bar"}</h4>
            <ComponentIdentifier names={["BottomAppBar"]} kind="adaptation" locale={locale}/>
            <BottomAppBar actions={<div className={styles.topBarActions}>
              <button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Valider":"Confirm"} onClick={()=>setSnackbarOpen(true)}><MaterialIcon name="check" size={22}/></button>
              <button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Modifier":"Edit"} onClick={()=>setSnackbarOpen(true)}><MaterialIcon name="text_fields" size={22}/></button>
              <button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Partager":"Share"} onClick={()=>setSnackbarOpen(true)}><MaterialIcon name="arrow_outward" size={22}/></button>
            </div>} floatingActionButton={<FloatingActionButton size="small" icon="add" ariaLabel={locale==="fr"?"Ajouter":"Add"} onClick={()=>setSnackbarOpen(true)}/>}/>
          </div>
          <div className={styles.fabSpecimen}>
            <h4>{locale==="fr"?"Composition Scaffold":"Scaffold composition"}</h4>
            <ComponentIdentifier names={["Scaffold"]} kind="adaptation" locale={locale}/>
            <Scaffold className={styles.scaffoldPreview}
              topBar={<TopAppBar title={locale==="fr"?"Aperçu":"Preview"} navigationLabel={locale==="fr"?"Menu":"Menu"} onNavigationClick={()=>setSampleDrawerOpen(true)}/>}
              bottomBar={<BottomAppBar actions={<button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Accueil":"Home"}><MaterialIcon name="home" size={22}/></button>}/>}
              floatingActionButton={<FloatingActionButton size="small" icon="add" ariaLabel={locale==="fr"?"Ajouter":"Add"} onClick={()=>setSnackbarOpen(true)}/>}>
              <strong>{locale==="fr"?"Contenu de l’écran":"Screen content"}</strong>
              <p>{locale==="fr"?"Le Scaffold assemble les barres, la navigation et le contenu.":"Scaffold composes app bars, navigation and content."}</p>
            </Scaffold>
          </div>
          <div className={styles.sampleNavigationRow}><NavigationRail label={locale==="fr"?"Navigation de démonstration":"Demo navigation"} selectedKey={sampleRailSelection} onSelect={setSampleRailSelection} items={[{key:"home",label:locale==="fr"?"Accueil":"Home",icon:"home"},{key:"explore",label:locale==="fr"?"Explorer":"Explore",icon:"search"},{key:"saved",label:locale==="fr"?"Enregistrés":"Saved",icon:"collections_bookmark",badge:"3"}]}/><div className={styles.sampleNavDescription}><span className={styles.sampleBadge}>{locale==="fr"?"3 nouveaux":"3 new"}</span><p>{locale==="fr"?"Rail de navigation avec destination active et badge informatif.":"Navigation rail with selected destination and an informative badge."}</p><button type="button" className={styles.sampleFab} aria-label={locale==="fr"?"Ajouter un élément":"Create item"} onClick={()=>setSnackbarOpen(true)}><MaterialIcon name="add" size={24}/></button></div></div>
          <div className={styles.fabSpecimen}>
            <h4>{locale==="fr"?"Badge et ancrage":"Badge and anchoring"}</h4>
            <ComponentIdentifier names={["Badge","BadgedBox"]} kind="adaptation" locale={locale}/>
            <div className={styles.sampleFabVariants}>
              <Badge accessibleLabel={locale==="fr"?"Notification":"Notification"}/>
              <Badge variant="large" content="3" accessibleLabel={locale==="fr"?"3 notifications":"3 notifications"}/>
              <BadgedBox badge={<Badge variant="large" content="8" accessibleLabel={locale==="fr"?"8 messages":"8 messages"}/>}>
                <MaterialIcon name="content_copy" size={24}/>
              </BadgedBox>
            </div>
          </div>
          <div className={styles.fabSpecimen}>
            <h4>{locale==="fr"?"Carrousels":"Carousels"}</h4>
            <ComponentIdentifier names={["HorizontalUncontainedCarousel","HorizontalMultiBrowseCarousel"]} kind="adaptation" locale={locale}/>
            <p className={styles.helper}>{locale==="fr"?"Le défilement horizontal conserve un aperçu de l’élément suivant. Les largeurs variables du mode multi-browse sont une adaptation Web à comparer à AndroidX.":"Horizontal scrolling keeps a preview of the next item. Variable multi-browse widths are a Web adaptation to compare against AndroidX."}</p>
            <Carousel label={locale==="fr"?"Carrousel de navigation":"Browse carousel"} layout="uncontained" itemWidth={190} items={[
              {id:"image",label:locale==="fr"?"Images":"Images",content:<div className={styles.carouselCard}><MaterialIcon name="image" size={28}/><strong>{locale==="fr"?"Outils image":"Image tools"}</strong><span>12 {locale==="fr"?"outils":"tools"}</span></div>},
              {id:"text",label:locale==="fr"?"Texte":"Text",content:<div className={styles.carouselCard}><MaterialIcon name="text_fields" size={28}/><strong>{locale==="fr"?"Outils texte":"Text tools"}</strong><span>8 {locale==="fr"?"outils":"tools"}</span></div>},
              {id:"convert",label:locale==="fr"?"Conversion":"Convert",content:<div className={styles.carouselCard}><MaterialIcon name="sync_alt" size={28}/><strong>{locale==="fr"?"Convertisseurs":"Converters"}</strong><span>6 {locale==="fr"?"outils":"tools"}</span></div>},
            ]}/>
            <Carousel label={locale==="fr"?"Carrousel multi-navigation":"Multi-browse carousel"} layout="multi-browse" itemWidth={190} items={[
              {id:"popular",label:locale==="fr"?"Populaires":"Popular",content:<div className={styles.carouselCard}><MaterialIcon name="star" size={28}/><strong>{locale==="fr"?"Populaires":"Popular"}</strong></div>},
              {id:"recent",label:locale==="fr"?"Récents":"Recent",content:<div className={styles.carouselCard}><MaterialIcon name="restart_alt" size={28}/><strong>{locale==="fr"?"Récents":"Recent"}</strong></div>},
              {id:"saved",label:locale==="fr"?"Favoris":"Favorites",content:<div className={styles.carouselCard}><MaterialIcon name="favorite" size={28}/><strong>{locale==="fr"?"Favoris":"Favorites"}</strong></div>},
              {id:"all",label:locale==="fr"?"Tous":"All",content:<div className={styles.carouselCard}><MaterialIcon name="apps" size={28}/><strong>{locale==="fr"?"Tous les outils":"All tools"}</strong></div>},
            ]}/>
          </div>
          <div className={styles.fabSpecimen}>
            <h4>{locale==="fr"?"Variantes du bouton d’action flottant":"Floating action button variants"}</h4>
            <ComponentIdentifier names={["SmallFloatingActionButton","FloatingActionButton","LargeFloatingActionButton","ExtendedFloatingActionButton"]} kind="adaptation" locale={locale}/>
            <div className={styles.sampleFabVariants}>
              <FloatingActionButton size="small" icon="add" ariaLabel={locale==="fr"?"Ajouter (petit)":"Add (small)"} onClick={()=>setSnackbarOpen(true)}/>
              <FloatingActionButton size="default" icon="add" ariaLabel={locale==="fr"?"Ajouter":"Add"} onClick={()=>setSnackbarOpen(true)}/>
              <FloatingActionButton size="large" icon="add" ariaLabel={locale==="fr"?"Ajouter (grand)":"Add (large)"} onClick={()=>setSnackbarOpen(true)}/>
              <FloatingActionButton size="extended" icon="text_fields" label={locale==="fr"?"Créer un élément":"Create item"} onClick={()=>setSnackbarOpen(true)}/>
            </div>
          </div>
          <div className={styles.drawerSpecimen}>
            <h4>{locale==="fr"?"Panneau de navigation":"Navigation drawer"}</h4>
            <ComponentIdentifier names={["NavigationDrawer","ModalNavigationDrawer (Web adaptation)"]} kind="adaptation" locale={locale}/>
            <p className={styles.helper}>{locale==="fr"?"Le panneau modal gère le scrim, Échap et le confinement du focus.":"Modal drawer supports scrim, Escape and focus containment."}</p>
            <Button variant="outlined" onClick={()=>setSampleDrawerOpen(true)}>{locale==="fr"?"Ouvrir le panneau":"Open drawer"}</Button>
            <NavigationDrawer open={sampleDrawerOpen} onOpenChange={setSampleDrawerOpen}
              label={locale==="fr"?"Navigation de démonstration":"Demo navigation"}
              title={locale==="fr"?"Loculary":"Loculary"}
              selectedKey={sampleDrawerSelection} onSelect={setSampleDrawerSelection}
              items={[
                {key:"home",label:locale==="fr"?"Accueil":"Home",icon:"home",section:locale==="fr"?"Espace principal":"Main"},
                {key:"explore",label:locale==="fr"?"Explorer":"Explore",icon:"search"},
                {key:"saved",label:locale==="fr"?"Enregistrés":"Saved",icon:"favorite"},
                {key:"settings",label:locale==="fr"?"Paramètres":"Settings",icon:"apps",section:locale==="fr"?"Préférences":"Preferences"},
              ]}/>
          </div>
          <p className={styles.helper}>{locale==="fr"?"Barre d’application, boutons icône, badge, rail et FAB.":"App bar, icon buttons, badge, navigation rail and FAB."}</p>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Champs, choix et filtres":"Text fields, choices & filters"}</h3><ComponentIdentifier names={["TextField (mockup)"]} kind="mockup" locale={locale}/><ComponentIdentifier names={["RadioButton"]} kind="adaptation" locale={locale}/><ComponentIdentifier names={["AssistChip","ElevatedAssistChip","FilterChip","ElevatedFilterChip","InputChip","SuggestionChip","ElevatedSuggestionChip"]} kind="adaptation" locale={locale}/>
          <label className={styles.sampleMaterialField}><span>{locale==="fr"?"Nom de l’outil":"Tool name"}</span><input type="text" defaultValue={locale==="fr"?"Convertisseur d’image":"Image converter"} /><small>{locale==="fr"?"Texte d’aide sous le champ":"Supporting text below the field"}</small></label>
          <label className={styles.sampleMaterialField}><span>{locale==="fr"?"Champ avec erreur":"Field with error"}</span><input type="email" aria-invalid="true" defaultValue="adresse-invalide" /><small className={styles.sampleFieldError}>{locale==="fr"?"Saisis une adresse e-mail valide.":"Enter a valid email address."}</small></label>
          <fieldset className={styles.sampleRadioGroup}><legend>{locale==="fr"?"Afficher les éléments":"Show items"}</legend><RadioButton name="lab-filter" value="all" label={locale==="fr"?"Tous":"All"} checked={sampleRadio==="all"} onChange={setSampleRadio}/><RadioButton name="lab-filter" value="favorites" label={locale==="fr"?"Favoris":"Favorites"} checked={sampleRadio==="favorites"} onChange={setSampleRadio}/></fieldset>
          <div className={styles.chipRow}><Chip variant="assist" label={locale==="fr"?"Aide à la tâche":"Task assist"} leadingIcon="info" onClick={()=>setSnackbarOpen(true)}/><Chip variant="elevated-assist" label={locale==="fr"?"Assist élevée":"Elevated assist"} leadingIcon="stars" onClick={()=>setSnackbarOpen(true)}/><Chip variant="filter" label={locale==="fr"?"Filtre sélectionnable":"Selectable filter"} selected={sampleFilterSelected} onSelectedChange={setSampleFilterSelected}/><Chip variant="elevated-filter" label={locale==="fr"?"Filtre élevé":"Elevated filter"} selected={false} onSelectedChange={()=>setSnackbarOpen(true)}/>{sampleInputChipVisible&&<Chip variant="input" label={locale==="fr"?"Image":"Image"} leadingIcon="image" onDismiss={()=>setSampleInputChipVisible(false)}/>}<Chip variant="suggestion" label={locale==="fr"?"Suggestion":"Suggestion"} onClick={()=>setSnackbarOpen(true)}/><Chip variant="elevated-suggestion" label={locale==="fr"?"Suggestion élevée":"Elevated suggestion"} onClick={()=>setSnackbarOpen(true)}/></div>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Listes, séparateurs et menus":"Lists, dividers & menus"}</h3><ComponentIdentifier names={["DropdownMenu","DropdownMenuItem"]} kind="adaptation" locale={locale}/><ComponentIdentifier names={["ListItem","HorizontalDivider","VerticalDivider"]} kind="adaptation" locale={locale}/>
          <ListItem leading={<MaterialIcon name="image" size={24}/>} headline={locale==="fr"?"Convertisseur d’image":"Image converter"} supporting="PNG, JPEG, WebP" overline={locale==="fr"?"Outils image":"Image tools"} trailing={<span>12 <MaterialIcon name="chevron_right" size={20}/></span>} lines={3}/><Divider/><ListItem leading={<MaterialIcon name="text_fields" size={24}/>} headline={locale==="fr"?"Nettoyeur de texte":"Text cleaner"} supporting={locale==="fr"?"Nettoyer et reformater":"Clean and reformat"} trailing={<MaterialIcon name="chevron_right" size={20}/>} lines={2}/><div className={styles.verticalDividerDemo}><span>{locale==="fr"?"Séparateur vertical":"Vertical divider"}</span><Divider orientation="vertical"/></div><DropdownMenu label={locale==="fr"?"Options du composant":"Component options"} triggerLabel={locale==="fr"?"Ouvrir les options du composant":"Open component options"} triggerContent={<><MaterialIcon name="apps" size={18}/>{locale==="fr"?"Options du composant":"Component options"}</>} items={[{key:"edit",label:locale==="fr"?"Modifier":"Edit",leadingIcon:<MaterialIcon name="text_fields" size={18}/>,onSelect:()=>setSnackbarOpen(true)},{key:"duplicate",label:locale==="fr"?"Dupliquer":"Duplicate",leadingIcon:<MaterialIcon name="content_copy" size={18}/>,onSelect:()=>setSnackbarOpen(true),dividerBefore:true},{key:"delete",label:locale==="fr"?"Supprimer":"Delete",leadingIcon:<MaterialIcon name="close" size={18}/>,onSelect:()=>setSnackbarOpen(true)}]}/>
          <div className={styles.sampleIndeterminate}><CircularProgressIndicator label={locale==="fr"?"Chargement indéterminé":"Indeterminate loading"} size={40} strokeWidth={4}/><span>{locale==="fr"?"Chargement indéterminé":"Indeterminate loading"}</span></div><div className={styles.sampleSkeleton}><span/><span/><span/></div><p className={styles.helper}>{locale==="fr"?"Les deux modes circulaires et linéaires sont distincts : valeur réelle ou activité indéterminée.":"Determinate and indeterminate modes are distinct: real progress or activity without a percentage."}</p>
          <div className={styles.sampleTooltipWrap}><ComponentIdentifier names={["PlainTooltip","RichTooltip","TooltipBox"]} kind="adaptation" locale={locale}/><Tooltip content={locale==="fr"?"Ajoute cet outil à tes favoris.":"Add this tool to your favorites."}><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Aide contextuelle":"Contextual help"}><MaterialIcon name="info" size={20}/></button></Tooltip><Tooltip variant="rich" title={locale==="fr"?"Information détaillée":"More information"} content={locale==="fr"?"Les info-bulles enrichies peuvent présenter plusieurs lignes de contexte.":"Rich tooltips can provide several lines of contextual information."}><button type="button" className={styles.sampleIconButton} aria-label={locale==="fr"?"Détails":"Details"}><MaterialIcon name="info" size={20}/></button></Tooltip></div>
        </article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="date-picker-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>06 / {locale==="fr"?"Dates et calendrier":"Dates & calendar"}</span><h2 id="date-picker-title">{locale==="fr"?"Sélecteurs de date":"Date pickers"}</h2><p>{locale==="fr"?"Calendrier, plage de dates et saisie native : les différences entre l’API AndroidX et l’adaptation Web sont explicites.":"Calendar, date range and native input: differences between AndroidX APIs and the Web adaptation are explicit."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Date unique":"Single date"}</h3><ComponentIdentifier names={["DatePicker"]} kind="adaptation" locale={locale}/><DatePicker label={locale==="fr"?"Choisir une date":"Choose a date"} value={sampleDate} onChange={setSampleDate} locale={locale}/><p className={styles.helper}>{locale==="fr"?(sampleDate?("Date sélectionnée : "+sampleDate):"Sélectionnez une date dans le calendrier."):(sampleDate?("Selected date: "+sampleDate):"Select a date in the calendar.")}</p><ComponentIdentifier names={["DatePickerDialog"]} kind="adaptation" locale={locale}/><Button variant="outlined" onClick={()=>setSampleDateDialogOpen(true)}>{locale==="fr"?"Ouvrir le sélecteur modal":"Open modal date picker"}</Button><DatePickerDialog open={sampleDateDialogOpen} title={locale==="fr"?"Choisir une date":"Choose a date"} label={locale==="fr"?"Date de démonstration":"Demo date"} value={sampleDate} rangeValue={sampleDateRange} confirmLabel={locale==="fr"?"Confirmer":"Confirm"} cancelLabel={locale==="fr"?"Annuler":"Cancel"} locale={locale} onConfirm={(selection)=>{if(selection.mode==="single")setSampleDate(selection.value);else setSampleDateRange(selection.value);}} onDismiss={()=>setSampleDateDialogOpen(false)}/></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Plage de dates":"Date range"}</h3><ComponentIdentifier names={["DateRangePicker"]} kind="adaptation" locale={locale}/><DatePicker label={locale==="fr"?"Choisir une plage de dates":"Choose a date range"} mode="range" rangeValue={sampleDateRange} onRangeChange={setSampleDateRange} locale={locale}/><p className={styles.helper}>{locale==="fr"?"Sélectionnez un début, puis une fin.":"Select a start date, then an end date."}</p></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Mode saisie":"Input mode"}</h3><ComponentIdentifier names={["DatePicker (native HTML input wrapper)"]} kind="adaptation" locale={locale}/><DatePicker label={locale==="fr"?"Date de démonstration":"Demo date"} value={sampleDate} onChange={setSampleDate} displayMode="input" locale={locale}/><p className={styles.helper}>{locale==="fr"?"L’interface de saisie dépend du navigateur ; ce n’est pas la boîte de dialogue AndroidX.":"Input UI is browser-native; this is not the AndroidX dialog."}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="time-picker-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>07 / {locale==="fr"?"Sélecteurs d’heure":"Time selection"}</span><h2 id="time-picker-title">{locale==="fr"?"Sélecteurs d’heure":"Time pickers"}</h2><p>{locale==="fr"?"Cadran interactif et saisie de l’heure. La saisie HTML native est clairement distinguée de TimeInput AndroidX.":"Interactive clock dial and time entry. Native HTML input is explicitly distinguished from AndroidX TimeInput."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Cadran":"Dial picker"}</h3><ComponentIdentifier names={["TimePicker"]} kind="adaptation" locale={locale}/><TimePicker label={locale==="fr"?"Choisir une heure":"Choose a time"} value={sampleTime} onChange={setSampleTime} displayMode="dial" is24Hour locale={locale}/><p className={styles.helper}>{locale==="fr"?"Heure sélectionnée : ":"Selected time: "}{sampleTime}</p><ComponentIdentifier names={["TimePickerDialog"]} kind="adaptation" locale={locale}/><Button variant="outlined" onClick={()=>setSampleTimeDialogOpen(true)}>{locale==="fr"?"Ouvrir le sélecteur modal":"Open modal time picker"}</Button><TimePickerDialog open={sampleTimeDialogOpen} title={locale==="fr"?"Choisir une heure":"Choose a time"} label={locale==="fr"?"Heure de démonstration":"Demo time"} value={sampleTime} confirmLabel={locale==="fr"?"Confirmer":"Confirm"} cancelLabel={locale==="fr"?"Annuler":"Cancel"} locale={locale} onConfirm={setSampleTime} onDismiss={()=>setSampleTimeDialogOpen(false)}/></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Saisie de l’heure":"Time input"}</h3><ComponentIdentifier names={["TimeInput (native HTML input wrapper)"]} kind="adaptation" locale={locale}/><TimePicker label={locale==="fr"?"Saisir une heure":"Enter a time"} value={sampleTime} onChange={setSampleTime} displayMode="input" is24Hour locale={locale}/><p className={styles.helper}>{locale==="fr"?"Le navigateur dessine ce contrôle ; il ne reproduit pas le TimeInput AndroidX expérimental.":"The browser renders this control; it does not reproduce the experimental AndroidX TimeInput."}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="search-bar-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>08 / {locale==="fr"?"Recherche":"Search"}</span><h2 id="search-bar-title">{locale==="fr"?"Barre de recherche":"Search bar"}</h2><p>{locale==="fr"?"Recherche repliée, suggestions, clavier et variante plein écran. L’API AndroidX évolue et certaines variantes sont expérimentales.":"Collapsed search, suggestions, keyboard interaction and full-screen variant. The AndroidX API is evolving and some variants are experimental."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Recherche ancrée":"Docked search"}</h3><ComponentIdentifier names={["SearchBar","ExpandedDockedSearchBar"]} kind="adaptation" locale={locale}/><SearchBar label={locale==="fr"?"Rechercher dans les outils":"Search tools"} placeholder={locale==="fr"?"Rechercher un outil":"Search tools"} query={sampleSearchQuery} onQueryChange={setSampleSearchQuery} onSearch={setSampleSearchSubmitted} suggestions={locale==="fr"?["Convertisseur d’images","Compresseur PDF","Calculatrice","Palette de couleurs","Générateur de QR code"]:["Image converter","PDF compressor","Calculator","Color palette","QR code generator"]} locale={locale}/><p className={styles.helper}>{sampleSearchSubmitted?(locale==="fr"?"Recherche envoyée : ":"Submitted search: ")+sampleSearchSubmitted:(locale==="fr"?"Essayez une suggestion ou appuyez sur Entrée.":"Choose a suggestion or press Enter.")}</p></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Recherche plein écran":"Full-screen search"}</h3><ComponentIdentifier names={["ExpandedFullScreenSearchBar"]} kind="adaptation" locale={locale}/><SearchBar label={locale==="fr"?"Recherche plein écran":"Full-screen search"} placeholder={locale==="fr"?"Rechercher dans Loculary":"Search Loculary"} query={sampleFullSearchQuery} onQueryChange={setSampleFullSearchQuery} onSearch={setSampleFullSearchSubmitted} suggestions={locale==="fr"?["Outils récents","Favoris","Paramètres","Historique"]:["Recent tools","Favorites","Settings","History"]} mode="full-screen" locale={locale}/><p className={styles.helper}>{sampleFullSearchSubmitted?(locale==="fr"?"Recherche envoyée : ":"Submitted search: ")+sampleFullSearchSubmitted:(locale==="fr"?"Touchez le champ pour ouvrir l’aperçu plein écran.":"Focus the field to open the full-screen specimen.")}</p></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"AppBarWithSearch":"AppBarWithSearch"}</h3><ComponentIdentifier names={["AppBarWithSearch"]} kind="adaptation" locale={locale}/><AppBarWithSearch title={locale==="fr"?"Recherche Loculary":"Loculary search"} searchLabel={locale==="fr"?"Rechercher dans Loculary":"Search Loculary"} placeholder={locale==="fr"?"Rechercher un outil":"Search tools"} query={sampleAppBarSearchQuery} onQueryChange={setSampleAppBarSearchQuery} onSearch={setSampleAppBarSearchSubmitted} suggestions={locale==="fr"?["Outils récents","Convertisseur d’images","Calculatrice"]:["Recent tools","Image converter","Calculator"]} navigationLabel={locale==="fr"?"Ouvrir la navigation":"Open navigation"} locale={locale}/><p className={styles.helper}>{sampleAppBarSearchSubmitted?(locale==="fr"?"Recherche envoyée : ":"Submitted search: ")+sampleAppBarSearchSubmitted:(locale==="fr"?"Composition Web : barre supérieure + recherche partagée.":"Web composition: top app bar + shared search.")}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="toggle-split-buttons-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>09 / {locale==="fr"?"Boutons de sélection":"Selection buttons"}</span><h2 id="toggle-split-buttons-title">{locale==="fr"?"Boutons bascule et fractionnés":"Toggle & split buttons"}</h2><p>{locale==="fr"?"Nouvelles familles de l’API AndroidX : les boutons bascule représentent un état, les boutons fractionnés regroupent une action principale et une action secondaire.":"Additional AndroidX API families: toggle buttons represent a state; split buttons group a primary and related secondary action."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"ToggleButton — variantes":"ToggleButton variants"}</h3><ComponentIdentifier names={["ToggleButton","FilledTonalToggleButton","OutlinedToggleButton","ElevatedToggleButton"]} kind="adaptation" locale={locale}/><div className={styles.buttonStack}><ToggleButton label={locale==="fr"?"Remplie":"Filled"} checked={sampleToggleFilled} onCheckedChange={setSampleToggleFilled} icon={<MaterialIcon name="check" size={18}/>} variant="filled" size="small"/><ToggleButton label={locale==="fr"?"Tonal":"Tonal"} checked={sampleToggleTonal} onCheckedChange={setSampleToggleTonal} variant="filled-tonal" size="medium"/><ToggleButton label={locale==="fr"?"Contour":"Outlined"} checked={sampleToggleOutlined} onCheckedChange={setSampleToggleOutlined} variant="outlined" size="large"/><ToggleButton label={locale==="fr"?"Élevée":"Elevated"} checked={sampleToggleElevated} onCheckedChange={setSampleToggleElevated} variant="elevated" size="extra-large"/></div><p className={styles.helper}>{locale==="fr"?"La sélection change les couleurs et la forme ; les tailles sont des choix Web inspirés des tailles AndroidX, pas des dp natifs.":"Selection changes color and shape; sizes are Web adaptations inspired by AndroidX sizes, not native dp."}</p></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"SplitButtonLayout":"SplitButtonLayout"}</h3><ComponentIdentifier names={["SplitButtonLayout","FilledSplitButton","TonalSplitButton","ElevatedSplitButton","OutlinedSplitButton"]} kind="adaptation" locale={locale}/><div className={styles.sampleActions}><SplitButton label={locale==="fr"?"Exporter":"Export"} menuLabel={locale==="fr"?"Autres formats d’export":"Other export formats"} icon={<MaterialIcon name="arrow_outward" size={18}/>} variant="filled" onClick={()=>setSnackbarOpen(true)} items={[{label:"PNG",onSelect:()=>setSampleFormat("png")},{label:"JPEG",onSelect:()=>setSampleFormat("jpeg")},{label:"WebP",onSelect:()=>setSampleFormat("webp")}]} /><SplitButton label={locale==="fr"?"Partager":"Share"} menuLabel={locale==="fr"?"Options de partage":"Share options"} variant="outlined" onClick={()=>setSnackbarOpen(true)} items={[{label:locale==="fr"?"Copier le lien":"Copy link",onSelect:()=>setSampleFormat("link")},{label:locale==="fr"?"Enregistrer":"Save",onSelect:()=>setSampleFormat("saved")}]} /></div><p className={styles.helper}>{locale==="fr"?"Le menu est une adaptation Web pour illustrer l’action secondaire ; SplitButtonLayout AndroidX ne fournit pas à lui seul un menu.":"The menu is a Web example for the secondary action; AndroidX SplitButtonLayout itself does not provide a menu."}</p><p className={styles.helper}>{locale==="fr"?"Dernier choix de démonstration : ":"Last demo choice: "}{sampleFormat}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="textfield-family-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>10 / {locale==="fr"?"Champs de saisie":"Text fields"}</span><h2 id="textfield-family-title">{locale==="fr"?"Champs Material 3":"Material 3 text fields"}</h2><p>{locale==="fr"?"Champs remplis, contourés, aide, erreur, compteur et saisie sécurisée. La protection de saisie Web reste différente des garanties AndroidX.":"Filled, outlined, supporting text, error, counter and secure entry. Web input protection remains different from AndroidX guarantees."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"TextField rempli":"Filled TextField"}</h3><ComponentIdentifier names={["TextField"]} kind="adaptation" locale={locale}/><MaterialTextField id="lab-m3-filled-text-field" label={locale==="fr"?"Adresse e-mail":"Email address"} value={sampleM3Email} onChange={setSampleM3Email} variant="filled" type="email" supportingText={locale==="fr"?"Utilisée uniquement dans cette démonstration.":"Used only in this demo."} maxLength={64} showCharacterCount/></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"OutlinedTextField avec erreur":"OutlinedTextField with error"}</h3><ComponentIdentifier names={["OutlinedTextField"]} kind="adaptation" locale={locale}/><MaterialTextField id="lab-m3-outlined-text-field" label={locale==="fr"?"Nom d’utilisateur":"Username"} value={sampleM3Email} onChange={setSampleM3Email} variant="outlined" error={sampleM3Email.includes("@")?(locale==="fr"?"Saisissez un nom, pas une adresse e-mail.":"Enter a username, not an email address."):undefined} supportingText={locale==="fr"?"Exemple de validation dynamique.":"Dynamic validation example."}/></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"SecureTextField":"SecureTextField"}</h3><ComponentIdentifier names={["SecureTextField","OutlinedSecureTextField"]} kind="adaptation" locale={locale}/><MaterialTextField id="lab-m3-secure-filled" label={locale==="fr"?"Mot de passe":"Password"} value={sampleM3Password} onChange={setSampleM3Password} variant="filled" secure supportingText={locale==="fr"?"Champ de démonstration uniquement ; ne saisissez aucun vrai mot de passe.":"Demo field only; do not enter a real password."}/><MaterialTextField id="lab-m3-secure-outlined" label={locale==="fr"?"Confirmer le mot de passe":"Confirm password"} value={sampleM3Password} onChange={setSampleM3Password} variant="outlined" secure/></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="gesture-components-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>11 / {locale==="fr"?"Gestes et interaction":"Gestures & interaction"}</span><h2 id="gesture-components-title">{locale==="fr"?"Balayage pour ignorer":"Swipe to dismiss"}</h2><p>{locale==="fr"?"Le geste horizontal est accompagné d’une action accessible au clavier, car le balayage ne doit jamais être le seul moyen d’effectuer l’action.":"Horizontal swipe is paired with a keyboard-accessible action, because swiping must not be the only way to perform the action."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"SwipeToDismissBox":"SwipeToDismissBox"}</h3><ComponentIdentifier names={["SwipeToDismissBox"]} kind="adaptation" locale={locale}/>{sampleDismissed?<div className={styles.helper}>{locale==="fr"?"Élément ignoré.":"Item dismissed."}<Button variant="outlined" onClick={()=>setSampleDismissed(false)}>{locale==="fr"?"Rétablir":"Restore"}</Button></div>:<SwipeToDismissBox dismissLabel={locale==="fr"?"Ignorer la notification":"Dismiss notification"} onDismiss={()=>setSampleDismissed(true)}><div><strong>{locale==="fr"?"Nouvelle mise à jour disponible":"New update available"}</strong><p>{locale==="fr"?"Balayez ou utilisez le bouton × pour ignorer cet élément.":"Swipe or use the × button to dismiss this item."}</p></div></SwipeToDismissBox>}</article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Menu de boutons flottants":"Floating action button menu"}</h3><ComponentIdentifier names={["FloatingActionButtonMenu","FloatingActionButtonMenuItem","ToggleFloatingActionButton"]} kind="adaptation" locale={locale}/><FloatingActionButtonMenu expanded={sampleFabMenuOpen} onExpandedChange={setSampleFabMenuOpen} label={locale==="fr"?"Actions rapides":"Quick actions"} addLabel={locale==="fr"?"Ajouter":"Add"} closeLabel={locale==="fr"?"Fermer les actions":"Close actions"} items={[{key:"image",label:locale==="fr"?"Convertir une image":"Convert image",icon:<MaterialIcon name="image" size={20}/>,onSelect:()=>setSampleFormat("png")},{key:"text",label:locale==="fr"?"Nettoyer du texte":"Clean text",icon:<MaterialIcon name="text_fields" size={20}/>,onSelect:()=>setSampleFormat("text")},{key:"calculate",label:locale==="fr"?"Calculer":"Calculate",icon:<MaterialIcon name="calculate" size={20}/>,onSelect:()=>setSampleFormat("calculator")}]}/><p className={styles.helper}>{locale==="fr"?"Les éléments apparaissent avec un léger décalage animé ; Échap ferme le menu. API AndroidX récente, version à vérifier.":"Items appear with staggered motion; Escape closes the menu. This is a newer AndroidX API; verify the pinned version."}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="pull-to-refresh-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>13 / {locale==="fr"?"Actualisation":"Refresh interaction"}</span><h2 id="pull-to-refresh-title">{locale==="fr"?"Tirer pour actualiser":"Pull to refresh"}</h2><p>{locale==="fr"?"Geste de tirage, état d’actualisation et action de remplacement accessible. Le comportement de défilement natif doit être vérifié sur appareil.":"Pull gesture, refresh state and an accessible alternative action. Native scrolling behavior must be tested on device."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"PullToRefreshBox":"PullToRefreshBox"}</h3><ComponentIdentifier names={["PullToRefreshBox"]} kind="adaptation" locale={locale}/><PullToRefreshBox isRefreshing={sampleRefreshing} onRefresh={()=>{setSampleRefreshCount((count)=>count+1);setSampleRefreshing(true);}} refreshLabel={locale==="fr"?"Actualisation…":"Refreshing…"} refreshNowLabel={locale==="fr"?"Actualiser maintenant":"Refresh now"}><div><strong>{locale==="fr"?"Éléments récents":"Recent items"}</strong><p>{locale==="fr"?"Tirez vers le bas dans cette zone ou utilisez le bouton d’actualisation.":"Pull down in this area or use the refresh button."}</p><p>{locale==="fr"?"Actualisations déclenchées : ":"Refreshes triggered: "}{sampleRefreshCount}</p><p>{locale==="fr"?"Ligne de contenu 1 · Ligne de contenu 2 · Ligne de contenu 3":"Content row 1 · Content row 2 · Content row 3"}</p></div></PullToRefreshBox><Button variant="outlined" disabled={!sampleRefreshing} onClick={()=>setSampleRefreshing(false)}>{locale==="fr"?"Terminer l’actualisation de démonstration":"Finish demo refresh"}</Button></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="wide-navigation-rail-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>12 / {locale==="fr"?"Navigation adaptative":"Adaptive navigation"}</span><h2 id="wide-navigation-rail-title">{locale==="fr"?"Rail de navigation large":"Wide navigation rail"}</h2><p>{locale==="fr"?"Variantes standard et modale du rail large. Les APIs sont récentes : leur disponibilité dépend de la version AndroidX retenue.":"Standard and modal wide-rail variants. These are newer APIs; availability depends on the selected AndroidX version."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"WideNavigationRail standard":"Standard WideNavigationRail"}</h3><ComponentIdentifier names={["WideNavigationRail","WideNavigationRailItem"]} kind="adaptation" locale={locale}/><WideNavigationRail items={[{key:"home",label:locale==="fr"?"Accueil":"Home",icon:"home"},{key:"search",label:locale==="fr"?"Recherche":"Search",icon:"search"},{key:"saved",label:locale==="fr"?"Favoris":"Saved",icon:"favorite"},{key:"profile",label:locale==="fr"?"Profil":"Profile",icon:"person"}]} selectedKey={sampleWideRailSelected} onSelect={setSampleWideRailSelected} expanded={sampleWideRailExpanded} onExpandedChange={setSampleWideRailExpanded} label={locale==="fr"?"Navigation principale":"Primary navigation"} expandLabel={locale==="fr"?"Développer le rail":"Expand rail"} collapseLabel={locale==="fr"?"Réduire le rail":"Collapse rail"} closeLabel={locale==="fr"?"Fermer le rail":"Close rail"}/></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"ModalWideNavigationRail":"ModalWideNavigationRail"}</h3><ComponentIdentifier names={["ModalWideNavigationRail"]} kind="adaptation" locale={locale}/><p className={styles.helper}>{locale==="fr"?"Développez le rail pour voir le scrim modal et tester Échap.":"Expand the rail to see its modal scrim and test Escape."}</p><WideNavigationRail items={[{key:"home",label:locale==="fr"?"Accueil":"Home",icon:"home"},{key:"search",label:locale==="fr"?"Recherche":"Search",icon:"search"},{key:"saved",label:locale==="fr"?"Favoris":"Saved",icon:"favorite"},{key:"profile",label:locale==="fr"?"Profil":"Profile",icon:"person"}]} selectedKey={sampleWideRailSelected} onSelect={setSampleWideRailSelected} expanded={sampleModalWideRailExpanded} onExpandedChange={setSampleModalWideRailExpanded} mode="modal" label={locale==="fr"?"Navigation modale":"Modal navigation"} expandLabel={locale==="fr"?"Développer le rail modal":"Expand modal rail"} collapseLabel={locale==="fr"?"Réduire le rail modal":"Collapse modal rail"} closeLabel={locale==="fr"?"Fermer le rail modal":"Close modal rail"}/></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="bottom-sheet-scaffold-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>14 / {locale==="fr"?"Feuilles inférieures":"Bottom sheets"}</span><h2 id="bottom-sheet-scaffold-title">{locale==="fr"?"BottomSheetScaffold":"BottomSheetScaffold"}</h2><p>{locale==="fr"?"Feuille persistante repliable ou développée, avec action clavier et geste vertical sur la poignée.":"Persistent sheet with collapsed/expanded states, keyboard action and vertical drag on the handle."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><ComponentIdentifier names={["BottomSheetScaffold"]} kind="adaptation" locale={locale}/><BottomSheetScaffold title={locale==="fr"?"Détails de l’élément":"Item details"} expanded={sampleBottomSheetExpanded} onExpandedChange={setSampleBottomSheetExpanded} collapsedLabel={locale==="fr"?"Développer les détails":"Expand details"} expandedLabel={locale==="fr"?"Réduire les détails":"Collapse details"} content={<><strong>{locale==="fr"?"Contenu principal":"Main content"}</strong><p>{locale==="fr"?"La feuille est ancrée en bas de ce conteneur.":"The sheet is anchored to the bottom of this container."}</p></>} sheetContent={<><p>{locale==="fr"?"Informations complémentaires et actions liées à l’élément.":"Additional information and related actions."}</p><Button variant="outlined" onClick={()=>setSampleBottomSheetExpanded(false)}>{locale==="fr"?"Fermer":"Close"}</Button></>}/></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="segmented-button-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>15 / {locale==="fr"?"Choix segmentés":"Segmented choices"}</span><h2 id="segmented-button-title">{locale==="fr"?"Boutons segmentés":"Segmented buttons"}</h2><p>{locale==="fr"?"Choix unique et choix multiple selon les familles officielles SingleChoiceSegmentedButtonRow et MultiChoiceSegmentedButtonRow.":"Single- and multi-selection variants following the official SingleChoiceSegmentedButtonRow and MultiChoiceSegmentedButtonRow families."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Choix unique":"Single choice"}</h3><ComponentIdentifier names={["SegmentedButton","SingleChoiceSegmentedButtonRow"]} kind="adaptation" locale={locale}/><SegmentedButtonGroup label={locale==="fr"?"Période":"Period"} mode="single" selectedKeys={sampleSingleSegment} onSelectionChange={setSampleSingleSegment} options={[{key:"day",label:locale==="fr"?"Jour":"Day"},{key:"week",label:locale==="fr"?"Semaine":"Week"},{key:"month",label:locale==="fr"?"Mois":"Month"}]}/><p className={styles.helper}>{locale==="fr"?"Choix actuel : ":"Current selection: "}{sampleSingleSegment[0]??"—"}</p></article>
        <article className={styles.galleryCard}><h3>{locale==="fr"?"Choix multiple":"Multi choice"}</h3><ComponentIdentifier names={["SegmentedButton","MultiChoiceSegmentedButtonRow"]} kind="adaptation" locale={locale}/><SegmentedButtonGroup label={locale==="fr"?"Mise en forme":"Formatting"} mode="multi" selectedKeys={sampleMultiSegments} onSelectionChange={setSampleMultiSegments} options={[{key:"bold",label:locale==="fr"?"Gras":"Bold"},{key:"italic",label:locale==="fr"?"Italique":"Italic"},{key:"underline",label:locale==="fr?"Souligné":"Underline"}]}/><p className={styles.helper}>{locale==="fr"?"Sélection : ":"Selected: "}{sampleMultiSegments.join(", ")||"—"}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="shared-components-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>06 / ${locale==="fr"?"Composants partagés":"Shared primitives"}</span><h2 id="shared-components-title">{locale==="fr"?"Composants réels de Loculary":"Loculary shared components"}</h2><p>{locale==="fr"?"Aperçu direct des primitives partagées du site, reliées aux mêmes tokens du thème actif.":"Live samples of the site's shared UI primitives, wired to the same active theme tokens."}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Boutons et boutons icône":"Buttons & icon buttons"}</h3><ComponentIdentifier names={["Button","IconButton"]} locale={locale}/>
          <div className={styles.buttonStack}><Button variant="filled">{locale==="fr"?"Rempli":"Filled"}</Button><Button variant="elevated">{locale==="fr"?"Surélevé":"Elevated"}</Button><Button variant="filled-tonal">{locale==="fr"?"Tonal":"Filled tonal"}</Button><Button variant="outlined">{locale==="fr"?"Contour":"Outlined"}</Button><Button variant="text">{locale==="fr"?"Texte":"Text"}</Button><Button variant="danger">{locale==="fr"?"Destructif":"Danger"}</Button></div>
          <div className={styles.iconButtonComparison} data-icon-button-variant={iconButtonVariant}><div className={styles.segmentField}><span>{locale==="fr"?"Version du bouton icône":"Icon button version"}</span><div className={styles.segmented} role="group" aria-label={locale==="fr"?"Version du bouton icône":"Icon button version"}><button type="button" aria-pressed={iconButtonVariant==="fidelity"} onClick={()=>setIconButtonVariant("fidelity")}>{locale==="fr"?"M3 Fidelity":"M3 Fidelity"}</button><button type="button" aria-pressed={iconButtonVariant==="expressive"} onClick={()=>setIconButtonVariant("expressive")}>{locale==="fr"?"M3 Expressive":"M3 Expressive"}</button></div></div>{iconButtonVariant==="expressive"&&<p className={styles.helper}>{locale==="fr"?"Aperçu moyen Expressive : 56 px CSS, icône 24 px, forme pleine au repos, forme moyenne à l’appui et forme large à l’état sélectionné. Adaptation Web, pas équivalence dp.":"Expressive medium preview: 56 CSS px, 24 px icon, full shape at rest, medium pressed shape and large selected shape. Web adaptation, not dp equivalence."}</p>}<div className={styles.buttonStack}><IconButton label={locale==="fr"?"Favoris":"Favorites"} variant="standard" selected={sampleIconSelected} onClick={()=>setSampleIconSelected(value=>!value)}><MaterialIcon name="favorite" size={24}/></IconButton><IconButton label={locale==="fr"?"Ajouter":"Add"} variant="filled"><MaterialIcon name="add" size={24}/></IconButton><IconButton label={locale==="fr"?"Rechercher":"Search"} variant="filled-tonal"><MaterialIcon name="search" size={24}/></IconButton><IconButton label={locale==="fr"?"Plus d’options":"More options"} variant="outlined"><MaterialIcon name="apps" size={24}/></IconButton></div></div>
          <p className={styles.helper}>{locale==="fr"?"Primitives de production Button et IconButton, pas des imitations locales.":"Production Button and IconButton primitives, not local lookalikes."}</p>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Champs et sélection partagés":"Shared fields & selection"}</h3><ComponentIdentifier names={["TextField"]} locale={locale}/><ComponentIdentifier names={["TextArea (Web wrapper)","ExposedDropdownMenu"]} kind="adaptation" locale={locale}/>
          <ComponentVariantControl label={locale==="fr"?"Version du champ de texte":"TextField version"} value={textFieldVariant} onChange={setTextFieldVariant} expressiveNote={locale==="fr"?"Variante Expressive sourcée : libellé intégré/flottant, surface tonale et forme arrondie. C’est une adaptation Web ; les px CSS ne sont pas des dp.":"Source-backed Expressive variant: floating inside label, tonal surface and rounded shape. This is a Web adaptation; CSS px are not dp."}/><div className={styles.sharedFieldStack}><TextField inputId="lab-shared-text-field" label={locale==="fr"?"Valeur":"Value"} defaultValue="180" type="number" unit="px" variant={textFieldVariant}/><ComponentVariantControl label={locale==="fr"?"Version du champ multiligne":"Multiline field version"} value={textAreaVariant} onChange={setTextAreaVariant} expressiveNote={locale==="fr"?"Le composant Android correspondant est TextField avec minLines/maxLines, pas un composant distinct nommé TextArea. Le composant Web partagé expose désormais les deux variantes, mais l’anatomie, la hauteur de spécification et le comportement Compose restent à valider ; sa hauteur minimale actuelle est un choix de spécimen Web, pas un token Android.":"The Android counterpart is TextField with minLines/maxLines, not a distinct component named TextArea. The shared Web component now exposes both variants, but anatomy, specified height and Compose behavior remain to be validated; its current minimum height is a Web specimen choice, not an Android token."}/><TextArea inputId="lab-shared-text-area" label={locale==="fr"?"Description":"Description"} variant={textAreaVariant} rows={3} defaultValue={locale==="fr"?"Un exemple de zone de texte partagée.":"An example of the shared multiline field."} className={styles.sharedTextArea}/><ComponentVariantControl label={locale==="fr"?"Version du menu déroulant":"Exposed dropdown version"} value={selectVariant} onChange={setSelectVariant} expressiveNote={locale==="fr"?"Composant partagé désormais inspiré de l’API AndroidX ExposedDropdownMenuBox, avec combobox/listbox, navigation clavier et fermeture. Cela reste une adaptation Web : popup/insets, mouvement Compose et tests d’accessibilité doivent encore être vérifiés.":"Shared component now informed by AndroidX ExposedDropdownMenuBox, with combobox/listbox semantics, keyboard navigation and dismissal. It remains a Web adaptation: popup/insets, Compose motion and accessibility tests still need verification."}/><ExposedDropdownMenu id="lab-shared-select" label={locale==="fr"?"Format":"Format"} value={sampleFormat} onChange={setSampleFormat} variant={selectVariant} options={[{value:"png",label:"PNG"},{value:"webp",label:"WebP"},{value:"jpeg",label:"JPEG"}]}/>
            <ComponentIdentifier names={["Select (native HTML wrapper)"]} kind="shared" locale={locale}/>
            <Select id="lab-native-select" label={locale==="fr"?"Format natif":"Native format"} value={sampleFormat} onChange={(event)=>setSampleFormat(event.target.value)}>
              <option value="png">PNG</option><option value="webp">WebP</option><option value="jpeg">JPEG</option>
            </Select>
            <ComponentIdentifier names={["ClearButton"]} locale={locale}/><ClearButton label={locale==="fr"?"Réinitialiser le format":"Reset format"} onClear={()=>setSampleFormat("png")}/><ComponentIdentifier names={["CopyButton"]} locale={locale}/><ToolRuntimeProvider access="anonymous" capabilities={["clipboard"]}><CopyButton value={sampleFormat} label={locale==="fr"?"Copier le format":"Copy format"} copiedLabel={locale==="fr"?"Format copié":"Format copied"}/></ToolRuntimeProvider>
          </div>
          <ComponentIdentifier names={["Checkbox"]} locale={locale}/><ComponentVariantControl label={locale==="fr"?"Version de la case à cocher":"Checkbox version"} value={checkboxVariant} onChange={setCheckboxVariant} expressiveNote={locale==="fr"?"Aucune différence de rendu par défaut propre à Expressive n’a été confirmée dans la source Checkbox consultée : le composant reste identique, sans variation inventée.":"No default Expressive-specific rendering difference was confirmed in the inspected Checkbox source; the component stays the same rather than inventing a variation."}/><Checkbox inputId="lab-shared-checkbox" checked={sampleChecked} onCheckedChange={setSampleChecked} label={locale==="fr"?"Inclure les sous-catégories":"Include subcategories"}/><ComponentIdentifier names={["TriStateCheckbox"]} kind="adaptation" locale={locale}/><TriStateCheckbox inputId="lab-shared-tristate-checkbox" state={sampleTriState} onStateChange={setSampleTriState} label={locale==="fr"?"Sélection partielle des sous-catégories":"Some subcategories selected"}/>
          <ComponentIdentifier names={["SegmentedControl"]} locale={locale}/><SegmentedControl ariaLabel={locale==="fr"?"Disposition de la liste":"List layout"} value={sampleLayout} onChange={setSampleLayout} items={[{id:"all",label:locale==="fr"?"Tout":"All"},{id:"favorites",label:locale==="fr"?"Favoris":"Favorites"}]}/>
          <ComponentIdentifier names={["ValidationMessage"]} locale={locale}/><ValidationMessage id="lab-shared-validation" role={null}>{locale==="fr"?"Exemple de message de validation.":"Example validation message."}</ValidationMessage>
        </article>
        <article className={styles.galleryCard}>
          <h3>NavigationBar</h3>
          <ComponentIdentifier names={["NavigationBar"]} kind="adaptation" locale={locale}/>
          <NavigationBar
            label={locale==="fr"?"Destinations de démonstration":"Demo destinations"}
            selectedKey={navigationSelection}
            onSelect={setNavigationSelection}
            items={[
              {key:"home",label:locale==="fr"?"Accueil":"Home",icon:"home"},
              {key:"explore",label:locale==="fr"?"Explorer":"Explore",icon:"search"},
              {key:"saved",label:locale==="fr"?"Enregistrés":"Saved",icon:"favorite"},
              {key:"profile",label:locale==="fr"?"Profil":"Profile",icon:"person"},
            ]}
          />
          <p className={styles.helper}>{locale==="fr"?"Choisis une destination pour tester l’état sélectionné. Primitive Web partagée ; ce n’est pas un composant AndroidX natif.":"Choose a destination to test selected state. Shared Web primitive; not a native AndroidX component."}</p>
        </article>
        <article className={styles.galleryCard}>
          <h3>{locale==="fr"?"Cartes et panneaux partagés":"Shared cards & panels"}</h3><ComponentIdentifier names={["Card","Panel","ResultPanel"]} locale={locale}/>
          <div className={styles.sharedSurfaceStack}><Card variant="elevated" className={styles.sharedCard}><strong>{locale==="fr"?"Carte élevée":"Elevated card"}</strong><p>{locale==="fr"?"Surface avec élévation légère.":"Surface with subtle elevation."}</p></Card><Card variant="filled" className={styles.sharedCard}><strong>{locale==="fr"?"Carte remplie":"Filled card"}</strong><p>{locale==="fr"?"Surface remplie tonale.":"Tonal filled surface."}</p></Card><Card variant="outlined" className={styles.sharedCard}><strong>{locale==="fr"?"Carte contour":"Outlined card"}</strong><p>{locale==="fr"?"Contour discret, sans ombre.":"Subtle outline, no shadow."}</p></Card></div>
          <Panel className={styles.sharedPanel}><strong>{locale==="fr"?"Panneau":"Panel"}</strong><p>{locale==="fr"?"Conteneur partagé pour regrouper les paramètres.":"Shared container for grouped settings."}</p></Panel>
          <ResultPanel label={locale==="fr"?"Résultat calculé":"Calculated result"} value={result} tone="accent"/>
        </article>
      </div>
    </section>
    <footer className={styles.labFooter}><p>{t.note}</p></footer>
  </main>;
}
