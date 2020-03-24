import styled, { css } from '@xstyled/styled-components';
import { px2rem } from '../../utils';
import { Box } from './Flex';

const InfoSection = styled(Box)`
  position: relative;
  z-index: 0;

  ${({ shape }) =>
    shape === 'topLeft' &&
    css`
      &:after {
        content: '';
        position: absolute;
        z-index: -1;
        top: ${px2rem(-35)};
        left: ${px2rem(-45)};
        width: ${px2rem(90)};
        height: ${px2rem(90)};
        background: url('/static/icons/circle-orange.svg');
        animation: float 3s ease-in-out infinite;
      }
    `}

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(3px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

export default InfoSection;