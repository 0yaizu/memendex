import { Center, Loading as LoadingSpinner } from '@yamada-ui/react'

export default function Loading() {
  return (
    <Center minH="50vh">
      <LoadingSpinner.Dots />
    </Center>
  )
}
