import manifest from './media-manifest.json';

type ImageSet = {width:number; height:number; variants:{width:number;src:string}[]};
const images: Record<string, ImageSet> = manifest;
/** Responsive derivatives for local images; originals remain valid as fallbacks. */
export function responsiveImage(src: string, sizes = '100vw') {
 const image = images[src];
 if (!image) return undefined;
 return {src:image.variants[image.variants.length-1].src, srcSet:image.variants.map(v=>`${v.src} ${v.width}w`).join(', '), sizes, width:image.width, height:image.height};
}
/** Pick an appropriately sized derivative for a CSS background. */
export function backgroundImage(src:string, targetWidth=1600) {
 const image=images[src];
 return image?.variants.find(v=>v.width>=targetWidth)?.src ?? image?.variants[image.variants.length-1].src ?? src;
}
