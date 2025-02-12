import {
  Box,
  Center,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Avatar, ProfileCard } from 'ui'
import { useMemo, useRef, useState } from 'react'
import {
  ProfileScoialPlatformItem,
  TrackEvent,
  TrackKey,
  useDidMount,
  useScreenshot,
  useToast,
  useTrackClick,
} from 'hooks'
import {
  copyText,
  isZilpayAddress,
  isBitDomain,
  shareToTwitter,
  isEnsDomain,
} from 'shared'
import { ReactComponent as SvgCopy } from 'assets/profile/copy.svg'
import { ReactComponent as SvgShare } from 'assets/profile/share.svg'
import { ReactComponent as SvgTwitter } from 'assets/profile/twitter.svg'
import { ReactComponent as SvgMore } from 'assets/profile/more.svg'
import { ReactComponent as SvgEtherscan } from 'assets/profile/business/etherscan.svg'
import { ReactComponent as SvgCyber } from 'assets/profile/business/arrow.svg'
import { ReactComponent as SvgZiliqa } from 'assets/svg/zilliqa.svg'
import dynamic from 'next/dynamic'
import { useQuery } from 'react-query'
import { useAPI } from '../../api'

const Mail3MeButton = dynamic(() => import('./mail3MeButton'), { ssr: false })

enum ButtonType {
  Copy,
  Card,
  Twitter,
}

enum ScoialPlatform {
  CyberConnect = 'CyberConnect',
  Etherscan = 'Etherscan',
  ViewBlock = 'ViewBlock',
}

const Container = styled(Box)`
  position: relative;
  max-width: 475px;
  margin: 120px auto;
  padding: 60px 20px 55px 20px;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 4px rgba(25, 25, 100, 0.1);
  border-radius: 24px;

  .avatar {
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    border: 4px solid #fff;
    border-radius: 50%;
  }

  .button-list {
    top: 5px;
    right: 15px;
    position: absolute;

    .button-wrap-mobile {
      display: none;
    }
  }

  .address {
    background: #f3f3f3;
    border-radius: 16px;
    padding: 13px;
    text-align: center;

    .p {
      font-style: normal;
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
    }
  }

  @media (max-width: 600px) {
    max-width: 325px;

    .button-list {
      .button-wrap-mobile {
        display: block;
      }
      .button-wrap-pc {
        display: none;
      }
    }
  }
`

interface ProfileComponentProps {
  mailAddress: string
  address: string
}

let homeUrl = ''
if (typeof window !== 'undefined') {
  homeUrl = `${window?.location?.origin}`
}

export const ProfileComponent: React.FC<ProfileComponentProps> = ({
  mailAddress,
  address,
}) => {
  const [t] = useTranslation('profile')
  const [t2] = useTranslation('common')

  const trackTwitter = useTrackClick(TrackEvent.ClickProfileTwitter)
  const trackCopy = useTrackClick(TrackEvent.ClickProfileCopy)
  const trackCard = useTrackClick(TrackEvent.ClickProfileDownloadCard)
  const trackScoialDimensions = useTrackClick(
    TrackEvent.ClickProfileScoialPlatform
  )

  const api = useAPI()
  const toast = useToast()
  const { downloadScreenshot } = useScreenshot()

  const [isDid, setIsDid] = useState(false)
  const popoverRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { data: _0xaddr, isLoading } = useQuery(
    ['bit', address],
    async () => {
      try {
        const { data } = await api.getBitToEthResponse(address)
        return data.account_info.owner_key
      } catch (error) {
        return ''
      }
    },
    {
      refetchIntervalInBackground: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: isBitDomain(address),
    }
  )

  const buttonConfig: Record<
    ButtonType,
    {
      Icon: any
      label: string
    }
  > = {
    [ButtonType.Card]: {
      Icon: SvgShare,
      label: t('profile.share'),
    },
    [ButtonType.Copy]: {
      Icon: SvgCopy,
      label: t('profile.copy'),
    },
    [ButtonType.Twitter]: {
      Icon: SvgTwitter,
      label: t('profile.twitter'),
    },
  }

  const ScoialConfig: Record<
    ScoialPlatform,
    {
      Icon: any
    }
  > = {
    [ScoialPlatform.CyberConnect]: {
      Icon: SvgCyber,
    },
    [ScoialPlatform.Etherscan]: {
      Icon: SvgEtherscan,
    },
    [ScoialPlatform.ViewBlock]: {
      Icon: SvgZiliqa,
    },
  }

  const profileUrl: string = useMemo(() => `${homeUrl}/${address}`, [address])

  const hashTag = useMemo(() => {
    if (isZilpayAddress(address)) return 'Zilliqa'
    if (isBitDomain(address)) return 'DOTBIT'
    if (isEnsDomain(address)) return 'ENS'
    return ''
  }, [address])

  const actionMap = useMemo(
    () => ({
      [ButtonType.Copy]: async () => {
        trackCopy()
        await copyText(profileUrl)
        toast(t2('navbar.copied'))
        popoverRef?.current?.blur()
      },
      [ButtonType.Twitter]: () => {
        trackTwitter()
        shareToTwitter({
          text: 'Hey, contact me using my Mail3 email address @mail3dao',
          url: profileUrl,
          hashtags: hashTag ? ['web3', 'mail3', hashTag] : ['web3', 'mail3'],
        })
      },
      [ButtonType.Card]: async () => {
        trackCard()
        if (!cardRef?.current) return
        try {
          downloadScreenshot(cardRef.current, 'share.png', {
            ignoreElements: (dom) => {
              if (dom.id === 'mail3-me-button-wrap') return true
              return false
            },
          })
        } catch (error) {
          toast('Download screenshot Error!')
        }

        popoverRef?.current?.blur()
      },
    }),
    [mailAddress, address]
  )

  const getHref = (type: ScoialPlatform) => {
    const realAddr = _0xaddr || address

    if (type === ScoialPlatform.CyberConnect) {
      return `https://app.cyberconnect.me/address/${realAddr}`
    }
    if (type === ScoialPlatform.ViewBlock) {
      return `https://viewblock.io/zilliqa/address/${address}`
    }

    return `https://etherscan.io/address/${realAddr}`
  }

  const socials = isZilpayAddress(address)
    ? [ScoialConfig.ViewBlock]
    : [ScoialConfig.CyberConnect, ScoialConfig.Etherscan]

  const socialPlatforms = isZilpayAddress(address)
    ? [ScoialPlatform.ViewBlock]
    : [ScoialPlatform.CyberConnect, ScoialPlatform.Etherscan]
  useDidMount(() => {
    setIsDid(true)
  })

  if (!isDid) return null

  return (
    <>
      <Container>
        <Box className="avatar">
          <Avatar address={address} w="72px" h="72px" />
        </Box>
        <Box className="button-list">
          <Box className="button-wrap-mobile">
            <Popover
              offset={[0, 10]}
              arrowSize={18}
              autoFocus
              closeOnBlur
              strategy="fixed"
            >
              <PopoverTrigger>
                <Box p="10px">
                  <SvgMore />
                </Box>
              </PopoverTrigger>
              <PopoverContent
                width="auto"
                _focus={{
                  boxShadow: '0px 0px 16px 12px rgba(192, 192, 192, 0.25)',
                  outline: 'none',
                }}
                borderRadius="20px"
                ref={popoverRef}
              >
                <PopoverArrow />
                <PopoverBody>
                  <Wrap p="14px" direction="column">
                    {[ButtonType.Twitter, ButtonType.Copy, ButtonType.Card].map(
                      (type: ButtonType) => {
                        const { Icon, label } = buttonConfig[type]
                        const onClick = actionMap[type]

                        return (
                          <WrapItem
                            key={type}
                            p="5px"
                            borderRadius="10px"
                            _hover={{
                              bg: '#E7E7E7',
                            }}
                          >
                            <Center as="button" onClick={onClick}>
                              <Box>
                                <Icon />
                              </Box>
                              <Text pl="10px">{label}</Text>
                            </Center>
                          </WrapItem>
                        )
                      }
                    )}
                  </Wrap>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
          {isLoading ? (
            <Spinner />
          ) : (
            <HStack className="button-wrap-pc">
              {[ButtonType.Twitter, ButtonType.Copy, ButtonType.Card].map(
                (type: ButtonType) => {
                  const { Icon, label } = buttonConfig[type]
                  const onClick = actionMap[type]
                  return (
                    <Popover
                      arrowSize={8}
                      key={type}
                      trigger="hover"
                      placement="top-start"
                      size="md"
                    >
                      <PopoverTrigger>
                        <Box as="button" p="10px" onClick={onClick}>
                          <Icon />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent width="auto">
                        <PopoverArrow />
                        <PopoverBody
                          whiteSpace="nowrap"
                          fontSize="14px"
                          justifyContent="center"
                        >
                          {label}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )
                }
              )}
            </HStack>
          )}
        </Box>
        <Box className="address">
          <Text className="p">{mailAddress}</Text>
        </Box>
        <Center mt="25px">
          <HStack spacing="24px">
            {socialPlatforms.map((itemKey: ScoialPlatform, index) => {
              const { Icon } = ScoialConfig[itemKey]
              return (
                <Box
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  w={{ base: '24px', md: '36px' }}
                  h={{ base: '24px', md: '36px' }}
                  as="a"
                  href={getHref(itemKey)}
                  target="_blank"
                  onClick={() => {
                    if (itemKey === ScoialPlatform.CyberConnect) {
                      trackScoialDimensions({
                        [TrackKey.ProfileScoialPlatform]:
                          ProfileScoialPlatformItem.CyberConnect,
                      })
                    }

                    if (itemKey === ScoialPlatform.Etherscan) {
                      trackScoialDimensions({
                        [TrackKey.ProfileScoialPlatform]:
                          ProfileScoialPlatformItem.Etherscan,
                      })
                    }
                  }}
                >
                  <Icon />
                </Box>
              )
            })}
          </HStack>
        </Center>
      </Container>

      <Center>
        <Mail3MeButton to={mailAddress} />
      </Center>

      <ProfileCard ref={cardRef} mailAddress={mailAddress} homeUrl={homeUrl}>
        {socials.map(({ Icon }, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            w="24px"
            h="24px"
          >
            <Icon />
          </Box>
        ))}
      </ProfileCard>
    </>
  )
}
