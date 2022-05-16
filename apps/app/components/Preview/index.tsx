import React, { useEffect, useRef, useState } from 'react'
import { AvatarGroup, Box, Center, Avatar, Text, Flex } from '@chakra-ui/react'
import { useDidMount } from 'hooks'
import { useRouter } from 'next/router'
import { SuspendButton, SuspendButtonType } from '../SuspendButton'

const mockData = {}

function createMarkup() {
  return {
    __html: `Things you can do on a contact’s page
  Decide if their email should go to The Imbox, The Feed, or The Paper Trail. Just click the “Delivering to...” button under their name. If you change the destination, all existing and future email will be moved automatically.

  Automatically label their email. Always want someone’s emails to go into a specific label? Easy, just click the “Autofile...” button and pick the label.

  Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.

  Kick off a new email to that contact. Just click the "+ Write" button from a contact’s page, and a new email will be automatically addressed to that person.

  Pretty powerful stuff.
  Things you can do on a contact’s page
  Decide if their email should go to The Imbox, The Feed, or The Paper Trail. Just click the “Delivering to...” button under their name. If you change the destination, all existing and future email will be moved automatically.

  Automatically label their email. Always want someone’s emails to go into a specific label? Easy, just click the “Autofile...” button and pick the label.

  Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.

  Kick off a new email to that contact. Just click the "+ Write" button from a contact’s page, and a new email will be automatically addressed to that person.

  Pretty powerful stuff.Things you can do on a contact’s page
  Decide if their email should go to The Imbox, The Feed, or The Paper Trail. Just click the “Delivering to...” button under their name. If you change the destination, all existing and future email will be moved automatically.

  Automatically label their email. Always want someone’s emails to go into a specific label? Easy, just click the “Autofile...” button and pick the label.

  Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.

  Kick off a new email to that contact. Just click the "+ Write" button from a contact’s page, and a new email will be automatically addressed to that person.

  Pretty powerful stuff.Things you can do on a contact’s page
  Decide if their email should go to The Imbox, The Feed, or The Paper Trail. Just click the “Delivering to...” button under their name. If you change the destination, all existing and future email will be moved automatically.

  Automatically label their email. Always want someone’s emails to go into a specific label? Easy, just click the “Autofile...” button and pick the label.

  Turn on/off notifications for that contact. We want HEY to be a calm and quiet place, so all push notifications are off by default. But sometimes you need to know when your partner, or doctor, or your kid’s teacher emails you. To set that up, click “Not notifying” button to toggle notifications on.

  Kick off a new email to that contact. Just click the "+ Write" button from a contact’s page, and a new email will be automatically addressed to that person.

  Pretty powerf`,
  }
}

export const PreviewComponent: React.FC = () => {
  const [data, setData] = useState(mockData)
  const router = useRouter()
  const { id } = router.query
  const contentRef = useRef<HTMLDivElement>(null)

  useDidMount(() => {
    console.log('PreviewComponent useDidMount', id)
  })

  return (
    <>
      <SuspendButton
        list={[
          {
            type: SuspendButtonType.Reply,
            onClick: () => {
              console.log('replay')
            },
          },
          {
            type: SuspendButtonType.Forward,
            onClick: () => {
              console.log('Forward')
            },
          },
          {
            type: SuspendButtonType.Delete,
            onClick: () => {
              console.log('Delete')
            },
          },
        ]}
      />
      <Center>
        <Box bg="#F3F3F3" padding="4px" borderRadius="47px">
          <AvatarGroup size="md" max={2}>
            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
            <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
            <Avatar
              name="Prosper Otemuyiwa"
              src="https://bit.ly/prosper-baba"
            />
            <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
          </AvatarGroup>
        </Box>
      </Center>
      <Box
        margin="25px auto"
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
          >
            Getting around with the Mail3 Menu
          </Text>
        </Box>
        <Box>
          <Flex>
            <Box w="48px">
              <Avatar />
            </Box>
            <Box borderBottom="1px solid #E7E7E7;" flex={1} marginLeft="17px">
              <Flex
                lineHeight={1.2}
                alignItems="flex-end"
                justify="space-between"
              >
                <Box>
                  <Box fontWeight={500} fontSize="24px" display="inline-block">
                    Sender name
                  </Box>
                  <Box fontWeight={400} fontSize="12px" display="inline-block">
                    {'<0x956...b256@mail3.me>'}
                  </Box>
                </Box>
                <Box />
                <Box fontWeight={500} fontSize="16px" color="#6F6F6F">
                  Mar 2, 12:01 am
                </Box>
              </Flex>
              <Box fontWeight={500} fontSize="16px" color="#6F6F6F">
                {
                  'to satoshi.eth <satoshi.eth@mail3.me>; nakamoto.eth <nakamoto.eth@mail3.me> to satoshi.eth <satoshi.eth@mail3.me>; nakamoto.eth <nakamoto.eth@mail3.me>'
                }
              </Box>
            </Box>
          </Flex>
        </Box>
        <Box paddingTop="24px" paddingLeft="65px">
          <div ref={contentRef} dangerouslySetInnerHTML={createMarkup()} />
        </Box>
      </Box>
    </>
  )
}
