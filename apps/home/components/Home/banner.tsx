import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Icon,
  Image,
  Center,
  HeadingProps,
  BoxProps,
  ImageProps,
} from '@chakra-ui/react'
import { CONTAINER_MAX_WIDTH } from 'ui'
import React from 'react'
import HomeGridBgSvgPath from '../../assets/svg/home-grid-bg.svg?url'
import Illustration1Svg from '../../assets/svg/illustration/1.svg'
import Illustration1Png from '../../assets/png/illustration/1.png'
import Illustration3Png from '../../assets/png/illustration/3.png'
import Illustration8Png from '../../assets/png/illustration/8.png'
import { HEADER_BAR_HEIGHT } from './navbar'

export interface BannerProps extends FlexProps {
  bottomContainerProps?: BoxProps
  topContainerProps?: BoxProps
  headingProps?: HeadingProps
  bgProps?: ImageProps
}

export const Banner: React.FC<BannerProps> = ({
  headingProps,
  topContainerProps,
  bottomContainerProps,
  bgProps,
  ...props
}) => (
  <Flex
    direction="column"
    align="center"
    h={`calc(100vh - ${HEADER_BAR_HEIGHT}px)`}
    position="relative"
    px="20px"
    zIndex={0}
    bg="#fff"
    transform="translate3d(0, 0, 0)"
    overflow="hidden"
    {...props}
  >
    <Image
      src={HomeGridBgSvgPath}
      objectFit="cover"
      objectPosition="center 70%"
      w="full"
      h="full"
      position="absolute"
      zIndex={-2}
      transform="50ms"
      opacity={{ base: 1, md: 0.3 }}
      {...bgProps}
    />
    <Flex
      direction="column"
      h="full"
      w="full"
      maxW={`${CONTAINER_MAX_WIDTH}px`}
      position="relative"
    >
      <Box
        position="absolute"
        w="100vw"
        h="100vh"
        top="20px"
        left="0"
        transformOrigin={{ base: '90% 10%', md: '50% 10%' }}
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        {...topContainerProps}
      >
        <Icon
          w="30%"
          maxW="150px"
          as={Illustration1Svg}
          h="auto"
          position="absolute"
          top="5%"
          left={{ base: '40%', md: '0' }}
        />
        <Image
          src={Illustration1Png.src}
          w="30%"
          maxW="200px"
          h="auto"
          maxH="20vh"
          position="absolute"
          top="5%"
          right={{ base: '5%', md: '0' }}
          objectFit="contain"
        />
      </Box>
      <Box
        position="absolute"
        w="100vw"
        h="100vh"
        maxW={`${CONTAINER_MAX_WIDTH}px`}
        left="0"
        bottom="20%"
        transformOrigin="50% 95%"
        {...bottomContainerProps}
      >
        <Image
          src={Illustration3Png.src}
          position="absolute"
          w="30%"
          maxW="200px"
          bottom="0"
          transform="translateY(80%)"
          left="0"
        />
        <Image
          src={Illustration8Png.src}
          position="absolute"
          w="70%"
          maxW="400px"
          right="10%"
          bottom="0"
        />
      </Box>
      <Center position="relative" w="full" my="auto" flex={1}>
        <Heading
          maxW="580px"
          fontSize={{ base: '28px', md: '48px' }}
          textAlign="center"
          lineHeight={{ base: '30px', md: '60px' }}
          {...headingProps}
        >
          <Box as="span" display={{ base: 'block', md: 'inline-block' }}>
            Web3 natives
          </Box>{' '}
          deserve a better mail protocol
        </Heading>
      </Center>
    </Flex>
  </Flex>
)
