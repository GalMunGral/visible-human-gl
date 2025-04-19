export function imageToUint8Array(image: HTMLImageElement): Uint8ClampedArray {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, image.width, image.height).data;
}

async function loadImage(url: string): Promise<Uint8ClampedArray> {
  const img = new Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onload = () => resolve(imageToUint8Array(img));
  });
}

export async function load3dTexture(layerSize: number, numLayers: number) {
  const tasks = new Array<Promise<Uint8ClampedArray>>(numLayers);
  for (let i = 0; i < numLayers; ++i) {
    tasks[i] = loadImage(`./public/texture/texture-${i}.png`);
  }
  const layers = await Promise.all(tasks);
  const texture3d = new Uint8Array(layerSize * numLayers * 4);
  for (let i = 0; i < numLayers; ++i) {
    texture3d.set(layers[i], i * layerSize * 4);
  }
  return texture3d;
}
