import React, {useState} from 'react';

import styled from 'styled-components/native';
import useDeviceDimInfos from './useDeviceDimInfos';
import FilePreview from './FilePreview';
import FolderPreview from './FolderPreview';
import {Text, Dimensions} from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

const ScrollContainer = styled(Animated.ScrollView).attrs(
  ({contentHeight}) => ({
    contentContainerStyle: {
      height: contentHeight,
    },
  }),
)`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
`;

const DocumentsList = ({files, folders, openFolderMenu}) => {
  const {isTablet, landscape} = useDeviceDimInfos();

  const scrollViewRef = useAnimatedRef();

  const {width} = Dimensions.get('window');

  const COL = isTablet && landscape ? 5 : isTablet ? 4 : 1;
  const MARGIN = isTablet && landscape ? 20 : 14;

  const WIDTH = (width - MARGIN) / COL;

  const HEIGHT = isTablet ? Math.round((8 / 7) * 100 * WIDTH) / 100 : 60;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(({contentOffset: {y}}) => {
    scrollY.value = y;
  });

  const getPosition = (position) => {
    'worklet';

    return {
      x: WIDTH * (position % COL) + MARGIN / 2,
      y: Math.floor(position / COL) * HEIGHT + MARGIN,
    };
  };

  /**
   *
   * @param tx x coordinate
   * @param ty y coordinate
   * @returns corresponding row/col
   **/
  const getTargetPosition = (tx, ty) => {
    'worklet';

    const x = Math.round(tx / WIDTH) * WIDTH;
    const y = Math.round(ty / HEIGHT) * HEIGHT;
    const row = Math.round(Math.max(y, 0) / HEIGHT);
    const col = Math.round(Math.max(x, 0) / WIDTH);

    return {
      row,
      col,
    };
  };

  const [containerHeight, setContainerHeight] = useState(0);

  const [contentHeight, setContentHeight] = useState(0);

  const [containerWidth, setContainerWidth] = useState(0);

  // we don't want to have files on the same line as folders
  const folderLength = Math.ceil((folders?.length || 0) / COL) * COL;

  return (
    <Container>
      {!folders?.length && !files?.length && <Text>No data</Text>}
      <ScrollContainer
        scrollEventThrottle={1}
        onScroll={scrollHandler}
        ref={scrollViewRef}
        contentHeight={
          Math.ceil((folderLength + (files?.length || 0)) / COL) * HEIGHT
        }
        onLayout={({
          nativeEvent: {
            layout: {height},
          },
        }) => {
          setContainerHeight(height);
          setContainerWidth(width);
        }}
        onContentSizeChange={(_width, height) => {
          setContentHeight(height);
        }}>
        {folders?.map((fd, index) => (
          <FolderPreview
            key={fd.id}
            folder={fd}
            onOptions={() => openFolderMenu(fd)}
            width={WIDTH}
            height={HEIGHT}
            position={getPosition(index)}
          />
        ))}

        {files?.map((file, index) => (
          <FilePreview
            key={file.id}
            file={file}
            scrollView={scrollViewRef}
            scrollY={scrollY}
            containerHeight={containerHeight}
            contentHeight={contentHeight}
            width={WIDTH}
            height={HEIGHT}
            position={getPosition(index + (folderLength ?? 0))}
            containerWidth={containerWidth}
            folders={folders}
            nbCols={COL}
            getTargetPosition={getTargetPosition}
          />
        ))}
      </ScrollContainer>
    </Container>
  );
};

export default function Example() {
  return (
    <DocumentsList
      folders={[
        {id: 1, name: 'first folder'},
        {id: 2, name: 'second folder'},
      ]}
      files={[
        {
          id: 1,
          name: 'first',
          thumbnail: require('./assets/pexels-1.jpg'),
          modifiedAt: new Date(),
        },
        {
          id: 2,
          name: 'second',
          thumbnail: require('./assets/pexels-2.jpg'),
          modifiedAt: new Date(),
        },
        {
          id: 3,
          name: 'third',
          thumbnail: require('./assets/pexels-3.jpg'),
          modifiedAt: new Date(),
        },
        {
          id: 4,
          name: 'fourth',
          thumbnail: require('./assets/pexels-4.jpg'),
          modifiedAt: new Date(),
        },
        {
          id: 5,
          name: 'fourth',
          thumbnail: require('./assets/pexels-4.jpg'),
          modifiedAt: new Date(),
        },
      ]}
    />
  );
}
