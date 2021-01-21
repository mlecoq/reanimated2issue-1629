import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';

export default () => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const landscape = windowHeight < windowWidth;
  const isTablet = windowWidth >= 648;

  const dimInfos = useMemo(() => ({isTablet, landscape}), [
    landscape,
    isTablet,
  ]);

  return dimInfos;
};
