import styled from '@xstyled/styled-components';
import { px2rem } from '../../utils';

const SMyLocation = styled.div`
  position: relative;

  .leaflet-container {
    height: ${px2rem(250)};
  }
`;

export default SMyLocation;