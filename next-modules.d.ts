/**
 * Declaration for Next.js internal module used during build.
 * Fixes: Could not find a declaration file for module 'next/types.js'
 * and: Cannot use namespace 'ResolvingMetadata' as a type
 */
declare module 'next/types.js' {
  import type { ResolvedMetadata, ResolvedViewport } from 'next/dist/lib/metadata/types/metadata-interface';
  export type ResolvingMetadata = Promise<ResolvedMetadata>;
  export type ResolvingViewport = Promise<ResolvedViewport>;
}

/**
 * Re-export Next.js public types when package types are not fully resolved (e.g. Next 16).
 */
declare module 'next' {
  export type { Metadata, Viewport, ResolvedMetadata } from 'next/dist/lib/metadata/types/metadata-interface';
  export type { NextConfig } from 'next/dist/server/config';
}
