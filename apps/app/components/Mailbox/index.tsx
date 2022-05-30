import { Avatar } from 'ui'
import { AvatarBadge, Box, Circle, Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import ChooseSVG from '../../assets/mailbox/choose.svg'
import { MailboxMessageItemResponse } from '../../api'
import { dynamicDateString } from '../../utils'

export enum AvatarBadgeType {
  None,
  New,
  SentOK,
  SentFail,
}

export enum ItemType {
  None,
  Fail,
}

export interface MessageItem extends MailboxMessageItemResponse {
  // ui need state
  isChoose: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
}

export interface BoxListProps {
  data: Array<MessageItem>
  onClickAvatar?: (index: number, id: string) => void
  onClickBody: (id: string) => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
  chooseMap?: Record<string, boolean>
  hiddenMap?: Record<string, boolean>
}

export interface BoxItemProps extends MailboxMessageItemResponse {
  index: number
  isChoose?: boolean
  avatarBadgeType: AvatarBadgeType
  itemType: ItemType
  onClickAvatar?: BoxListProps['onClickAvatar']
  onClick?: () => void
  isChooseMode?: boolean
  setIsChooseMode?: React.Dispatch<React.SetStateAction<boolean>>
  chooseMap?: BoxListProps['chooseMap']
}

const CircleE = styled(Circle)`
  background: #ffffff;
  border: 3px solid #4e52f5;
  border-radius: 50px;
`

const Item = ({
  subject,
  // desc,
  date,
  id,
  index,
  onClickAvatar,
  onClick,
  avatarBadgeType,
  itemType,
  to,
  from,
  isChoose,
  isChooseMode,
  setIsChooseMode,
  chooseMap,
}: BoxItemProps) => {
  const AvatarBadgeE = {
    [AvatarBadgeType.None]: <Box />,
    [AvatarBadgeType.New]: (
      <AvatarBadge
        boxSize="10px"
        bg="#9093F9"
        top="0"
        bottom="auto"
        border="none"
      />
    ),
    [AvatarBadgeType.SentOK]: (
      <AvatarBadge boxSize="10px" bg="#000" top="0" bottom="auto" border="none">
        <CheckIcon color="#fff" w="5px" h="5px" />
      </AvatarBadge>
    ),
    [AvatarBadgeType.SentFail]: (
      <AvatarBadge
        boxSize="10px"
        bg="#FF5F57"
        top="0"
        bottom="auto"
        border="none"
      >
        <CloseIcon color="#fff" w="5px" h="5px" />
      </AvatarBadge>
    ),
  }[avatarBadgeType]

  const AvatarBox = (
    <Flex w="48px">
      <Avatar
        cursor="pointer"
        address={from.address}
        w="48px"
        h="48px"
        showBorder
        onClick={(e) => {
          e.stopPropagation()
          if (onClickAvatar) onClickAvatar(index, id)
          if (setIsChooseMode) setIsChooseMode(true)
          return false
        }}
        borderRadius="50%"
      >
        {AvatarBadgeE}
      </Avatar>
      {/* <Center
        flexGrow={1}
        w="48px"
        h="48px"
        zIndex={9}
        background="#6F6F6F"
        border="1px solid #FFFFFF"
        borderRadius="50px"
        transform="translateX(-70%)"
        onClick={(e) => {
          e.stopPropagation()
          if (update) update(index)
          setIsChooseMode(true)
          return false
        }}
      >
        10
      </Center> */}
    </Flex>
  )

  const desc = `${from?.address} - ${to
    ?.map((item) => `${item?.address}`)
    ?.join(';')}`

  return (
    <Flex
      align="flex-start"
      bg={itemType === ItemType.Fail ? '#FFF9F9' : ''}
      margin={{ base: 0, md: '20px 0' }}
      p={{ base: '20px', md: '5px' }}
      borderRadius={{ base: 0, md: '8px' }}
      transition="background .2s ease-out, color .2s ease-out"
      _hover={{
        color: '#6F6F6F',
        bg: '#E5E5E5',
      }}
      _active={{
        color: '#fff',
        bg: '#000000',
      }}
    >
      <Box w="48px">
        {isChooseMode ? (
          <CircleE
            size="48px"
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation()
              if (onClickAvatar) onClickAvatar(index, id)
              return false
            }}
          >
            {(isChoose || (chooseMap && chooseMap[id])) && <ChooseSVG />}
          </CircleE>
        ) : (
          AvatarBox
        )}
      </Box>
      <Flex
        marginLeft="20px"
        align={{ base: 'flex-start', md: 'center' }}
        flexDirection={{ base: 'column', md: 'row' }}
        w="100%"
        onClick={onClick}
        cursor="pointer"
      >
        <Flex flex={1} wrap="wrap" alignContent="center">
          <Text
            wordBreak="break-all"
            fontWeight="600"
            fontSize="16px"
            noOfLines={1}
          >
            {subject}
          </Text>
          <Text
            wordBreak="break-all"
            fontWeight="400"
            fontSize="14px"
            pt="5px"
            lineHeight={1.3}
            noOfLines={{ base: 3, md: 1 }}
          >
            {desc}
          </Text>
        </Flex>
        <Box
          fontSize="14px"
          mt={{ base: '20px' }}
          ml={{ md: '20px' }}
          color="#6F6F6F"
        >
          {dynamicDateString(date)}
        </Box>
      </Flex>
    </Flex>
  )
}

export const Mailbox: React.FC<BoxListProps> = ({
  data,
  onClickAvatar,
  onClickBody,
  isChooseMode,
  setIsChooseMode,
  chooseMap,
  hiddenMap,
}) => (
  <Box>
    {data.map((item, index) => {
      const { id } = item

      if (hiddenMap && hiddenMap[id]) {
        return null
      }

      return (
        <Item
          key={id}
          {...item}
          index={index}
          chooseMap={chooseMap}
          onClickAvatar={onClickAvatar}
          isChooseMode={isChooseMode}
          setIsChooseMode={setIsChooseMode}
          onClick={() => {
            onClickBody(id)
          }}
        />
      )
    })}
  </Box>
)
