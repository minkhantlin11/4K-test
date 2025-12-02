export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K"
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT_2_3 = "2:3",
  LANDSCAPE_3_2 = "3:2",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9",
  CINEMATIC_21_9 = "21:9"
}

export interface VibePreset {
  id: string;
  label: string;
  promptFragment: string;
}

export const CAMERA_ANGLES: VibePreset[] = [
  { id: 'cam1', label: 'Low Angle God', promptFragment: 'shot from a dramatic low angle, looking up at the subject, imposing presence' },
  { id: 'cam2', label: 'Golden Hour Worship', promptFragment: 'shot during golden hour with warm sun flares directly into the lens' },
  { id: 'cam3', label: 'Over-the-Shoulder Tease', promptFragment: 'over-the-shoulder POV shot, intimate and cinematic depth of field' },
  { id: 'cam4', label: 'Cinematic Orbit', promptFragment: 'dynamic orbital camera movement frozen in time, motion blur on background' },
  { id: 'cam5', label: 'POV You’re In Love', promptFragment: 'intimate close-up POV, shallow depth of field focusing on eyes, dreamy soft focus' },
  { id: 'cam6', label: 'Drone God’s Eye', promptFragment: 'high angle top-down view, fashion editorial composition' },
  { id: 'cam7', label: 'Fisheye 90s', promptFragment: 'extreme wide angle fisheye lens, 90s music video aesthetic' },
];

export const MODEL_POSES: VibePreset[] = [
  { id: 'pose1', label: 'Just Woke Up Angel', promptFragment: 'sitting up in bed, messy hair perfection, stretching arms, soft expression' },
  { id: 'pose2', label: 'Counter Lean Brat', promptFragment: 'leaning back against a counter, crossing ankles, confident smirk, casual defiance' },
  { id: 'pose3', label: 'Slow Walk Wind', promptFragment: 'walking towards camera, wind blowing hair back, clothes flowing dynamically' },
  { id: 'pose4', label: 'Hands In Hair', promptFragment: 'both hands running through hair, elbows out, looking off camera, vogue cover style' },
  { id: 'pose5', label: 'Gym Mirror', promptFragment: 'standing confident, athletic posture, checking reflection, intense focus' },
  { id: 'pose6', label: 'Floating Zen', promptFragment: 'body suspended in zero gravity, clothes floating, serene expression' },
  { id: 'pose7', label: 'Cyberpunk Crouch', promptFragment: 'crouching on a ledge, futuristic city background, ready for action' },
];

export const LIGHTING_MOODS: VibePreset[] = [
  { id: 'light1', label: 'Neon Tokyo Vice', promptFragment: 'illuminated by pink and cyan neon signs, rain-slicked reflections, high contrast' },
  { id: 'light2', label: 'Sunset Rim Light', promptFragment: 'strong orange rim light outlining the silhouette, dark shadows, dramatic' },
  { id: 'light3', label: 'Moody Chiaroscuro', promptFragment: 'Renaissance painting lighting, deep shadows and focused soft light beams' },
  { id: 'light4', label: 'Ring Light Demon', promptFragment: 'perfect circular ring light reflection in eyes, flawless skin illumination, beauty studio lighting' },
  { id: 'light5', label: 'Soft Morning Window', promptFragment: 'diffused natural light coming from a large window, ethereal and airy' },
  { id: 'light6', label: 'Cyberpunk Rain', promptFragment: 'heavy rain at night, wet skin, reflections of street lights, cold blue tones' },
  { id: 'light7', label: 'Studio Strobe', promptFragment: 'high-key fashion photography lighting, pure white background, crisp details' },
];

export interface AppState {
  image: File | null;
  imagePreviewUrl: string | null;
  analyzedDescription: string | null;
  resolution: ImageResolution;
  aspectRatio: AspectRatio;
  selectedAngle: VibePreset | null;
  selectedPose: VibePreset | null;
  selectedLight: VibePreset | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  error: string | null;
}