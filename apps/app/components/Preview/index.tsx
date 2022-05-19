import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Avatar } from 'ui'
import { AvatarGroup, Box, Center, Text, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { SuspendButton, SuspendButtonType } from '../SuspendButton'
import { useAPI } from '../../hooks/useAPI'
import {
  AddressListResponse,
  AddressResponse,
  FlagAction,
  FlagType,
} from '../../api'
import { truncateMiddle } from '../../utils'

interface MeesageDetail {
  date: string
  subject: string
  to: AddressListResponse
  from: AddressResponse
}

export const PreviewComponent: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const [content, setContent] = useState('')
  const [detail, setDetail] = useState<MeesageDetail>()
  const api = useAPI()

  useQuery(
    ['preview', id],
    async () => {
      if (typeof id !== 'string') return {}
      const { data: messageData } = await api.getMessageData(id)
      const { data: textData } = await api.getTextData(messageData.text.id)

      return {
        messageData,
        html: textData.html,
      }
    },
    {
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess(d) {
        const { messageData, html } = d
        setDetail({
          date: dayjs(messageData.date).format('YYYY-MM-DD h:mm A'),
          subject: messageData.subject,
          to: messageData.to,
          from: messageData.from,
        })
        setContent(html)

        if (typeof id !== 'string') return
        api.putMessage(id, FlagAction.add, FlagType.Seen)
      },
    }
  )

  return (
    <>
      <SuspendButton
        list={[
          {
            type: SuspendButtonType.Reply,
            onClick: () => {
              router.push({
                pathname: '/message/new',
                query: {
                  id,
                  action: 'replay',
                },
              })
            },
          },
          {
            type: SuspendButtonType.Forward,
            onClick: () => {
              router.push({
                pathname: '/message/new',
                query: {
                  id,
                  action: 'forward',
                },
              })
            },
          },
          {
            type: SuspendButtonType.Delete,
            onClick: async () => {
              if (typeof id !== 'string') {
                return
              }
              await api.deleteMessage(id)
              router.back()
            },
          },
        ]}
      />
      <Center>
        <Box bg="#F3F3F3" padding="4px" borderRadius="47px">
          <AvatarGroup size="md" max={10}>
            {detail?.from && (
              <Avatar address={detail.from.address} borderRadius="50%" />
            )}
            {detail?.to.map((item) => (
              <Avatar
                key={item.address}
                address={item.address}
                borderRadius="50%"
              />
            ))}
          </AvatarGroup>
        </Box>
      </Center>
      <Box
        margin="25px auto 150px"
        bgColor="#FFFFFF"
        boxShadow="0px 0px 10px 4px rgba(25, 25, 100, 0.1)"
        borderRadius="24px"
        padding="40px 60px"
      >
        <Box>
          <Text
            align="center"
            fontWeight="700"
            fontSize="28px"
            lineHeight={1.2}
            marginBottom="30px"
          >
            {detail?.subject}
          </Text>
        </Box>
        <Box>
          <Flex>
            <Box w="48px">
              {detail?.from && (
                <Avatar address={detail.from.address} borderRadius="50%" />
              )}
            </Box>
            <Box borderBottom="1px solid #E7E7E7;" flex={1} marginLeft="17px">
              <Flex
                lineHeight={1.2}
                alignItems="flex-end"
                justify="space-between"
              >
                <Box>
                  <Box
                    fontWeight={500}
                    fontSize="24px"
                    lineHeight="36px"
                    display="inline-block"
                    verticalAlign="middle"
                  >
                    {detail?.from.name}
                  </Box>
                  <Box
                    color="#6F6F6F"
                    fontWeight={400}
                    fontSize="14px"
                    display="inline-block"
                    verticalAlign="middle"
                    marginLeft="5px"
                  >
                    {`<${detail?.from.address}>`}
                  </Box>
                </Box>
                <Box />
                <Box fontWeight={500} fontSize="16px" color="#6F6F6F">
                  {detail?.date}
                </Box>
              </Flex>
              <Box
                fontWeight={400}
                fontSize="16px"
                color="#6F6F6F"
                lineHeight="24px"
              >
                to{' '}
                {detail?.to
                  .map((item) => {
                    const address = truncateMiddle(item.address, 6, 6)
                    if (item.name) return `${item.name} <${address}>`
                    return `<${address}>`
                  })
                  .join(';')}
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box paddingTop="24px" paddingLeft="65px">
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </Box>
      </Box>
    </>
  )
}
