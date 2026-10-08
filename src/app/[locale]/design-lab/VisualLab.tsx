"use client";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./visual-lab.module.css";

type Locale = "en" | "fr";
type PaletteKey = "violet" | "blue" | "hybrid" | "coral";
type Theme = "light" | "dark";
type Mode = "m3" | "expressive";
type Screen = "home" | "explore" | "tool";
const palettes: Record<PaletteKey, { name: string; seed: string; primary: string; secondary: string; tertiary: string; surface: string; description: string }> = {
  violet: { name: "Violet", seed: "#6750A4", primary: "#6750A4", secondary: "#625B71", tertiary: "#7D5260", surface: "#F7F2FA", description: "Distinctive and creative; close to familiar Material purple." },
  blue: { name: "Blue", seed: "#386A9F", primary: "#386A9F", secondary: "#526070", tertiary: "#6B5778", surface: "#F2F6FB", description: "Clear, dependable and more conventional." },
  hybrid: { name: "Violet + blue", seed: "#6750A4", primary: "#6750A4", secondary: "#4267A9", tertiary: "#806080", surface: "#F5F3FA", description: "Violet identity with a cooler blue supporting accent." },
  coral: { name: "Coral + teal", seed: "#9A4057", primary: "#9A4057", secondary: "#42675F", tertiary: "#76558F", surface: "#FBF2F1", description: "A warm alternative that challenges the obvious choices." },
};
const copy = {
  en: {
    eyebrow:"Experimental playground · not production",title:"Find Loculary’s visual personality.",intro:"Change one dimension at a time. Compare the same interface across palettes, themes and expressive treatments before choosing what belongs in the real product.",
    palette:"Palette",theme:"Theme",style:"Visual language",viewport:"Preview width",language:"Preview language",light:"Light",dark:"Dark",classic:"Material 3",expressive:"M3 Expressive",desktop:"Desktop",tablet:"Tablet",mobile:"Mobile",
    home:"Home",explore:"Explore",tool:"Tool page",search:"What do you need to do?",searchButton:"Find a tool",quick:"Popular tasks",welcome:"A toolbox for your next idea",subhead:"Small tasks, useful tools, less friction.",browse:"Explore tools",
    results:"Suggested tools",resultOne:"Percentage calculator",resultTwo:"Image converter",resultThree:"Text cleaner",toolTitle:"Percentage calculator",toolDesc:"Calculate a percentage of any value.",value:"Value",percent:"Percentage",calculate:"Calculate",output:"Your result",
    components:"Component gallery",actions:"Actions & controls",forms:"Forms & selection",surfaces:"Surfaces & feedback",type:"Typography & shape",states:"Interaction states",filled:"Primary action",tonal:"Tonal action",outlined:"Outlined",textButton:"Text action",disabled:"Unavailable action",focus:"Keyboard focus",motion:"Replay motion",
    email:"Email address",choose:"Choose a category",selected:"Selected",chip:"Image tools",filter:"Filters",tabA:"Overview",tabB:"Details",cardTitle:"A useful result",cardText:"Keep the task clear and the next step obvious.",
    dialogTitle:"Ready to continue?",dialogText:"This is a sample dialog preview, not a real confirmation.",close:"Not now",confirm:"Continue",success:"Everything looks good",warning:"Check this value",error:"Enter a valid email address",
    composition:"Real-world compositions",compositionHelp:"Illustrative layouts using the selected tokens, not screenshots of the current production UI.",contrast:"Contrast review",contrastHelp:"Validate actual contrast before adopting a palette.",wcag:"Prototype swatches only — not a WCAG certification.",seed:"Seed color",
    note:"Nothing here changes Loculary’s production design. This is a decision aid; the final palette and style remain open.",closeDialog:"Close dialog",fieldHelp:"Shape, spacing and type respond to the selected visual language.",actionsHelp:"Use the controls above to compare the same components.",
  },
  fr: {
    eyebrow:"Laboratoire expérimental · hors production",title:"Trouvons la personnalité visuelle de Loculary.",intro:"Change une dimension à la fois. Compare la même interface selon les palettes, les thèmes et le style expressif avant de décider ce qui mérite d’entrer dans le vrai produit.",
    palette:"Palette",theme:"Thème",style:"Langage visuel",viewport:"Largeur d’aperçu",language:"Langue de l’aperçu",light:"Clair",dark:"Sombre",classic:"Material 3",expressive:"M3 Expressive",desktop:"Ordinateur",tablet:"Tablette",mobile:"Mobile",
    home:"Accueil",explore:"Explorer",tool:"Page outil",search:"De quoi as-tu besoin ?",searchButton:"Trouver un outil",quick:"Actions populaires",welcome:"Une boîte à outils pour tes idées",subhead:"Des tâches simples, des outils utiles, moins de friction.",browse:"Explorer les outils",
    results:"Outils suggérés",resultOne:"Calcul de pourcentage",resultTwo:"Convertisseur d’image",resultThree:"Nettoyeur de texte",toolTitle:"Calcul de pourcentage",toolDesc:"Calcule un pourcentage de n’importe quelle valeur.",value:"Valeur",percent:"Pourcentage",calculate:"Calculer",output:"Ton résultat",
    components:"Galerie de composants",actions:"Actions et commandes",forms:"Formulaires et choix",surfaces:"Surfaces et retours",type:"Typographie et formes",states:"États d’interaction",filled:"Action principale",tonal:"Action tonale",outlined:"Contour",textButton:"Action texte",disabled:"Action indisponible",focus:"Focus clavier",motion:"Rejouer l’animation",
    email:"Adresse e-mail",choose:"Choisir une catégorie",selected:"Sélectionné",chip:"Outils image",filter:"Filtres",tabA:"Aperçu",tabB:"Détails",cardTitle:"Un résultat utile",cardText:"La tâche reste claire et la prochaine étape évidente.",
    dialogTitle:"Prêt à continuer ?",dialogText:"Ceci est un aperçu de dialogue, pas une vraie confirmation.",close:"Pas maintenant",confirm:"Continuer",success:"Tout semble correct",warning:"Vérifie cette valeur",error:"Saisis une adresse e-mail valide",
    composition:"Mises en situation",compositionHelp:"Compositions illustratives avec les tokens sélectionnés, pas des captures de l’interface actuelle.",contrast:"Vérification du contraste",contrastHelp:"Valide réellement les contrastes avant d’adopter une palette.",wcag:"Échantillons expérimentaux — aucune certification WCAG.",seed:"Couleur de départ",
    note:"Rien ici ne modifie le design de production de Loculary. C’est un outil d’aide à la décision ; palette et style restent à choisir.",closeDialog:"Fermer le dialogue",fieldHelp:"Formes, espacements et typographie suivent le langage visuel sélectionné.",actionsHelp:"Utilise les contrôles ci-dessus pour comparer les mêmes composants.",
  },
};

export default function VisualLab({ initialLocale }: { initialLocale: string }) {
  const [locale,setLocale]=useState<Locale>(initialLocale==="fr"?"fr":"en");
  const [paletteKey,setPaletteKey]=useState<PaletteKey>("violet");
  const [theme,setTheme]=useState<Theme>("light");
  const [mode,setMode]=useState<Mode>("expressive");
  const [screen,setScreen]=useState<Screen>("home");
  const [viewport,setViewport]=useState<"desktop"|"tablet"|"mobile">("desktop");
  const [dialogOpen,setDialogOpen]=useState(true);
  const [motionReplay,setMotionReplay]=useState(0);
  const [value,setValue]=useState("180");
  const [percent,setPercent]=useState("25");
  const t=copy[locale];
  const palette=palettes[paletteKey];
  const tokens=useMemo(()=> {
    const dark=theme==="dark";
    return {
      "--lab-bg":dark?"#111318":palette.surface,
      "--lab-surface":dark?"#1B1D24":"#FFFFFF",
      "--lab-surface-2":dark?"#252832":"#F1EDF6",
      "--lab-text":dark?"#F2EFF7":"#1D1A22",
      "--lab-muted":dark?"#C4BECC":"#625D69",
      "--lab-outline":dark?"#494550":"#CAC4D0",
      "--lab-primary":dark?(paletteKey==="blue"?"#A7C8F5":paletteKey==="coral"?"#FFB2C0":"#D0BCFF"):palette.primary,
      "--lab-on-primary":dark?"#30234B":"#FFFFFF",
      "--lab-primary-soft":dark?"#4A3C63":paletteKey==="blue"?"#D7E6FA":paletteKey==="coral"?"#F8DCE1":"#EADDFF",
      "--lab-secondary":dark?"#D0C7DC":palette.secondary,
      "--lab-tertiary":dark?"#E8B9CF":palette.tertiary,
      "--lab-radius":mode==="expressive"?"1.65rem":"0.8rem",
      "--lab-radius-small":mode==="expressive"?"1rem":"0.35rem",
      "--lab-motion":mode==="expressive"?"420ms":"180ms",
    } as CSSProperties & Record<string,string>;
  },[palette,paletteKey,mode,theme]);
  const amount=Number(value)*Number(percent)/100;
  const result=Number.isFinite(amount)?amount.toLocaleString(locale==="fr"?"fr-FR":"en-US",{maximumFractionDigits:3}):"—";
  const stageClass=[styles.stage,styles[viewport],theme==="dark"?styles.dark:styles.light,mode==="expressive"?styles.expressive:styles.classic].join(" ");

  return <main className={styles.lab} style={tokens}>
    <header className={styles.intro}>
      <div className={styles.introTop}><span className={styles.eyebrow}><span className={styles.sparkle} aria-hidden="true">✳</span>{t.eyebrow}</span>
        <label className={styles.compactControl}>{t.language}<select value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="fr">Français</option><option value="en">English</option></select></label>
      </div><h1>{t.title}</h1><p>{t.intro}</p>
    </header>
    <section className={styles.controlPanel} aria-label={t.palette}>
      <div><span className={styles.controlLabel}>{t.palette}</span><div className={styles.paletteOptions}>
        {(Object.entries(palettes) as [PaletteKey,typeof palettes[PaletteKey]][]).map(([key,item])=><button key={key} type="button" aria-pressed={paletteKey===key} className={paletteKey===key?styles.paletteSelected:styles.paletteOption} onClick={()=>setPaletteKey(key)}>
          <span className={styles.swatch} style={{background:item.seed}} aria-hidden="true"/><span className={styles.paletteText}><strong>{item.name}</strong><small>{item.seed}</small></span>{paletteKey===key&&<span className={styles.check} aria-hidden="true">✓</span>}
        </button>)}
      </div><p className={styles.paletteDescription}>{palette.description}</p></div>
      <div className={styles.controlRow}>
        <fieldset className={styles.segmentField}><legend>{t.theme}</legend><div className={styles.segmented}><button type="button" aria-pressed={theme==="light"} onClick={()=>setTheme("light")}>☀ {t.light}</button><button type="button" aria-pressed={theme==="dark"} onClick={()=>setTheme("dark")}>☾ {t.dark}</button></div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.style}</legend><div className={styles.segmented}><button type="button" aria-pressed={mode==="m3"} onClick={()=>setMode("m3")}>{t.classic}</button><button type="button" aria-pressed={mode==="expressive"} onClick={()=>setMode("expressive")}>{t.expressive}</button></div></fieldset>
        <fieldset className={styles.segmentField}><legend>{t.viewport}</legend><div className={styles.segmented}>{(["desktop","tablet","mobile"] as const).map(size=><button key={size} type="button" aria-pressed={viewport===size} onClick={()=>setViewport(size)}>{t[size]}</button>)}</div></fieldset>
      </div>
    </section>
    <section className={styles.previewSection} aria-labelledby="composition-title">
      <div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>01 / {t.composition}</span><h2 id="composition-title">{t.composition}</h2><p>{t.compositionHelp}</p></div>
        <div className={styles.screenTabs} role="group" aria-label={t.composition}>{(["home","explore","tool"] as const).map(item=><button key={item} type="button" aria-pressed={screen===item} onClick={()=>setScreen(item)}>{t[item]}</button>)}</div>
      </div>
      <div className={stageClass} key={viewport+theme+mode+paletteKey}><div className={styles.mockApp}>
        <div className={styles.mockHeader}><div className={styles.brand}><span className={styles.brandMark}>L</span><strong>Loculary</strong></div><nav className={styles.mockNav} aria-label="Preview navigation"><span>{t.home}</span><span>{t.explore}</span><span aria-hidden="true">⌕</span></nav><button type="button" className={styles.avatar} aria-label="Profile preview">N</button></div>
        {screen==="home"&&<div className={styles.compositionContent}><div className={styles.heroText}><span className={styles.pill}>✦ {t.welcome}</span><h3>{t.welcome}</h3><p>{t.subhead}</p></div><div className={styles.searchBox}><span aria-hidden="true">⌕</span><span>{t.search}</span><button type="button">{t.searchButton} ↗</button></div><div className={styles.quickTasks}><span>{t.quick}</span><div><span>％ {t.resultOne}</span><span>▧ {t.resultTwo}</span><span>¶ {t.resultThree}</span></div></div><div className={styles.previewCards}><article><span className={styles.cardIcon}>✳</span><strong>{t.resultOne}</strong><p>25% × 180</p></article><article><span className={styles.cardIcon}>▧</span><strong>{t.resultTwo}</strong><p>PNG · JPG · WEBP</p></article></div></div>}
        {screen==="explore"&&<div className={styles.compositionContent}><div className={styles.exploreTitle}><span className={styles.pill}>{t.filter}</span><h3>{t.results}</h3><p>{t.subhead}</p></div><div className={styles.searchBox}><span>⌕</span><span>{t.search}</span></div><div className={styles.chipRow}><button type="button" className={styles.chipSelected}>{t.selected}</button><button type="button" className={styles.chip}>{t.chip}</button><button type="button" className={styles.chip}>{t.filter}</button></div><div className={styles.resultList}>{[t.resultOne,t.resultTwo,t.resultThree].map((name,index)=><article key={name}><span className={styles.cardIcon}>{["％","▧","¶"][index]}</span><div><strong>{name}</strong><p>{t.cardText}</p></div><span aria-hidden="true">↗</span></article>)}</div></div>}
        {screen==="tool"&&<div className={styles.compositionContent}><div className={styles.toolIntro}><span className={styles.pill}>✦ {t.tool}</span><h3>{t.toolTitle}</h3><p>{t.toolDesc}</p></div><div className={styles.calculator}><label>{t.value}<input value={value} inputMode="decimal" onChange={e=>setValue(e.target.value)}/></label><label>{t.percent}<input value={percent} inputMode="decimal" onChange={e=>setPercent(e.target.value)}/></label><div className={styles.resultPanel}><span>{t.output}</span><strong>{result}</strong></div><button type="button">{t.calculate}</button></div></div>}
      </div></div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="gallery-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>02 / {t.components}</span><h2 id="gallery-title">{t.components}</h2><p>{t.actionsHelp}</p></div></div>
      <div className={styles.galleryGrid}>
        <article className={styles.galleryCard}><h3>{t.actions}</h3><div className={styles.buttonStack}><button type="button" className={styles.filled}>{t.filled}</button><button type="button" className={styles.tonal}>{t.tonal}</button><button type="button" className={styles.outlined}>{t.outlined}</button><button type="button" className={styles.textButton}>{t.textButton}</button><button type="button" className={styles.disabled} disabled>{t.disabled}</button></div><div className={styles.stateSamples}><button type="button" className={styles.focusSample}>{t.focus}</button><button type="button" className={styles.rippleSample} onClick={()=>setMotionReplay(n=>n+1)}>{t.motion}</button></div><p className={styles.helper}>{t.fieldHelp}</p><div key={motionReplay} className={styles.motionDemo} aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></div></article>
        <article className={styles.galleryCard}><h3>{t.forms}</h3><label className={styles.fieldLabel}>{t.email}<input type="email" placeholder="bonjour@loculary.com"/></label><label className={styles.fieldLabel}>{t.choose}<select defaultValue="images"><option value="images">{t.resultTwo}</option><option value="text">{t.resultThree}</option></select></label><div className={styles.chipRow}><button type="button" className={styles.chipSelected}>{t.selected} ✓</button><button type="button" className={styles.chip}>{t.chip}</button><button type="button" className={styles.chip}>{t.filter}</button></div><div className={styles.tabRow}><button type="button" className={styles.tabSelected}>{t.tabA}</button><button type="button" className={styles.tab}>{t.tabB}</button></div></article>
        <article className={styles.galleryCard}><h3>{t.surfaces}</h3><div className={styles.infoCard}><span className={styles.cardIcon}>✳</span><strong>{t.cardTitle}</strong><p>{t.cardText}</p><button type="button" className={styles.textButton}>{t.browse} ↗</button></div><div className={styles.status} role="status"><span>✓</span>{t.success}</div><div className={styles.statusWarning}><span>!</span>{t.warning}</div><div className={styles.statusError} role="alert"><span>×</span>{t.error}</div></article>
        <article className={styles.galleryCard}><h3>{t.type}</h3><div className={styles.typeSample}><span>Display</span><strong>Ag</strong><h4>{t.welcome}</h4><p>{t.cardText}</p><small>Label · Supporting text</small></div><div className={styles.shapeRow}><span/><span/><span/><span/></div><p className={styles.helper}>{t.fieldHelp}</p></article>
      </div>
    </section>
    <section className={styles.gallerySection} aria-labelledby="states-title"><div className={styles.sectionHeading}><div><span className={styles.sectionKicker}>03 / {t.states}</span><h2 id="states-title">{t.states}</h2><p>{t.dialogText}</p></div><button type="button" className={styles.outlined} onClick={()=>setDialogOpen(true)}>{t.confirm} · dialog</button></div>
      {dialogOpen&&<div className={styles.dialogPreview} role="group" aria-label={t.states}><div className={styles.dialogIcon}>✦</div><h3>{t.dialogTitle}</h3><p>{t.dialogText}</p><div><button type="button" className={styles.textButton} onClick={()=>setDialogOpen(false)}>{t.close}</button><button type="button" className={styles.filled} onClick={()=>setDialogOpen(false)}>{t.confirm}</button></div></div>}
    </section>
    <footer className={styles.labFooter}><p>{t.note}</p><div><span>{t.seed}: <strong>{palette.seed}</strong></span><span>{t.contrast}</span><small>{t.contrastHelp} {t.wcag}</small></div></footer>
  </main>;
}
