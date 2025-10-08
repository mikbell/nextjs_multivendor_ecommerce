"use client";

/**
 * Lista completa di attributi problematici delle estensioni browser
 */
const EXTENSION_ATTRIBUTES = [
  'data-np-intersection-state',
  'data-np-checked', 
  'data-np-watching',
  'data-lp-ignore',
  'data-lpignore',
  'data-form-type',
  'data-ms-editor',
  'data-ms-input-placeholder',
  'data-gramm',
  'data-gramm_editor',
  'data-enable-grammarly',
  'data-lastpass-icon-added',
  'data-dashlane-rid',
  'data-bitwarden-watching',
];

/**
 * Funzione per pulire un singolo elemento dagli attributi delle estensioni
 */
export function cleanElementFromExtensions(element: Element) {
  EXTENSION_ATTRIBUTES.forEach(attr => {
    if (element.hasAttribute(attr)) {
      element.removeAttribute(attr);
    }
  });
  
  // Pattern matching per attributi con prefissi
  Array.from(element.attributes).forEach(attribute => {
    if (attribute.name.startsWith('data-auto-') || 
        attribute.name.startsWith('data-extension-')) {
      element.removeAttribute(attribute.name);
    }
  });
}

/**
 * Funzione per pulire tutto il documento dagli attributi delle estensioni
 */
export function cleanDocumentFromExtensions() {
  if (typeof window === 'undefined') return;
  
  // Clean all elements
  const allElements = document.querySelectorAll('*');
  allElements.forEach(cleanElementFromExtensions);
}

/**
 * Setup globale per pulizia automatica
 */
export function setupGlobalExtensionCleaning() {
  if (typeof window === 'undefined') return;
  
  // Clean on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanDocumentFromExtensions);
  } else {
    cleanDocumentFromExtensions();
  }
  
  // Clean periodically (every 3 seconds)
  setInterval(cleanDocumentFromExtensions, 3000);
  
  // Clean on window focus (when user comes back to tab)
  window.addEventListener('focus', cleanDocumentFromExtensions);
  
  // Setup mutation observer for the document
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const target = mutation.target as Element;
        const attributeName = mutation.attributeName;
        
        if (attributeName && (
          EXTENSION_ATTRIBUTES.includes(attributeName) ||
          attributeName.startsWith('data-auto-') ||
          attributeName.startsWith('data-extension-')
        )) {
          target.removeAttribute(attributeName);
        }
      }
      
      // Clean newly added nodes
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            cleanElementFromExtensions(node as Element);
            const descendants = (node as Element).querySelectorAll('*');
            descendants.forEach(cleanElementFromExtensions);
          }
        });
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true
  });
  
  return observer;
}