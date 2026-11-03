# Audit géométrique M3 Fidelity — Issue #1196

## État
- **Chip** : ✅ Corrigé (40px → 32dp/32px) — PR #1223 fusionnée

## Composants à auditer

### Composants Core (priorité haute)
- [ ] **Button** (filled, elevated, filled-tonal, outlined, text)
- [ ] **IconButton** (8 variantes)
- [ ] **Card** (filled, elevated, outlined)
- [ ] **Chip** (assist, filter, input, suggestion) — ✅ Hauteur corrigée
- [ ] **NavigationBar** / **NavigationRail** / **NavigationDrawer** / **WideNavigationRail**
- [ ] **TopAppBar** / **BottomAppBar**
- [ ] **FAB** / **ExtendedFAB**
- [ ] **Tabs**
- [ ] **Dialog** / **BottomSheet** / **ModalBottomSheet** / **BottomSheetScaffold**
- [ ] **Tooltip** / **RichTooltip**
- [ ] **Snackbar**
- [ ] **TextField** / **OutlinedTextField** / **TextArea**
- [ ] **Select** / **ExposedDropdownMenu** / **DropdownMenu**
- [ ] **Slider** / **RangeSlider**
- [ ] **Switch** / **Checkbox** / **RadioButton** / **ToggleButton** / **SegmentedButton**
- [ ] **ProgressIndicator** (Linear, Circular)
- [ ] **Snackbar**
- [ ] **Divider**
- [ ] **ListItem**
- [ ] **Tabs**
- [ ] **BottomAppBar**
- [ ] **BottomSheetScaffold** / **Scaffold**
- [ ] **Tabs**
- [ ] **Carousel**
- [ ] **Tabs**

## Matrice d'audit

| Composant | Propriété | AndroidX 1.4.0 | Code actuel | Statut | Action |
|-----------|-----------|----------------|-------------|--------|--------|
| **Button** | Hauteur min | 40dp | 40px (`min-h-10`) |  |  |
| | Largeur min | 58dp | 58px (`min-w-[58px]`) |  |  |
| | Padding H standard | 24dp | 24px (`px-6`) |  |  |
| | Padding V standard | 8dp | 8px (`py-2`) |  |  |
| | Gap icône | 8dp | 8px (`gap-2`) |  |  |
| | Rayon | Full | `rounded-full` |  |  |
| **IconButton** | Taille | 48dp |  |  |  |
| | Zone tactile | 48dp |  |  |  |
| **Chip** | Hauteur | 32dp | 32px | ✅ | Corrigé |
| **Card** | Rayon | 12dp | `shape-corner-medium` (12px) |  |  |
| **NavigationRail** | Largeur compact | 80dp | 80px |  |  |
| | Hauteur item | 56dp | 56px |  |  |
| **NavigationBar** | Hauteur | 80dp | 80px |  |  |
| **NavigationDrawer** | Largeur modal | min(360dp, 100vw-56dp) |  |  |  |
| **TopAppBar** | Hauteur petite | 64dp | 64px |  |  |
| **FAB** | Taille | 56dp |  |  |  |
| **FAB étendu** | Hauteur | 48dp |  |  |  |
| **Tabs** | Hauteur | 48dp |  |  |  |
| **Tabs** | Indicateur | 3dp |  |  |  |
| **Tabs** | Padding | 16dp |  |  |  |
| **Dialog** | Largeur | 280dp |  |  |  |
| **BottomSheet** | Rayon haut | 28dp |  |  |  |
| **Tooltip** | Hauteur | 32dp |  |  |  |
| **Snackbar** | Hauteur min | 48dp |  |  |  |

## Prochaines étapes
1. Vérifier Button (toutes variantes) - priorité haute
2. Vérifier IconButton
3. Vérifier Navigation components
4. Vérifier Card variants
5. Vérifier FAB
6. Documenter les écarts et corrections nécessaires