type MobileNetPrediction = {
  className: string;
  probability: number;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "of",
  "or",
  "the",
  "with",
]);

let modelPromise: Promise<{
  classify: (img: HTMLImageElement, topk?: number) => Promise<MobileNetPrediction[]>;
}> | null = null;

async function loadModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import("@tensorflow/tfjs");
      const mobilenet = await import("@tensorflow-models/mobilenet");
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })();
  }

  return modelPromise;
}

function toTagCandidates(className: string): string[] {
  return className
    .split(",")
    .flatMap((segment) => segment.split(/\s+/))
    .map((part) => part.trim().toLowerCase())
    .map((part) => part.replace(/[^a-z0-9-]/g, ""))
    .filter((part) => part.length >= 3 && !STOP_WORDS.has(part));
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for labeling."));
    img.src = src;
  });
}

export async function labelImageFromUrl(previewUrl: string, topk = 3) {
  const [model, img] = await Promise.all([loadModel(), loadImage(previewUrl)]);
  const predictions = await model.classify(img, topk);

  const suggestions = unique(
    predictions.flatMap((prediction) => toTagCandidates(prediction.className))
  ).slice(0, 8);

  return { predictions, suggestions };
}
