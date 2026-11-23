import { create } from "zustand";
import { Track } from "@/types/music";
import { mockTracks } from "@/data/mock-tracks";

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  queue: Track[];
  history: Track[];
  isQueueOpen: boolean;
  isExpandedPlayerOpen: boolean;

  // Actions
  playTrack: (track: Track, contextTracks?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  toggleQueue: () => void;
  setQueueOpen: (open: boolean) => void;
  toggleExpandedPlayer: () => void;
  setExpandedPlayerOpen: (open: boolean) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: mockTracks[0], // Starts with "Ethereal Fjord"
  isPlaying: false,
  currentTime: 0,
  duration: mockTracks[0].duration,
  volume: 0.8,
  isMuted: false,
  isShuffle: false,
  repeatMode: "off",
  queue: mockTracks.slice(1, 6), // pre-populated queue
  history: [],
  isQueueOpen: false,
  isExpandedPlayerOpen: false,

  playTrack: (track, contextTracks) => {
    const { currentTrack, history } = get();
    const newHistory = currentTrack ? [currentTrack, ...history.slice(0, 19)] : history;

    let newQueue = get().queue;
    if (contextTracks && contextTracks.length > 0) {
      const remainingContext = contextTracks.filter((t) => t.id !== track.id);
      newQueue = remainingContext;
    }

    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: track.duration,
      history: newHistory,
      queue: newQueue,
    });
  },

  togglePlay: () => {
    const { isPlaying, currentTrack } = get();
    if (!currentTrack) {
      const first = mockTracks[0];
      set({ currentTrack: first, isPlaying: true, duration: first.duration, currentTime: 0 });
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  seek: (seconds) => {
    const { duration } = get();
    const clamped = Math.max(0, Math.min(seconds, duration));
    set({ currentTime: clamped });
  },

  nextTrack: () => {
    const { queue, history, currentTrack, repeatMode, isShuffle } = get();
    if (repeatMode === "one") {
      set({ currentTime: 0, isPlaying: true });
      return;
    }

    if (queue.length === 0) {
      if (repeatMode === "all" && history.length > 0) {
        const restartedQueue = [...history].reverse();
        const next = restartedQueue[0];
        set({
          currentTrack: next,
          queue: restartedQueue.slice(1),
          history: currentTrack ? [currentTrack] : [],
          currentTime: 0,
          duration: next.duration,
          isPlaying: true,
        });
      } else {
        set({ isPlaying: false, currentTime: 0 });
      }
      return;
    }

    let nextIndex = 0;
    if (isShuffle && queue.length > 1) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    const nextTrack = queue[nextIndex];
    const remainingQueue = queue.filter((_, idx) => idx !== nextIndex);
    const newHistory = currentTrack ? [currentTrack, ...history] : history;

    set({
      currentTrack: nextTrack,
      queue: remainingQueue,
      history: newHistory,
      currentTime: 0,
      duration: nextTrack.duration,
      isPlaying: true,
    });
  },

  prevTrack: () => {
    const { currentTime, history, currentTrack, queue } = get();
    // If track has been playing for more than 3 seconds, restart current track
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    if (history.length === 0) {
      set({ currentTime: 0 });
      return;
    }

    const prevTrack = history[0];
    const newHistory = history.slice(1);
    const newQueue = currentTrack ? [currentTrack, ...queue] : queue;

    set({
      currentTrack: prevTrack,
      history: newHistory,
      queue: newQueue,
      currentTime: 0,
      duration: prevTrack.duration,
      isPlaying: true,
    });
  },

  setVolume: (volume) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ volume: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    if (isMuted) {
      set({ isMuted: false, volume: volume === 0 ? 0.7 : volume });
    } else {
      set({ isMuted: true });
    }
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  cycleRepeat: () => {
    const { repeatMode } = get();
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    set({ repeatMode: modes[nextIdx] });
  },

  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (trackId) => {
    set((state) => ({ queue: state.queue.filter((t) => t.id !== trackId) }));
  },

  clearQueue: () => set({ queue: [] }),

  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
  setQueueOpen: (open) => set({ isQueueOpen: open }),

  toggleExpandedPlayer: () =>
    set((state) => ({ isExpandedPlayerOpen: !state.isExpandedPlayerOpen })),
  setExpandedPlayerOpen: (open) => set({ isExpandedPlayerOpen: open }),

  tick: () => {
    const { isPlaying, currentTime, duration, nextTrack, repeatMode } = get();
    if (!isPlaying) return;

    if (currentTime + 1 >= duration) {
      if (repeatMode === "one") {
        set({ currentTime: 0 });
      } else {
        nextTrack();
      }
    } else {
      set({ currentTime: currentTime + 1 });
    }
  },
}));
