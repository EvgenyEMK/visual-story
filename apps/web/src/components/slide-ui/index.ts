/**
 * slide-ui — Reusable presentation UI components for VisualStory.
 *
 * Three tiers:
 * - Atoms:     SlideTitle, SlideText, IconBadge, MetricDisplay, ProgressBar, StatusDot, SlideImage, CTAButton
 * - Molecules: FeatureCard, StatCard, QuoteBlock, HeroSpotlight, FlowNode, TitleBar, ItemThumbnail, DetailPopup, ItemsList, StatusLegend
 * - Layouts:   GridOfCards, SidebarDetail, CenterStageShelf, BentoLayout, CardExpandLayout, HorizontalTimeline, HubSpoke, TitleSlide, StackOfCards, StatDashboard
 *
 * Icon libraries available:
 * - lucide-react  (~1500 clean line icons)
 * - @phosphor-icons/react (~7700 icons, 6 weights)
 * - @tabler/icons-react (~4950 consistent icons)
 */

// Types
export type {
  IconProp,
  EntranceType,
  EntranceProps,
  StaggerProps,
  SlideTheme,
  ComponentSize,
  AccentColor,
} from './types';

// Utilities
export { renderIcon } from './render-icon';
export { entranceVariants, getEntranceMotion } from './entrance';

// Atoms
export { SlideTitle } from './atoms/SlideTitle';
export { SlideText } from './atoms/SlideText';
export { IconBadge } from './atoms/IconBadge';
export { MetricDisplay } from './atoms/MetricDisplay';
export { ProgressBar } from './atoms/ProgressBar';
export { StatusDot } from './atoms/StatusDot';
export { SlideImage } from './atoms/SlideImage';
export { CTAButton } from './atoms/CTAButton';

// Molecules
export { FeatureCard } from './molecules/FeatureCard';
export { StatCard } from './molecules/StatCard';
export { QuoteBlock } from './molecules/QuoteBlock';
export { HeroSpotlight } from './molecules/HeroSpotlight';
export { FlowNode } from './molecules/FlowNode';
export { TitleBar } from './molecules/TitleBar';
export { ItemThumbnail } from './molecules/ItemThumbnail';
export { DetailPopup } from './molecules/DetailPopup';
export { ItemsList } from './molecules/ItemsList';
export type { ListItem, ListHeader, ListRow } from './molecules/ItemsList';
export { StatusLegend } from './molecules/StatusLegend';
export type { LegendEntry } from './molecules/StatusLegend';

// Layouts
export { GridOfCards } from './layouts/GridOfCards';
export { SidebarDetail } from './layouts/SidebarDetail';
export { CenterStageShelf } from './layouts/CenterStageShelf';
export { BentoLayout } from './layouts/BentoLayout';
export { CardExpandLayout } from './layouts/CardExpandLayout';
export type { CardExpandItem, CardExpandVariant, CardExpandLayoutProps, CollapsedCardType } from './layouts/CardExpandLayout';
export { HorizontalTimeline } from './layouts/HorizontalTimeline';
export { HubSpoke } from './layouts/HubSpoke';
export { TitleSlide } from './layouts/TitleSlide';
export { StackOfCards } from './layouts/StackOfCards';
export { StatDashboard } from './layouts/StatDashboard';
