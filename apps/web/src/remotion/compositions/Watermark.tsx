/**
 * Watermark overlay for free-tier video exports.
 * Rendered as an absolute-positioned element in the bottom-right corner.
 * @source docs/modules/export-publish/video-export.md
 */

import { AbsoluteFill } from 'remotion';

export function Watermark() {
  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '12px 20px',
          opacity: 0.5,
          fontSize: 14,
          color: '#999999',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '0.02em',
        }}
      >
        Made with VisualFlow
      </div>
    </AbsoluteFill>
  );
}
