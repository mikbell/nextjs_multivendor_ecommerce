// Store Tips
export {
  storeBasicInfoTips,
  storeMediaTips,
  storeShippingTips,
} from "./storeTips";

// Category Tips
export {
  categoryBasicInfoTips,
  categoryImageTips,
  categorySettingsTips,
} from "./categoryTips";

// SubCategory Tips (simili alle categorie ma più specifici)
export const subCategoryBasicInfoTips = [
  {
    id: "subcategory-name-tip",
    title: "Nome specifico",
    description: "Il nome della sottocategoria deve essere più specifico della categoria padre. Ad esempio: 'T-shirt Uomo' sotto 'Abbigliamento Maschile'.",
  },
  {
    id: "subcategory-parent-tip",
    title: "Categoria padre logica",
    description: "Scegli la categoria padre più appropriata per mantenere una gerarchia logica e intuitiva.",
  },
];

export const subCategoryImageTips = [
  {
    id: "subcategory-image-consistent",
    title: "Stile consistente",
    description: "Mantieni uno stile visivo coerente con la categoria padre per una migliore user experience.",
  },
];

export const subCategorySettingsTips = [
  {
    id: "subcategory-featured-selective",
    title: "Selezione strategica",
    description: "Metti in evidenza solo le sottocategorie più popolari per non sovraccaricare la navigazione.",
  },
];