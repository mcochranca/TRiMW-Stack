import { create } from 'zustand';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

interface SceneState {
  doc: Y.Doc | null;
  provider: WebrtcProvider | null;
  sceneObjects: Array<{
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
  }>;
  initCollaboration: (roomId: string) => void;
  addObject: (object: { id: string; position: [number, number, number]; rotation: [number, number, number] }) => void;
  updateObject: (id: string, updates: Partial<{ position: [number, number, number]; rotation: [number, number, number] }>) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  doc: null,
  provider: null,
  sceneObjects: [],

  initCollaboration: (roomId: string) => {
    const doc = new Y.Doc();
    const provider = new WebrtcProvider(roomId, doc);
    const sceneMap = doc.getMap('scene');

    sceneMap.observe(() => {
      set({ sceneObjects: Array.from(sceneMap.values()) });
    });

    set({ doc, provider });
  },

  addObject: (object) => {
    const { doc } = get();
    if (doc) {
      const sceneMap = doc.getMap('scene');
      sceneMap.set(object.id, object);
    }
  },

  updateObject: (id, updates) => {
    const { doc } = get();
    if (doc) {
      const sceneMap = doc.getMap('scene');
      const currentObject = sceneMap.get(id);
      if (currentObject) {
        sceneMap.set(id, { ...currentObject, ...updates });
      }
    }
  },
}));