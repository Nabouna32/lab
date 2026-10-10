"use client";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./visual-lab.module.css";
import {
  colorHex,
  createM3Scheme,
  getRolePairs,
  getSemanticRoles,
  getTonalPalettes,
  normalizeHexSeed,
  schemeVariants,
  seedPresets,
  type SchemeVariant,
  type SchemeSpecVersion,
  type SchemePlatform,
} from "./m3-theme";

type Locale = "en" | "fr";
type Theme = "light" | "dark";
type Mode = "m3" | "expressive";
type Screen = "home" | "explore" | "tool";
type CategorySet = "current" | "vivid" | "blue";
type CategoryStyle = "soft" | "stripe" | "solid";
type TypePreset = "geist" | "system" | "classic";
const copy = {
  en: {
    eyebrow:"Experimental playground · not production",title:"Find Loculary’s visual personality.",intro:"Change one dimension at a time. Compare the same interface across palettes, themes and expressive treatments before choosing what belongs in the real product.",categoryColors:"Category identity colors",categoryColorsHelp:"These category colors are independent from the brand palette. Compare distinct color sets and visible treatments; the solid option uses matching foreground colors for readability.",
    theme:"Theme",style:"Visual language",viewport:"Preview width",categorySet:"Category color set",currentSet:"Current",vividSet:"Vivid multicolor",blueSet:"Blue-forward",categoryStyle:"Category treatment",softStyle:"Soft tint",stripeStyle:"Strong stripe",solidStyle:"Solid color",typeface:"Typeface",geistTypeface:"Geist",systemTypeface:"System",classicTypeface:"Arial / sans-serif",language:"Preview language",light:"Light",dark:"Dark",classic:"Material 3",expressive:"M3 Expressive",desktop:"Desktop",tablet:"Tablet",mobile:"Mobile",
    home:"Home",explore:"Explore",tool:"Tool page",search:"What do you need to do?",searchButton:"Find a tool",quick:"Popular tasks",welcome:"A toolbox for your next idea",subhead:"Small tasks, useful tools, less friction.",browse:"Explore tools",
    results:"Suggested tools",resultOne:"Percentage calculator",resultTwo:"Image converter",resultThree:"Text cleaner",toolTitle:"Percentage calculator",toolDesc:"Calculate a percentage of any value.",value:"Value",percent:"Percentage",calculate:"Calculate",output:"Your result",
    components:"Component gallery",settings:"Account & preferences",settingsHelp:"Examples of options a user can turn on or off.",syncFavorites:"Sync favorites",syncFavoritesHelp:"Keep your favorites available on your account.",automaticTheme:"Use device theme",automaticThemeHelp:"Follow your phone or computer light/dark setting.",reducedMotion:"Reduce motion",reducedMotionHelp:"Limit non-essential animations.",switchOnLabel:"On",switchOffLabel:"Off",actions:"Actions & controls",forms:"Forms & selection",surfaces:"Surfaces & feedback",type:"Typography & shape",states:"Interaction states",filled:"Primary action",tonal:"Tonal action",outlined:"Outlined",textButton:"Text action",disabled:"Unavailable action",focus:"Keyboard focus",motion:"Replay motion",
    email:"Email address",choose:"Choose a category",selected:"Selected",chip:"Image tools",filter:"Filters",tabA:"Overview",tabB:"Details",cardTitle:"A useful result",cardText:"Keep the task clear and the next step obvious.",
    dialogTitle:"Ready to continue?",dialogText:"This is a sample dialog preview, not a real confirmation.",close:"Not now",confirm:"Continue",success:"Everything looks good",warning:"Check this value",error:"Enter a valid email address",
    composition:"Real-world compositions",compositionHelp:"Illustrative layouts using the selected tokens, not screenshots of the current production UI.",contrast:"Contrast review",contrastHelp:"Review computed role pairs before adopting a palette.",wcag:"Material contrast is informative, not a full WCAG audit.",seed:"Source color",sourceColor:"Source color (hex)",sourceColorHelp:"Choose any color or start from a reference preset. Generated roles come from the official Material Color Utilities engine.",invalidSeed:"Enter a valid 3- or 6-digit hex color.",seedPresets:"Reference presets",variant:"Dynamic scheme variant",variantHelp:"Official Material Color Utilities variant; category mapping and font family remain Loculary-specific choices.",specVersion:"Material spec version",platform:"Target platform",phone:"Phone",watch:"Watch",platform2021:"Platform only affects the 2025 spec; it is ignored for the 2021 spec.",platform2025:"The 2025 spec supports phone and watch platform tuning.",contrastLevel:"Contrast level",normalContrast:"Default · 0",reducedContrast:"Reduced · −1",highContrast:"Higher · 0.5",maxContrast:"Maximum · 1",semanticRoles:"Semantic color roles",rolePairs:"Foreground/background contrast pairs",tonalPalettes:"Generated tonal palettes",typeScale:"Material 3 type scale",typeScaleHelp:"Official M3 role/size conventions; the selected web font family is an independent, non-prescriptive choice.",fontProvenance:"Font family is a custom web comparison, not a font mandated by Material 3.",categorySourceHelp:"Category seeds are curated Loculary examples. Their tones and on-colors are generated by the selected MCU variant; category-to-color assignment is not an official M3 rule.",
    note:"Nothing here changes Loculary’s production design. This is a decision aid; the final palette and style remain open.",closeDialog:"Close dialog",fieldHelp:"Shape, spacing and type respond to the selected visual language.",actionsHelp:"Use the controls above to compare the same components.",
  },
  fr: {
    eyebrow:"Laboratoire expérimental · hors production",title:"Trouvons la personnalité visuelle de Loculary.",intro:"Change une dimension à la fois. Compare la même interface selon les palettes, les thèmes et le style expressif avant de décider ce qui mérite d’entrer dans le vrai produit.",categoryColors:"Couleurs d’identité des catégories",categoryColorsHelp:"Les couleurs des catégories sont indépendantes de la palette de marque. Compare des jeux franchement différents et des traitements visibles ; les aplats utilisent une couleur de texte adaptée pour rester lisibles.",
    theme:"Thème",style:"Langage visuel",viewport:"Largeur d’aperçu",categorySet:"Jeu de couleurs des catégories",currentSet:"Actuel",vividSet:"Multicolore vif",blueSet:"Dominante bleue",categoryStyle:"Traitement des catégories",softStyle:"Teinte légère",stripeStyle:"Bande franche",solidStyle:"Aplat coloré",typeface:"Police de caractères",geistTypeface:"Geist",systemTypeface:"Système",classicTypeface:"Arial / sans-serif",language:"Langue de l’aperçu",light:"Clair",dark:"Sombre",classic:"Material 3",expressive:"M3 Expressive",desktop:"Ordinateur",tablet:"Tablette",mobile:"Mobile",
    home:"Accueil",explore:"Explorer",tool:"Page outil",search:"De quoi as-tu besoin ?",searchButton:"Trouver un outil",quick:"Actions populaires",welcome:"Une boîte à outils pour tes idées",subhead:"Des tâches simples, des outils utiles, moins de friction.",browse:"Explorer les outils",
    results:"Outils suggérés",resultOne:"Calcul de pourcentage",resultTwo:"Convertisseur d’image",resultThree:"Nettoyeur de texte",toolTitle:"Calcul de pourcentage",toolDesc:"Calcule un pourcentage de n’importe quelle valeur.",value:"Valeur",percent:"Pourcentage",calculate:"Calculer",output:"Ton résultat",
    components:"Galerie de composants",settings:"Compte et préférences",settingsHelp:"Exemples d’options que l’utilisateur peut activer ou désactiver.",syncFavorites:"Synchroniser les favoris",syncFavoritesHelp:"Retrouver les favoris sur son compte.",automaticTheme:"Suivre le thème de l’appareil",automaticThemeHelp:"Utiliser le mode clair ou sombre du téléphone ou de l’ordinateur.",reducedMotion:"Réduire les animations",reducedMotionHelp:"Limiter les animations non essentielles.",switchOnLabel:"Activé",switchOffLabel:"Désactivé",actions:"Actions et commandes",forms:"Formulaires et choix",surfaces:"Surfaces et retours",type:"Typographie et formes",states:"États d’interaction",filled:"Action principale",tonal:"Action tonale",outlined:"Contour",textButton:"Action texte",disabled:"Action indisponible",focus:"Focus clavier",motion:"Rejouer l’animation",
    email:"Adresse e-mail",choose:"Choisir une catégorie",selected:"Sélectionné",chip:"Outils image",filter:"Filtres",tabA:"Aperçu",tabB:"Détails",cardTitle:"Un résultat utile",cardText:"La tâche reste claire et la prochaine étape évidente.",
    dialogTitle:"Prêt à continuer ?",dialogText:"Ceci est un aperçu de dialogue, pas une vraie confirmation.",close:"Pas maintenant",confirm:"Continuer",success:"Tout semble correct",warning:"Vérifie cette valeur",error:"Saisis une adresse e-mail valide",
    composition:"Mises en situation",compositionHelp:"Compositions illustratives avec les tokens sélectionnés, pas des captures de l’interface actuelle.",contrast:"Vérification du contraste",contrastHelp:"Examine les paires de rôles calculées avant d’adopter une palette.",wcag:"Le contraste Material est informatif, pas un audit WCAG complet.",seed:"Couleur source",sourceColor:"Couleur source (hex)",sourceColorHelp:"Choisis n’importe quelle couleur ou pars d’un preset de référence. Les rôles sont générés par le moteur officiel Material Color Utilities.",invalidSeed:"Saisis une couleur hexadécimale valide à 3 ou 6 chiffres.",seedPresets:"Presets de référence",variant:"Variante de schéma dynamique",variantHelp:"Variante officielle de Material Color Utilities ; l’affectation des catégories et la police restent des choix propres à Loculary.",specVersion:"Version de la spécification Material",platform:"Plateforme cible",phone:"Téléphone",watch:"Montre",platform2021:"La plateforme n’influence que la spécification 2025 ; elle est ignorée en 2021.",platform2025:"La spécification 2025 adapte les palettes aux plateformes téléphone et montre.",contrastLevel:"Niveau de contraste",normalContrast:"Défaut · 0",reducedContrast:"Réduit · −1",highContrast:"Renforcé · 0,5",maxContrast:"Maximum · 1",semanticRoles:"Rôles de couleur sémantiques",rolePairs:"Paires premier plan / arrière-plan",tonalPalettes:"Palettes tonales générées",typeScale:"Échelle typographique Material 3",typeScaleHelp:"Conventions officielles des rôles et tailles M3 ; la famille de polices web est un choix indépendant et non prescriptif.",fontProvenance:"La famille de polices est une comparaison web personnalisée, pas une police imposée par Material 3.",categorySourceHelp:"Les couleurs source des catégories sont des exemples choisis par Loculary. Leurs tons et couleurs de texte sont générés par la variante MCU ; leur affectation n’est pas une règle officielle M3.",
    note:"Rien ici ne modifie le design de production de Loculary. C’est un outil d’aide à la décision ; palette et style restent à choisir.",closeDialog:"Fermer le dialogue",fieldHelp:"Formes, espacements et typographie suivent le langage visuel sélectionné.",actionsHelp:"Utilise les contrôles ci-dessus pour comparer les mêmes composants.",
  },
};

const categorySeedDefinitions = [
  { key: "calculations", name: "Calculations", nameFr: "Calculs", icon: "％", currentSeed: "#D92D20", vividSeed: "#D32F2F", blueSeed: "#2563EB" },
  { key: "dates", name: "Dates", nameFr: "Dates", icon: "◷", currentSeed: "#A16207", vividSeed: "#F59E0B", blueSeed: "#0EA5E9" },
  { key: "computing", name: "Computing", nameFr: "Informatique", icon: "⌘", currentSeed: "#7A5AF8", vividSeed: "#7C3AED", blueSeed: "#4F46E5" },
  { key: "images", name: "Images", nameFr: "Images", icon: "▧", currentSeed: "#C11574", vividSeed: "#DB2777", blueSeed: "#7C3AED" },
  { key: "files", name: "Files", nameFr: "Fichiers", icon: "▤", currentSeed: "#0E7490", vividSeed: "#0891B2", blueSeed: "#0369A1" },
  { key: "video", name: "Video", nameFr: "Vidéo", icon: "▷", currentSeed: "#0F766E", vividSeed: "#059669", blueSeed: "#0F766E" },
  { key: "development", name: "Development", nameFr: "Développement", icon: "{ }", currentSeed: "#155EEF", vividSeed: "#2563EB", blueSeed: "#1D4ED8" },
] as const;

export default function VisualLab({ initialLocale }: { initialLocale: string }) {
  const [locale,setLocale]=useState<Locale>(initialLocale==="fr"?"fr":"en");
  const [seedInput,setSeedInput]=useState("#3F51B5");
  const [seed,setSeed]=useState("#3F51B5");
  const [variant,setVariant]=useState<SchemeVariant>("expressive");
  const [contrastLevel,setContrastLevel]=useState(0);
  const [specVersion,setSpecVersion]=useState<SchemeSpecVersion>("2025");
  const [platform,setPlatform]=useState<SchemePlatform>("phone");
  const [theme,setTheme]=useState<Theme>("light");
  const [mode,setMode]=useState<Mode>("expressive");
  const [screen,setScreen]=useState<Screen>("home");
  const [viewport,setViewport]=useState<"desktop"|"tablet"|"mobile">("desktop");
  const [categorySet,setCategorySet]=useState<CategorySet>("current");
  const [categoryStyle,setCategoryStyle]=useState<CategoryStyle>("soft");
  const [typePreset,setTypePreset]=useState<TypePreset>("geist");
  const [dialogOpen,setDialogOpen]=useState(true);
  const [motionReplay,setMotionReplay]=useState(0);
  const [value,setValue]=useState("180");
  const [percent,setPercent]=useState("25");
  const [preferences,setPreferences]=useState({syncFavorites:true,automaticTheme:false,reducedMotion:true});
  const togglePreference=(key:keyof typeof preferences)=>setPreferences(current=>({...current,[key]:!current[key]}));
  const t=copy[locale];
  const normalizedInput=normalizeHexSeed(seedInput);
  const handleSeedChange=(nextValue:string)=>{
    setSeedInput(nextValue);
    const normalized=normalizeHexSeed(nextValue);
    if(normalized) setSeed(normalized);
  };
  const scheme=useMemo(()=>createM3Scheme(seed,variant,theme==="dark",contrastLevel,specVersion,platform),[seed,variant,theme,contrastLevel,specVersion,platform]);
  const roleColors=useMemo(()=>getSemanticRoles(scheme),[scheme]);
  const rolePairs=useMemo(()=>getRolePairs(scheme),[scheme]);
  const tonalPalettes=useMemo(()=>getTonalPalettes(scheme),[scheme]);
  const isMulticolorPalette=variant==="expressive"||variant==="vibrant"||variant==="rainbow"||variant==="fruit-salad";
  const tokens=useMemo(()=>({
    "--lab-bg":colorHex(scheme.background),
    "--lab-surface":colorHex(scheme.surface),
    "--lab-surface-2":colorHex(scheme.surfaceVariant),
    "--lab-font":typePreset==="geist"?"var(--font-geist-sans), sans-serif":typePreset==="system"?"system-ui, -apple-system, \"Segoe UI\", sans-serif":"Arial, Helvetica, sans-serif",
    "--lab-text":colorHex(scheme.onSurface),
    "--lab-muted":colorHex(scheme.onSurfaceVariant),
    "--lab-outline":colorHex(scheme.outline),
    "--lab-primary":colorHex(scheme.primary),
    "--lab-on-primary":colorHex(scheme.onPrimary),
    "--lab-primary-soft":colorHex(scheme.primaryContainer),
    "--lab-secondary":colorHex(scheme.secondary),
    "--lab-tertiary":colorHex(scheme.tertiary),
    "--lab-error":colorHex(scheme.error),
    "--lab-on-error":colorHex(scheme.onError),
    "--lab-radius":mode==="expressive"?"1.65rem":"0.8rem",
    "--lab-radius-small":mode==="expressive"?"1rem":"0.35rem",
    "--lab-motion":mode==="expressive"?"420ms":"180ms",
  } as CSSProperties & Record<string,string>),[scheme,mode,typePreset]);
  const amount=Number(value)*Number(percent)/100;
  const result=Number.isFinite(amount)?amount.toLocaleString(locale==="fr"?"fr-FR":"en-US",{maximumFractionDigits:3}):"—";
  const stageClass=[styles.stage,styles[viewport],theme==="dark"?styles.dark:styles.light,mode==="expressive"?styles.expressive:styles.classic].join(" ");
  const categoryCards = useMemo(()=>categorySeedDefinitions.map((item) => {
    const categorySeed = categorySet === "current" ? item.currentSeed : categorySet === "vivid" ? item.vividSeed : item.blueSeed;
    const categoryScheme = createM3Scheme(categorySeed, variant, theme === "dark", contrastLevel, specVersion, platform);
    return { ...item, name: locale === "fr" ? item.nameFr : item.name, categorySeed, categoryColor: colorHex(categoryScheme.primary), categoryForeground: colorHex(categoryScheme.onPrimary) };
  }),[locale,categorySet,variant,theme,contrastLevel,specVersion,platform]);
  const typeScaleSamples = [
    { role: "Display large", roleFr: "Affichage grand", size: 57 },
    { role: "Display medium", roleFr: "Affichage moyen", size: 45 },
    { role: "Display small", roleFr: "Affichage petit", size: 36 },
    { role: "Headline large", roleFr: "Titre principal grand", size: 32 },
    { role: "Headline medium", roleFr: "Titre principal moyen", size: 28 },
    { role: "Headline small", roleFr: "Titre principal petit", size: 24 },
    { role: "Title large", roleFr: "Titre grand", size: 22 },
    { role: "Title medium", roleFr: "Titre moyen", size: 16 },
    { role: "Title small", roleFr: "Titre petit", size: 14 },
    { role: "Body large", roleFr: "Texte courant grand", size: 16 },
    { role: "Body medium", roleFr: "Texte courant moyen", size: 14 },
    { role: "Body small", roleFr: "Texte courant petit", size: 12 },
    { role: "Label large", roleFr: "Libellé grand", size: 14 },
    { role: "Label medium", roleFr: "Libellé moyen", size: 12 },
    { role: "Label small", roleFr: "Libellé petit", size: 11 },
  ];

  return <main data-category-set={categorySet} data-category-style={categoryStyle} data-scheme-variant={variant} data-theme={theme} data-seed={seed} data-contrast={contrastLevel} data-spec-version={specVersion} data-platform={platform} data-effective-spec-version={scheme.specVersion} data-type-preset={typePreset} className={`${styles.lab} ${theme==="dark"?styles.darkPalette:""} ${styles[`categoryStyle_${categoryStyle}`]}`} style={tokens}>
    <header className={styles.intro}>
      <div className={styles.introTop}><span className={styles.eyebrow}><span className={styles.sparkle} aria-hidden="true">✳</span>{t.eyebrow}</span>
        <label className={styles.compactControl}>{t.language}<select value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="fr">Français</option><option value="en">English</option></select></label>
      </div><h1>{t.title}</h1><p>{t.intro}</p>
    </header>
    <section className={styles.controlPanel} aria-label={t.sourceColor}>
      <div className={styles.sourceColorPanel}>
        <div className={styles.sourceColorHeading}><span className={styles.controlLabel}>{t.sourceColor}</span><p className={styles.helper}>{t.sourceColorHelp}</p></div>
        <div className={styles.sourceColorInputs}>
          <input type="color" value={seed} onChange={e=>handleSeedChange(e.target.value)} aria-label={t.sourceColor} />
          <label className={styles.fieldLabel}>{t.seed}<input value={seedInput} onChange={e=>handleSeedChange(e.target.value)} aria-invalid={!normalizedInput} aria-describedby="seed-help" spellCheck={false} autoCapitalize="none" /></label>
        </div>
        <p id="seed-help" className={normalizedInput?styles.helper:styles.seedError}>{normalizedInput ? `${t.seed}: ${seed}` : t.invalidSeed}</p>
        <div className={styles.seedPresets} aria-label={t.seedPresets}>
          {seedPresets.map(item=><button key={item.seed} type="button" aria-pressed={seed===item.seed} onClick={()=>handleSeedChange(item.seed)}><span aria-hidden="true" style={{background:item.seed}}/><span>{locale==="fr"?item.nameFr:item.name}</span><small>{item.seed}</small></button>)}
        </div>
      </div>
      <div className={styles.engineControls}>
        <label className={styles.fieldLabel}>{t.variant}
          <select data-testid="scheme-variant" value={variant} onChange={e=>setVariant(e.target.value as SchemeVariant)}>
            {schemeVariants.map(item=><option key={item.key} value={item.key}>{locale==="fr"?item.nameFr:item.name}</option>)}
          </select>
        </label>
        <p className={styles.helper}>{schemeVariants.find(item=>item.key===variant)?.[locale==="fr"?"descriptionFr":"description"]} {t.variantHelp}</p>
        <label className={styles.fieldLabel}>{t.specVersion}
          <select data-testid="scheme-spec-version" value={specVersion} onChange={e=>setSpecVersion(e.target.value as SchemeSpecVersion)}>
            <option value="2021">2021</option><option value="2025">2025</option>
          </select>
        </label>
        <label className={styles.fieldLabel}>{t.platform}
          <select data-testid="scheme-platform" value={platform} disabled={specVersion==="2021"} onChange={e=>setPlatform(e.target.value as SchemePlatform)}>
            <option value="phone">{t.phone}</option><option value="watch">{t.watch}</option>
          </select>
          <span className={styles.helper}>{specVersion==="2021"?t.platform2021:t.platform2025}</span>
        </label>
        <div className={styles.contrastControl}>
          <div className={styles.contrastHeading}><label htmlFor="contrast-level">{t.contrastLevel}</label><output htmlFor="contrast-level">{contrastLevel.toFixed(1)}</output></div>
          <input id="contrast-level" data-testid="contrast-level" type="range" min={-1} max={1} step={0.1} value={contrastLevel} onChange={e=>setContrastLevel(Number(e.target.value))} />
          <div className={styles.contrastPresets}>
            <button type="button" aria-pressed={contrastLevel===-1} onClick={()=>setContrastLevel(-1)}>{t.reducedContrast}</button>
            <button type="button" aria-pressed={contrastLevel===0} onClick={()=>setContrastLevel(0)}>{t.normalContrast}</button>
            <button type="button" aria-pressed={contrastLevel===0.5} onClick={()=>setContrastLevel(0.5)}>{t.highContrast}</button>
            <button type="button" aria-pressed={contrastLevel===1} onClick={()=>setContrastLevel(1)}>{t.maxContrast}</button>
          </div>
        </div>
      </div>
      <div className={styles.controlRow}>
        <fieldset className={styles.segmentField}><legend>{t.theme}</legend><div className={styles.segmented}><button type="button" aria-pressed={theme==="light"} onClick={()=>setTheme("light")}>☀ {t.light}</button><button type="button" aria-pressed={theme==="dark"} onClick={()=>setTheme("dark")}>☾ {t.dark}</button></div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.style}</legend><div className={styles.segmented}><button type="button" aria-pressed={mode==="m3"} onClick={()=>setMode("m3")}>{t.classic}</button><button type="button" aria-pressed={mode==="expressive"} onClick={()=>setMode("expressive")}>{t.expressive}</button></div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.viewport}</legend><div className={styles.segmented}>{(["desktop","tablet","mobile"] as const).map(size=><button key={size} type="button" aria-pressed={viewport===size} onClick={()=>setViewport(size)}>{t[size]}</button>)}</div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.categorySet}</legend><div className={styles.segmented}><button type="button" aria-pressed={categorySet==="current"} onClick={()=>setCategorySet("current")}>{t.currentSet}</button><button type="button" aria-pressed={categorySet==="vivid"} onClick={()=>setCategorySet("vivid")}>{t.vividSet}</button><button type="button" aria-pressed={categorySet==="blue"} onClick={()=>setCategorySet("blue")}>{t.blueSet}</button></div><p className={styles.helper}>{t.categorySourceHelp}</p></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.categoryStyle}</legend><div className={styles.segmented}><button type="button" aria-pressed={categoryStyle==="soft"} onClick={()=>setCategoryStyle("soft")}>{t.softStyle}</button><button type="button" aria-pressed={categoryStyle==="stripe"} onClick={()=>setCategoryStyle("stripe")}>{t.stripeStyle}</button><button type="button" aria-pressed={categoryStyle==="solid"} onClick={()=>setCategoryStyle("solid")}>{t.solidStyle}</button></div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.typeface}</legend><div className={styles.segmented}><button type="button" aria-pressed={typePreset==="geist"} onClick={()=>setTypePreset("geist")}>{t.geistTypeface}</button><button type="button" aria-pressed={typePreset==="system"} onClick={()=>setTypePreset("system")}>{t.systemTypeface}</button><button type="button" aria-pressed={typePreset==="classic"} onClick={()=>setTypePreset("classic")}>{t.classicTypeface}</button></div><p className={styles.helper}>{t.fontProvenance}</p></fieldset>
      </div>
      <p className={styles.provenanceNote}><strong>Provenance:</strong> {locale==="fr"?"Les variantes et rôles de couleur sont générés par le moteur officiel MCU. Les graines de catégories, leur affectation et les familles de polices sont des choix personnalisés de Loculary.":"Scheme variants and semantic color roles are generated by the official MCU engine. Category seeds/mappings and font families are Loculary-specific choices."}</p>
    </section>
    <section className={styles.previewSection} aria-labelledby="composition-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>01 / {t.composition}</span><h2 id="composition-title">{t.composition}</h2><p>{t.compositionHelp}</p></div>
        <div className={styles.screenTabs} role="group" aria-label={t.composition}>{(["home","explore","tool"] as const).map(item=><button key={item} type="button" aria-pressed={screen===item} onClick={()=>setScreen(item)}>{t[item]}</button>)}</div>
      </div>
      <div className={stageClass} key={viewport+theme+mode+seed+variant+contrastLevel}><div className={styles.mockApp}>
        <div className={styles.mockHeader}><div className={styles.brand}><span className={styles.brandMark}>L</span><strong>Loculary</strong></div><nav className={styles.mockNav} aria-label="Preview navigation"><span>{t.home}</span><span>{t.explore}</span><span aria-hidden="true">⌕</span></nav><button type="button" className={styles.avatar} aria-label="Profile preview">N</button></div>
        {screen==="home"&&<div className={styles.compositionContent}><div className={styles.heroText}><span className={styles.pill}>✦ {t.welcome}</span><h3>{t.welcome}</h3><p>{t.subhead}</p></div><div className={styles.searchBox}><span aria-hidden="true">⌕</span><span>{t.search}</span><button type="button">{t.searchButton} ↗</button></div><div className={styles.quickTasks}><span>{t.quick}</span><div><span>％ {t.resultOne}</span><span>▧ {t.resultTwo}</span><span>¶ {t.resultThree}</span></div></div><div className={styles.previewCards}><article><span className={styles.cardIcon}>✳</span><strong>{t.resultOne}</strong><p>25% × 180</p></article><article><span className={`${styles.cardIcon} ${isMulticolorPalette?styles.accentSecondary:""}`}>▧</span><strong>{t.resultTwo}</strong><p>PNG · JPG · WEBP</p></article></div></div>}
        {screen==="explore"&&<div className={styles.compositionContent}><div className={styles.exploreTitle}><span className={styles.pill}>{t.filter}</span><h3>{t.results}</h3><p>{t.subhead}</p></div><div className={styles.searchBox}><span>⌕</span><span>{t.search}</span></div><div className={styles.chipRow}><button type="button" className={styles.chipSelected}>{t.selected}</button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipSecondary:""}`}>{t.chip}</button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipTertiary:""}`}>{t.filter}</button></div><div className={styles.resultList}>{[t.resultOne,t.resultTwo,t.resultThree].map((name,index)=><article key={name}><span className={`${styles.cardIcon} ${isMulticolorPalette?(index===1?styles.accentSecondary:index===2?styles.accentTertiary:""):""}`}>{["％","▧","¶"][index]}</span><div><strong>{name}</strong><p>{t.cardText}</p></div><span aria-hidden="true">↗</span></article>)}</div></div>}
        {screen==="tool"&&<div className={styles.compositionContent}><div className={styles.toolIntro}><span className={styles.pill}>✦ {t.tool}</span><h3>{t.toolTitle}</h3><p>{t.toolDesc}</p></div><div className={styles.calculator}><label>{t.value}<input value={value} inputMode="decimal" onChange={e=>setValue(e.target.value)}/></label><label>{t.percent}<input value={percent} inputMode="decimal" onChange={e=>setPercent(e.target.value)}/></label><div className={styles.resultPanel}><span>{t.output}</span><strong>{result}</strong></div><button type="button">{t.calculate}</button></div></div>}
      </div>
      <section className={styles.categoryPreview} aria-labelledby="category-preview-title">
        <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>01B / {t.categoryColors}</span><h2 id="category-preview-title">{t.categoryColors}</h2><p>{t.categoryColorsHelp}</p></div></div>
        <div className={styles.categoryGrid}>
          {categoryCards.map((item) => <article key={item.key} data-category-seed={item.categorySeed} className={styles.categoryCard} style={{ "--category-color": item.categoryColor, "--category-foreground": item.categoryForeground } as CSSProperties}>
            <span className={styles.categoryGlyph} aria-hidden="true">{item.icon}</span>
            <div><strong>{item.name}</strong><small>{item.categorySeed} · {item.categoryColor}</small></div>
          </article>)}
        </div>
      </section>
      </div>
    </section>
    <section className={styles.roleSection} aria-labelledby="roles-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>02 / {t.semanticRoles}</span><h2 id="roles-title">{t.semanticRoles}</h2><p>{locale==="fr"?"Ces rôles sont calculés à partir de la couleur source, de la variante, du thème et du contraste sélectionnés.":"These roles are computed from the selected source color, variant, theme and contrast level."}</p></div></div>
      <h3 className={styles.subsectionTitle}>{t.rolePairs}</h3>
      <div className={styles.rolePairGrid}>{rolePairs.map(pair=><article key={pair.name} className={styles.rolePair} style={{"--role-bg":pair.background,"--role-fg":pair.foreground} as CSSProperties}><div><strong>{pair.name}</strong><small>{pair.background} · {pair.foreground}</small></div><span className={styles.roleSample}>Aa</span><small className={styles.contrastRatio}>{pair.ratio.toFixed(2)}:1 {pair.ratio>=4.5?"✓ ≥ 4.5":"⚠ < 4.5"}</small></article>)}</div>
      <h3 className={styles.subsectionTitle}>{locale==="fr"?"Tous les rôles sémantiques":"All semantic roles"}</h3>
      <div className={styles.semanticRoleGrid}>{roleColors.map(role=><div className={styles.semanticRole} key={role.name}><span style={{background:role.color??"transparent"}}/><strong>{role.name}</strong><small>{role.color??(locale==="fr"?"Indisponible dans cette spécification":"Not available in this spec")}</small></div>)}</div>
      <h3 className={styles.subsectionTitle}>{t.tonalPalettes}</h3>
      <p className={styles.helper}>{locale==="fr"?"Les tons sont produits par les palettes tonales MCU ; ils ne sont pas saisis manuellement.":"Tones come directly from MCU tonal palettes; they are not hand-authored values."}</p>
      <div className={styles.tonalPaletteGrid}>{tonalPalettes.map(palette=><article className={styles.tonalPalette} key={palette.name}><h4>{palette.name}</h4><div>{palette.tones.map(tone=><span key={tone.tone} title={`Tone ${tone.tone}: ${tone.color}`} style={{background:tone.color}}><small>{tone.tone}</small></span>)}</div></article>)}</div>
      <h3 className={styles.subsectionTitle}>{t.typeScale}</h3><p className={styles.helper}>{t.typeScaleHelp}</p>
      <div className={styles.typeScaleGrid}>{typeScaleSamples.map(sample=><article key={sample.role}><small>{locale==="fr"?sample.roleFr:sample.role} · {sample.size}px</small><span style={{fontSize:`${sample.size}px`}}>Loculary</span></article>)}</div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="gallery-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>02 / {t.components}</span><h2 id="gallery-title">{t.components}</h2><p>{t.actionsHelp}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{t.actions}</h3><div className={styles.buttonStack}><button type="button" className={styles.filled}>{t.filled}</button><button type="button" className={styles.tonal}>{t.tonal}</button><button type="button" className={styles.outlined}>{t.outlined}</button><button type="button" className={styles.textButton}>{t.textButton}</button><button type="button" className={styles.disabled} disabled>{t.disabled}</button></div><div className={styles.stateSamples}><button type="button" className={styles.focusSample}>{t.focus}</button><button type="button" className={styles.rippleSample} onClick={()=>setMotionReplay(n=>n+1)}>{t.motion}</button></div><p className={styles.helper}>{t.fieldHelp}</p><div key={motionReplay} className={styles.motionDemo} aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></div></article>
        <article className={styles.galleryCard}><h3>{t.forms}</h3><label className={styles.fieldLabel}>{t.email}<input type="email" placeholder="bonjour@loculary.com"/></label><label className={styles.fieldLabel}>{t.choose}<select defaultValue="images"><option value="images">{t.resultTwo}</option><option value="text">{t.resultThree}</option></select></label><div className={styles.chipRow}><button type="button" className={styles.chipSelected}>{t.selected} ✓</button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipSecondary:""}`}>{t.chip}</button><button type="button" className={`${styles.chip} ${isMulticolorPalette?styles.chipTertiary:""}`}>{t.filter}</button></div><div className={styles.tabRow}><button type="button" className={styles.tabSelected}>{t.tabA}</button><button type="button" className={styles.tab}>{t.tabB}</button></div>
          <div className={styles.preferenceList}><div className={styles.preferenceHeading}><h4>{t.settings}</h4><p>{t.settingsHelp}</p></div>
            {([{key:"syncFavorites",title:t.syncFavorites,help:t.syncFavoritesHelp},{key:"automaticTheme",title:t.automaticTheme,help:t.automaticThemeHelp},{key:"reducedMotion",title:t.reducedMotion,help:t.reducedMotionHelp}] as const).map(item=><div className={styles.preferenceRow} key={item.key}><div className={styles.preferenceCopy}><strong>{item.title}</strong><p>{item.help}</p></div><button type="button" role="switch" aria-checked={preferences[item.key]} aria-label={item.title} className={preferences[item.key]?styles.switchOn:styles.switchOff} onClick={()=>togglePreference(item.key)}><span className={styles.switchThumb}/></button><span className={styles.preferenceState}>{preferences[item.key]?t.switchOnLabel:t.switchOffLabel}</span></div>)}
          </div></article>
        <article className={styles.galleryCard}><h3>{t.surfaces}</h3><div className={styles.infoCard}><span className={`${styles.cardIcon} ${isMulticolorPalette?styles.accentTertiary:""}`}>✳</span><strong>{t.cardTitle}</strong><p>{t.cardText}</p><button type="button" className={styles.textButton}>{t.browse} ↗</button></div><div className={styles.status} role="status"><span>✓</span>{t.success}</div><div className={styles.statusWarning}><span>!</span>{t.warning}</div><div className={styles.statusError} role="alert"><span>×</span>{t.error}</div></article>
        <article className={styles.galleryCard}><h3>{t.type}</h3><div className={styles.typeSample}><span>Display</span><strong>Ag</strong><h4>{t.welcome}</h4><p>{t.cardText}</p><small>Label · Supporting text</small></div><div className={styles.shapeRow}><span/><span/><span/><span/></div><p className={styles.helper}>{t.fieldHelp}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="states-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>03 / {t.states}</span><h2 id="states-title">{t.states}</h2><p>{t.dialogText}</p></div><button type="button" className={styles.outlined} onClick={()=>setDialogOpen(true)}>{t.confirm} · dialog</button></div>
      {dialogOpen&&<div className={styles.dialogPreview} role="group" aria-label={t.states}><div className={styles.dialogIcon}>✦</div><h3>{t.dialogTitle}</h3><p>{t.dialogText}</p><div><button type="button" className={styles.textButton} onClick={()=>setDialogOpen(false)}>{t.close}</button><button type="button" className={styles.filled} onClick={()=>setDialogOpen(false)}>{t.confirm}</button></div></div>}
    </section>
    <footer className={styles.labFooter}><p>{t.note}</p><div><span>{t.seed}: <strong>{seed}</strong></span><span>{locale==="fr"?"Variante MCU":"MCU variant"}: <strong>{schemeVariants.find(item=>item.key===variant)?.[locale==="fr"?"nameFr":"name"]}</strong></span><span>{t.contrast}: <strong>{contrastLevel.toFixed(1)}</strong></span><span>{t.specVersion}: <strong>{specVersion}</strong> · {t.platform}: <strong>{platform}</strong> · {locale==="fr"?"spécification effective":"effective spec"}: <strong>{scheme.specVersion}</strong></span><small>{t.contrastHelp} {t.wcag}</small></div></footer>
  </main>;
}
