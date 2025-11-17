import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface StoryVideoProps {
  images: string[];
  audioUrl: string;
  title: string;
  secondsPerImage: number;
  style: 'simple' | 'advanced';
}

const ImageScene: React.FC<{
  src: string;
  style: 'simple' | 'advanced';
}> = ({ src, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fps, fps * 2, fps * 3],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale =
    style === 'advanced'
      ? interpolate(frame, [0, fps * 3], [1, 1.1], {
          extrapolateRight: 'clamp',
        })
      : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const StoryVideo: React.FC<StoryVideoProps> = ({
  images,
  audioUrl,
  title,
  secondsPerImage,
  style,
}) => {
  const { fps } = useVideoConfig();
  const framesPerImage = Math.round(secondsPerImage * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence durationInFrames={fps * 3}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontSize: '80px',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center',
              padding: '0 100px',
            }}
          >
            {title}
          </h1>
        </AbsoluteFill>
      </Sequence>

      {images.map((image, index) => (
        <Sequence
          key={index}
          from={fps * 3 + index * framesPerImage}
          durationInFrames={framesPerImage}
        >
          <ImageScene src={image} style={style} />
        </Sequence>
      ))}

      <Audio src={audioUrl} />
    </AbsoluteFill>
  );
};
