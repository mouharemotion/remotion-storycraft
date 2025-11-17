import React from 'react';
import { Composition } from 'remotion';
import { StoryVideo } from './StoryVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StoryVideo"
      component={StoryVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        images: [],
        audioUrl: '',
        title: 'Story Title',
        secondsPerImage: 15,
        style: 'simple',
      }}
    />
  );
};
