/**
 * Widget Configuration Schema System
 *
 * A generic, declarative data model that describes the configurable properties
 * of each smart widget type. The properties panel reads this schema at runtime
 * to auto-render the appropriate form controls — no widget-specific UI code
 * is needed in the panel itself.
 *
 * ## Architecture
 *
 * Each widget type registers a `WidgetTypeDescriptor` that declares:
 *   - Identity (type, display name, icon)
 *   - Field groups (collapsible sections in the panel)
 *   - Config fields (individual form controls with type, options, conditions)
 *
 * The `ItemPropertiesPanel` uses `getWidgetSchema(widgetType)` to look up the
 * descriptor and iterates over `configFields` to render controls. Field values
 * are read from / written to the widget's `config` record.
 *
 * ## Adding a new widget type
 *
 * 1. Define the config interface in `@/types/` (e.g. SmartListConfig)
 * 2. Add a `WidgetTypeDescriptor` to `WIDGET_SCHEMAS` below
 * 3. The properties panel will auto-render — no panel code changes needed
 *
 * @source docs/product-modules/slide-editor/element-editing/smart-item-lists.md
 */

// ---------------------------------------------------------------------------
// Schema Types
// ---------------------------------------------------------------------------

/**
 * Supported control types for widget configuration fields.
 *
 * Each maps to a specific UI control in the properties panel:
 *   - 'select'       → <select> dropdown
 *   - 'toggle'       → boolean switch / checkbox
 *   - 'number'       → numeric input with optional min/max/step
 *   - 'slider'       → range slider with min/max
 *   - 'text'         → single-line text input
 *   - 'color'        → color picker
 *   - 'multi-select' → checkbox group or multi-select dropdown
 *   - 'icon-set'     → special icon-set picker (renders icon previews)
 */
export type WidgetFieldType =
  | 'select'
  | 'toggle'
  | 'number'
  | 'slider'
  | 'text'
  | 'color'
  | 'multi-select'
  | 'icon-set';

/** A single option in a select or multi-select field. */
export interface WidgetFieldOption {
  value: string;
  label: string;
  /** Optional description shown as tooltip or secondary text. */
  description?: string;
}

/**
 * Describes a single configurable property of a widget.
 *
 * The properties panel reads this descriptor to render the correct UI control,
 * apply validation, and bind the value to the widget's config record.
 */
export interface WidgetConfigFieldDescriptor {
  /** Config key path (e.g. 'iconSetId', 'revealMode'). */
  key: string;

  /** Human-readable label shown next to the control. */
  label: string;

  /** Which form control to render. */
  type: WidgetFieldType;

  /** Group ID — fields are rendered inside their group's section. */
  group: string;

  /** Tooltip or helper text shown below the control. */
  description?: string;

  /** Default value when the config key is absent. */
  defaultValue?: unknown;

  // --- Type-specific metadata ---

  /** Options for 'select' and 'multi-select' fields. */
  options?: WidgetFieldOption[];

  /** Minimum value for 'number' and 'slider' fields. */
  min?: number;

  /** Maximum value for 'number' and 'slider' fields. */
  max?: number;

  /** Step increment for 'number' and 'slider' fields. */
  step?: number;

  /** Suffix text shown after the input (e.g. 'px', 's', '%'). */
  suffix?: string;

  /** Placeholder text for 'text' and 'number' fields. */
  placeholder?: string;

  // --- Conditional visibility ---

  /**
   * Show this field only when another field has a specific value.
   * Enables progressive disclosure — e.g. show numbering format
   * only when showNumbering is true.
   */
  visibleWhen?: {
    field: string;
    equals: unknown;
  };

  /** Whether this field is required. Default: false. */
  required?: boolean;
}

/**
 * A collapsible group of fields in the properties panel.
 * Fields reference their group by ID.
 */
export interface WidgetFieldGroup {
  /** Unique group ID (referenced by field.group). */
  id: string;

  /** Display label for the section header. */
  label: string;

  /** Whether the section can be collapsed. Default: true. */
  collapsible?: boolean;

  /** Whether the section starts collapsed. Default: false. */
  defaultCollapsed?: boolean;

  /** Icon or emoji for the section header. */
  icon?: string;
}

/**
 * Complete schema descriptor for a widget type.
 *
 * This is the single source of truth that the properties panel uses to
 * render configuration controls for any smart widget.
 */
export interface WidgetTypeDescriptor {
  /** Widget type identifier — matches WidgetItem.widgetType. */
  widgetType: string;

  /** Human-readable display name (shown in panel header). */
  displayName: string;

  /** Icon or emoji for the widget type. */
  icon: string;

  /** Short description of the widget. */
  description: string;

  /** Ordered list of field groups (sections in the panel). */
  fieldGroups: WidgetFieldGroup[];

  /** All configurable fields for this widget type. */
  configFields: WidgetConfigFieldDescriptor[];
}

// ---------------------------------------------------------------------------
// Smart List Schema
// ---------------------------------------------------------------------------

const SMART_LIST_SCHEMA: WidgetTypeDescriptor = {
  widgetType: 'smart-list',
  displayName: 'Task List',
  icon: '☑️',
  description: 'Interactive checklist with status icons, grouping, and presentation animations.',

  fieldGroups: [
    { id: 'data-source', label: 'Data Source', icon: '📂' },
    { id: 'display', label: 'Display', icon: '👁️' },
    { id: 'icons', label: 'Icons & Status', icon: '🎨' },
    { id: 'numbering', label: 'Numbering', icon: '#️⃣', defaultCollapsed: true },
    { id: 'animation', label: 'Animation', icon: '✨' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️', defaultCollapsed: true },
  ],

  configFields: [
    // --- Data Source ---
    {
      key: 'sourceId',
      label: 'Shared Source',
      type: 'select',
      group: 'data-source',
      description: 'Link to a shared data source. When set, items come from the source instead of embedded data.',
      defaultValue: undefined,
      options: [
        { value: '', label: 'Embedded (local)' },
      ],
    },

    // --- Display ---
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      group: 'display',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
    },
    {
      key: 'collapseDefault',
      label: 'Collapse Behavior',
      type: 'select',
      group: 'display',
      defaultValue: 'all-expanded',
      description: 'How sub-items appear by default.',
      options: [
        { value: 'all-expanded', label: 'All Expanded' },
        { value: 'all-collapsed', label: 'All Collapsed' },
        { value: 'first-expanded', label: 'First Expanded' },
        { value: 'top-level-only', label: 'Top Level Only' },
      ],
    },
    {
      key: 'showAccentBar',
      label: 'Show Accent Bar',
      type: 'toggle',
      group: 'display',
      defaultValue: true,
      description: 'Show a colored left border on each item.',
    },
    {
      key: 'conditionalFormatting',
      label: 'Conditional Formatting',
      type: 'toggle',
      group: 'display',
      defaultValue: false,
      description: 'Auto-color rows based on their status icon.',
    },
    {
      key: 'conditionalFormatIntensity',
      label: 'Format Intensity',
      type: 'select',
      group: 'display',
      defaultValue: 'subtle',
      visibleWhen: { field: 'conditionalFormatting', equals: true },
      options: [
        { value: 'subtle', label: 'Subtle' },
        { value: 'medium', label: 'Medium' },
        { value: 'strong', label: 'Strong' },
      ],
    },
    {
      key: 'detailMode',
      label: 'Detail Display',
      type: 'select',
      group: 'display',
      defaultValue: 'none',
      description: 'How expandable per-item details are shown.',
      options: [
        { value: 'none', label: 'None' },
        { value: 'inline', label: 'Inline' },
        { value: 'callout', label: 'Callout Popup' },
      ],
    },
    {
      key: 'progressSummary',
      label: 'Progress Summary',
      type: 'select',
      group: 'display',
      defaultValue: 'hidden',
      description: 'Show a completion progress bar.',
      options: [
        { value: 'hidden', label: 'Hidden' },
        { value: 'above', label: 'Above List' },
        { value: 'below', label: 'Below List' },
      ],
    },

    // --- Icons & Status ---
    {
      key: 'iconSetId',
      label: 'Primary Icon Set',
      type: 'icon-set',
      group: 'icons',
      defaultValue: 'task-status',
      description: 'Icon set used for the primary status column.',
    },
    {
      key: 'secondaryIconSetId',
      label: 'Secondary Icon Set',
      type: 'icon-set',
      group: 'icons',
      defaultValue: undefined,
      description: 'Optional second icon column (e.g. priority).',
    },

    // --- Numbering ---
    {
      key: 'showNumbering',
      label: 'Show Numbering',
      type: 'toggle',
      group: 'numbering',
      defaultValue: false,
      description: 'Display auto-numbering before each item.',
    },
    {
      key: 'numberingFormat',
      label: 'Number Format',
      type: 'select',
      group: 'numbering',
      defaultValue: '1.',
      visibleWhen: { field: 'showNumbering', equals: true },
      options: [
        { value: '1.', label: '1. 2. 3.' },
        { value: 'a.', label: 'a. b. c.' },
        { value: 'a)', label: 'a) b) c)' },
        { value: 'i.', label: 'i. ii. iii.' },
        { value: 'Step N', label: 'Step 1, Step 2' },
        { value: '01.', label: '01. 02. 03.' },
      ],
    },
    {
      key: 'childNumberingFormat',
      label: 'Child Format',
      type: 'select',
      group: 'numbering',
      defaultValue: 'a)',
      visibleWhen: { field: 'showNumbering', equals: true },
      description: 'Numbering format for nested items.',
      options: [
        { value: '1.', label: '1. 2. 3.' },
        { value: 'a.', label: 'a. b. c.' },
        { value: 'a)', label: 'a) b) c)' },
        { value: 'i.', label: 'i. ii. iii.' },
      ],
    },

    // --- Animation ---
    {
      key: 'revealMode',
      label: 'Reveal Mode',
      type: 'select',
      group: 'animation',
      defaultValue: 'all-at-once',
      description: 'How items appear during presentation playback.',
      options: [
        { value: 'all-at-once', label: 'All at Once' },
        { value: 'one-by-one-focus', label: 'One by One (Focus)' },
        { value: 'one-by-one-accumulate', label: 'One by One (Accumulate)' },
        { value: 'by-section', label: 'By Section' },
      ],
    },
    {
      key: 'entrance',
      label: 'Entrance Animation',
      type: 'select',
      group: 'animation',
      defaultValue: 'fade',
      options: [
        { value: 'none', label: 'None' },
        { value: 'fade', label: 'Fade' },
        { value: 'float-in', label: 'Float In' },
        { value: 'pop-zoom', label: 'Pop Zoom' },
        { value: 'slide-up', label: 'Slide Up' },
        { value: 'slide-left', label: 'Slide Left' },
        { value: 'scale-in', label: 'Scale In' },
      ],
    },
    {
      key: 'stagger',
      label: 'Stagger Delay',
      type: 'slider',
      group: 'animation',
      defaultValue: 0.06,
      min: 0,
      max: 0.5,
      step: 0.01,
      suffix: 's',
      description: 'Delay between each item entrance.',
    },

    // --- Advanced ---
    {
      key: 'groupByStatus',
      label: 'Group by Status',
      type: 'toggle',
      group: 'advanced',
      defaultValue: false,
      description: 'Group items by their primary icon status.',
    },
    {
      key: 'filterByStatuses',
      label: 'Filter Statuses',
      type: 'multi-select',
      group: 'advanced',
      defaultValue: [],
      description: 'Only show items with specific statuses. Empty = show all.',
      options: [],
    },
    {
      key: 'linkedLegendId',
      label: 'Linked Legend',
      type: 'text',
      group: 'advanced',
      defaultValue: undefined,
      description: 'ID of a SmartLegend widget to link.',
      placeholder: 'e.g. legend-widget-1',
    },
  ],
};

// ---------------------------------------------------------------------------
// Smart Legend Schema (placeholder for future)
// ---------------------------------------------------------------------------

const SMART_LEGEND_SCHEMA: WidgetTypeDescriptor = {
  widgetType: 'smart-legend',
  displayName: 'Legend',
  icon: '🏷️',
  description: 'Interactive legend linked to a Smart List widget.',

  fieldGroups: [
    { id: 'display', label: 'Display', icon: '👁️' },
    { id: 'link', label: 'Link', icon: '🔗' },
  ],

  configFields: [
    {
      key: 'orientation',
      label: 'Orientation',
      type: 'select',
      group: 'display',
      defaultValue: 'horizontal',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
    },
    {
      key: 'size',
      label: 'Size',
      type: 'select',
      group: 'display',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
    },
    {
      key: 'linkedListId',
      label: 'Linked List Widget',
      type: 'text',
      group: 'link',
      defaultValue: undefined,
      description: 'ID of the SmartList widget this legend is linked to.',
      placeholder: 'e.g. smart-list-widget-1',
    },
  ],
};

// ---------------------------------------------------------------------------
// Schema Registry
// ---------------------------------------------------------------------------

/** All registered widget type schemas. */
const WIDGET_SCHEMAS: Record<string, WidgetTypeDescriptor> = {
  'smart-list': SMART_LIST_SCHEMA,
  'smart-legend': SMART_LEGEND_SCHEMA,
};

/**
 * Look up the configuration schema for a widget type.
 *
 * Returns `undefined` if the widget type has no registered schema.
 */
export function getWidgetSchema(widgetType: string): WidgetTypeDescriptor | undefined {
  return WIDGET_SCHEMAS[widgetType];
}

/**
 * Get all registered widget type schemas.
 */
export function getAllWidgetSchemas(): WidgetTypeDescriptor[] {
  return Object.values(WIDGET_SCHEMAS);
}

/**
 * Get the config fields for a specific group within a widget schema.
 * Respects `visibleWhen` conditions based on the current config values.
 */
export function getVisibleFields(
  schema: WidgetTypeDescriptor,
  groupId: string,
  currentConfig: Record<string, unknown>,
): WidgetConfigFieldDescriptor[] {
  return schema.configFields
    .filter((f) => f.group === groupId)
    .filter((f) => {
      if (!f.visibleWhen) return true;
      const currentValue = currentConfig[f.visibleWhen.field];
      return currentValue === f.visibleWhen.equals;
    });
}
