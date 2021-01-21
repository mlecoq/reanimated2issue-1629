import React from 'react';
import {Pressable, useColorScheme} from 'react-native';
import styled from 'styled-components/native';

import Folder from './assets/folder.svg';

const DefaultFolder = styled(Folder).attrs(({theme}) => ({
  fill: theme.textMain,
}))`
  width: 28px;
  height: 28px;
`;

const FolderPictorContainer = styled.View`
  width: ${({theme}) => (theme.isTablet ? '100%' : '38px')};
  height: ${({theme}) => (theme.isTablet ? '114px' : '38px')};
  border-radius: 6.4px;
  border-width: ${({theme}) => (theme.isTablet ? '2px' : 0)};
  border-color: ${({theme}) => theme.border};
  justify-content: center;
  align-items: center;
`;

const FolderName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${({theme}) => theme.textMain};
`;

const FolderPicto = styled.Image`
  width: 28px;
  height: 28px;
`;

const NameAndOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: ${({theme}) => (theme.isTablet ? 'flex-start' : 'center')};
  margin-left: ${({theme}) => (theme.isTablet ? 0 : '12px')};
  flex: 1;
`;

const Link = styled(Pressable)`
  flex-direction: ${({theme}) => (theme.isTablet ? 'column' : 'row')};
  align-items: center;
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  position: absolute;
  top: ${({position}) => position.y}px;
  left: ${({position}) => position.x}px;
  padding: 8px;
`;

const Infos = styled.View`
  flex: 1;
  margin-top: ${({theme}) => (theme.isTablet ? '8px' : 0)};
`;

const FolderPreview = ({folder, width, height, position}) => {
  const colorScheme = useColorScheme();

  const picto =
    colorScheme === 'dark'
      ? require('./assets/folderimagesdark.png')
      : require('./assets/folderimageslight.png');

  return (
    <Link width={width} height={height} position={position} key={folder.id}>
      <FolderPictorContainer>
        {picto ? (
          <FolderPicto source={picto} resizeMode="contain" />
        ) : (
          <DefaultFolder />
        )}
      </FolderPictorContainer>
      <NameAndOptions>
        <Infos>
          <FolderName>{folder.name}</FolderName>
        </Infos>
      </NameAndOptions>
    </Link>
  );
};

export default FolderPreview;
