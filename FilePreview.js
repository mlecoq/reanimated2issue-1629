import React from 'react';
import styled, {css} from 'styled-components/native';

import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  scrollTo,
  withSpring,
  useAnimatedRef,
  measure,
  useDerivedValue,
} from 'react-native-reanimated';

import useDeviceDimInfos from './useDeviceDimInfos';

const FileStyle = css`
  flex-direction: ${({theme}) => (theme.isTablet ? 'column' : 'row')};
  width: ${({width}) => width}px;
  position: absolute;
  top: ${({position}) => position.y}px;
  left: ${({position}) => position.x}px;
  padding: 8px;
  height: auto;
`;

const Container = styled.View`
  ${FileStyle}
`;

const Indicator = styled(Animated.View)`
  ${FileStyle}
  top: 0;
  left: 0;
  opacity: 0.5;
  width: ${({theme, width}) => (theme.isTablet ? `${width}px` : '85%')};
`;

const Infos = styled.View`
  margin-top: ${({theme}) => (theme.isTablet ? '8px' : '0')};
`;

const FilePreviewFilename = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({theme}) => theme.textMain};
  max-width: 90%;
`;

const ThumbnailStyle = css`
  width: ${({theme}) => (theme.isTablet ? '100%' : '38px')};
  height: ${({theme}) => (theme.isTablet ? '114px' : '38px')};
  border-radius: 6.4px;
  border-width: 2px;
  border-color: ${({theme}) => theme.border};
`;

const FileThumbnail = styled.Image`
  ${ThumbnailStyle}
`;

const FilePreviewDate = styled.Text`
  font-size: 14px;
  line-height: 19px;
  font-weight: 400;
  color: ${({theme}) => theme.textGrey};
`;

const NameAndOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  margin-left: ${({theme}) => (theme.isTablet ? 0 : '12px')};
  align-items: ${({theme}) => (theme.isTablet ? 'flex-start' : 'center')};
  flex: 1;
`;

const FilePreview = ({
  file,
  scrollView,
  scrollY,
  containerHeight,
  containerWidth,
  contentHeight,
  position,
  width,
  height,
  getTargetPosition,
  folders,
  nbCols,
}) => {
  const x = useSharedValue(position.x);
  const y = useSharedValue(position.y);
  const isGestureActive = useSharedValue(false);

  const indicatorRef = useAnimatedRef();

  const {isTablet} = useDeviceDimInfos();

  const nbFolder = useSharedValue(folders?.length || 0);

  const nbColumns = useSharedValue(nbCols);

  const indicatorHeight = useDerivedValue(() => {
    'worklet';

    try {
      const measured = measure(indicatorRef);
      return measured.height || height;
    } catch {
      return height;
    }
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_event, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
      isGestureActive.value = true;
    },
    onActive: ({translationX, translationY}, ctx) => {
      x.value = Math.min(
        containerWidth - width,
        Math.max(0, ctx.startX + translationX),
      );
      y.value = Math.min(
        contentHeight - indicatorHeight.value,
        Math.max(0, ctx.startY + translationY),
      );

      const lowerBound = scrollY.value;
      const upperBound = lowerBound + containerHeight - indicatorHeight.value;
      const maxScroll = contentHeight - containerHeight;
      const leftToScrollDown = maxScroll - scrollY.value;

      if (y.value < lowerBound) {
        const diff = Math.min(lowerBound - y.value, lowerBound);
        scrollY.value -= diff;
        scrollTo(scrollView, 0, scrollY.value, false);
        ctx.startY -= diff;
        y.value = ctx.startY + translationY;
      }
      if (y.value > upperBound) {
        const diff = Math.min(y.value - upperBound, leftToScrollDown);
        scrollY.value += diff;
        scrollTo(scrollView, 0, scrollY.value, false);
        ctx.startY += diff;
        y.value = ctx.startY + translationY;
      }
    },
    onFinish: (_) => {
      const pos = getTargetPosition(x.value, y.value);

      if (pos.row * nbColumns.value + pos.col < nbFolder.value) {
        isGestureActive.value = false;
        console.log('updated');
      } else {
        x.value = withSpring(position.x, {}, () => {
          isGestureActive.value = false;
        });
        y.value = withSpring(position.y);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(isGestureActive.value ? 1.05 : 1);

    const zIndex = isGestureActive.value ? 4 : 1;

    return {
      transform: [
        {
          translateX: x.value,
        },
        {translateY: y.value},
        {scale},
      ],
      opacity: 0.5,
      zIndex,
    };
  });

  return (
    <>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        hitSlop={isTablet ? undefined : {right: -0.85 * width + 70}}>
        <Indicator
          width={width}
          position={position}
          style={animatedStyle}
          ref={indicatorRef}>
          <FileThumbnail resizeMode="cover" source={file.thumbnail} />
          <NameAndOptions>
            <Infos>
              <FilePreviewFilename numberOfLines={1}>
                {file.name}
              </FilePreviewFilename>
              <FilePreviewDate>
                {file.modifiedAt?.toDateString()}
              </FilePreviewDate>
            </Infos>
          </NameAndOptions>
        </Indicator>
      </PanGestureHandler>

      <Container width={width} position={position}>
        <FileThumbnail resizeMode="cover" source={file.thumbnail} />
        <NameAndOptions>
          <Infos>
            <FilePreviewFilename numberOfLines={1}>
              {file.name}
            </FilePreviewFilename>
            <FilePreviewDate>{file.modifiedAt?.toDateString()}</FilePreviewDate>
          </Infos>
        </NameAndOptions>
      </Container>
    </>
  );
};

export default FilePreview;
