import React, { useRef, useState, useEffect } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { AppText } from './AppText';
import { IconButton } from './IconButton';

const { width: screenWidth } = Dimensions.get('window');

export type ReelPlayerProps = {
  videoUrl: string;
  title?: string;
  duration?: number;
  onComplete?: () => void;
  autoPlay?: boolean;
};

export function ReelPlayer({
  videoUrl,
  title,
  duration,
  onComplete,
  autoPlay = true
}: ReelPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [autoPlay]);

  const togglePlayback = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    setIsPlaying(status.isLoaded && status.isPlaying);

    // Call onComplete when video finishes
    if (status.isLoaded && status.didJustFinish && onComplete) {
      onComplete();
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View className="relative">
      <Pressable
        onPress={() => setShowControls(!showControls)}
        className="relative"
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={{
            width: screenWidth,
            height: (screenWidth * 9) / 16, // 16:9 aspect ratio
          }}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <View className="absolute inset-0 justify-center items-center bg-black/20">
            <View className="bg-white/90 rounded-full p-4">
              <IconButton
                icon="play"
                onPress={togglePlayback}
                size="lg"
                variant="ghost"
              />
            </View>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                {title && (
                  <AppText variant="h3" className="text-white mb-1">
                    {title}
                  </AppText>
                )}
                {duration && (
                  <AppText variant="caption" className="text-white/80">
                    {formatDuration(duration)}
                  </AppText>
                )}
              </View>

              <IconButton
                icon={isPlaying ? "pause" : "play"}
                onPress={togglePlayback}
                size="md"
                variant="ghost"
                className="text-white"
              />
            </View>
          </View>
        )}
      </Pressable>
    </View>
  );
}