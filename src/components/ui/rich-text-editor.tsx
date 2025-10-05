"use client";

import React, { useRef, useMemo } from 'react';
import { useTheme } from 'next-themes';
import JoditEditor from 'jodit-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content...",
  disabled = false,
  height = 300,
  className = "",
}) => {
  const editor = useRef(null);
  const { theme, systemTheme } = useTheme();
  
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const config = useMemo(() => ({
    theme: isDark ? 'dark' : 'default',
    height,
    readonly: disabled,
    placeholder,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'middle' as const,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html' as any, // Bypass strict type checking for this Jodit config
    beautyHTML: false,
    
    // Color palettes
    colors: {
      greyscale: [
        '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC',
        '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'
      ],
      palette: [
        '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF',
        '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'
      ],
      full: [
        '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3',
        '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC', '#DD7E6B', '#EA9999',
        '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8',
        '#B4A7D6', '#D5A6BD', '#CC4125', '#E06666', '#F6B26B', '#FFD966',
        '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0'
      ]
    },

    // Font configurations
    controls: {
      font: {
        list: {
          'Arial,Helvetica,sans-serif': 'Arial',
          'Georgia,serif': 'Georgia',
          'Impact,Charcoal,sans-serif': 'Impact',
          'Tahoma,Geneva,sans-serif': 'Tahoma',
          'Times New Roman,Times,serif': 'Times New Roman',
          'Verdana,Geneva,sans-serif': 'Verdana',
          'Courier New,Courier,monospace': 'Courier New'
        }
      },
      fontsize: {
        list: [
          '8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48', '60', '72'
        ]
      }
    },

    // Button configurations for different screen sizes
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'link', 'table', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize'
    ],
    
    buttonsXS: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', '|',
      'image', 'link', '|',
      'align', 'undo', 'redo'
    ],

    buttonsMD: [
      'source', '|',
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', '|',
      'image', 'link', 'table', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'fullsize'
    ],

    // Custom styling for dark theme
    style: {
      ...(isDark && {
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))'
      })
    },

    // Additional configurations
    uploader: {
      insertImageAsBase64URI: false
    },
    
    removeButtons: ['about'],
    showPlaceholder: true,
    hidePoweredByJodit: true,
    
    // Events
    events: {
      afterInit: function (editor: any) {
        // Apply dark theme styles to the editor
        if (isDark) {
          const editorDoc = (editor as any).editor?.ownerDocument || (editor as any).ownerDocument;
          if (editorDoc) {
            const style = editorDoc.createElement('style');
            style.innerHTML = `
              .jodit-wysiwyg {
                background: hsl(var(--background)) !important;
                color: hsl(var(--foreground)) !important;
              }
              .jodit-wysiwyg * {
                color: hsl(var(--foreground)) !important;
              }
              .jodit-toolbar-button {
                background: hsl(var(--background)) !important;
                color: hsl(var(--foreground)) !important;
                border-color: hsl(var(--border)) !important;
              }
              .jodit-toolbar-button:hover {
                background: hsl(var(--accent)) !important;
              }
              .jodit-toolbar {
                background: hsl(var(--background)) !important;
                border-color: hsl(var(--border)) !important;
              }
              .jodit-status-bar {
                background: hsl(var(--background)) !important;
                color: hsl(var(--muted-foreground)) !important;
                border-color: hsl(var(--border)) !important;
              }
            `;
            editorDoc.head.appendChild(style);
          }
        }
      }
    }
  }), [isDark, disabled, placeholder, height]);

  return (
    <div className={`rich-text-editor ${isDark ? 'dark' : 'light'} ${className}`}>
      <style jsx global>{`
        .jodit-container.jodit_theme_dark {
          background: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        
        .jodit-container.jodit_theme_dark .jodit-workplace {
          background: hsl(var(--background));
        }
        
        .jodit-container.jodit_theme_dark .jodit-wysiwyg {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
        
        .jodit-container.jodit_theme_dark .jodit-toolbar {
          background: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        
        .jodit-container.jodit_theme_dark .jodit-toolbar-button {
          background: transparent;
          color: hsl(var(--foreground));
          border-color: hsl(var(--border));
        }
        
        .jodit-container.jodit_theme_dark .jodit-toolbar-button:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        
        .jodit-container.jodit_theme_dark .jodit-status-bar {
          background: hsl(var(--background));
          color: hsl(var(--muted-foreground));
          border-color: hsl(var(--border));
        }

        /* Light theme improvements */
        .jodit-container:not(.jodit_theme_dark) .jodit-wysiwyg {
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
        
        .jodit-container:not(.jodit_theme_dark) .jodit-toolbar {
          background: hsl(var(--background));
          border-color: hsl(var(--border));
        }
        
        .jodit-container:not(.jodit_theme_dark) .jodit-toolbar-button {
          background: transparent;
          color: hsl(var(--foreground));
        }
        
        .jodit-container:not(.jodit_theme_dark) .jodit-toolbar-button:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .jodit-toolbar-collection {
            flex-wrap: wrap;
          }
          
          .jodit-toolbar-button {
            min-width: 32px !important;
            height: 32px !important;
          }
        }
        
        /* Loading state */
        .rich-text-editor.loading {
          opacity: 0.7;
          pointer-events: none;
        }
        
        /* Focus styles */
        .jodit-container:focus-within {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
        }
      `}</style>
      
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
        onChange={() => {}} // We use onBlur instead for better performance
      />
    </div>
  );
};