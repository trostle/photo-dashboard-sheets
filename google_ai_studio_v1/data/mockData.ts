
import { Photo } from '../types';

const photographers = ["Alex Johnson", "Maria Garcia", "Chen Wei", "Fatima Al-Fassi", "David Smith"];
const tags = ["nature", "city", "portrait", "animal", "landscape", "abstract", "food", "travel"];
const cameras = ["Sony A7 IV", "Canon EOS R5", "Nikon Z7 II", "Fujifilm X-T4"];
const lenses = ["50mm f/1.8", "24-70mm f/2.8", "85mm f/1.4", "16-35mm f/4"];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomTags = (): string[] => {
    const numTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
};
const getRandomDate = (): string => {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

export const mockPhotos: Photo[] = Array.from({ length: 40 }, (_, i) => ({
  id: `photo_${i + 1}`,
  url: `https://picsum.photos/seed/${i + 1}/800/600`,
  title: `Photo Title ${i + 1}`,
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  photographer: getRandomItem(photographers),
  uploadDate: getRandomDate(),
  approved: Math.random() > 0.4, // ~60% approved
  tags: getRandomTags(),
  metadata: {
    camera: getRandomItem(cameras),
    lens: getRandomItem(lenses),
    aperture: `f/${(Math.random() * 8 + 1.8).toFixed(1)}`,
    shutterSpeed: `1/${Math.floor(Math.random() * 1000) + 50}s`,
    iso: [100, 200, 400, 800, 1600][Math.floor(Math.random() * 5)]
  },
}));
