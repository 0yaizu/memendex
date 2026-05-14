'use client'

import { useState, useRef } from 'react'
import { Box, Input, HStack, Badge, Text } from '@yamada-ui/react'
import { apiClient } from '@/lib/api-client'

type TagSuggestion = {
  id: number
  name: string
  count: number
}

type Props = {
  tagList: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tagList, onChange }: Props) {
  const [tagInput, setTagInput] = useState('')
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addTag = (name: string) => {
    const trimmed = name.trim()
    if (trimmed && !tagList.includes(trimmed)) {
      onChange([...tagList, trimmed])
    }
    setTagInput('')
    setSuggestions([])
  }

  const removeTag = (index: number) => {
    onChange(tagList.filter((_, i) => i !== index))
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.endsWith(',')) {
      addTag(value.slice(0, -1))
      return
    }

    setTagInput(value)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    if (value.trim()) {
			try {
      	debounceTimer.current = setTimeout(async () => {
        	const res = await apiClient.get(`/api/tags/search?q=${encodeURIComponent(value)}`)
        	const data = await res.json()
        	setSuggestions(data.tags ?? [])
      	}, 300)
			}
			catch {
				setSuggestions([])
			}
    } else {
      setSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      addTag(tagInput)
    }
  }

  return (
    <Box w="full" position="relative">
      <HStack flexWrap="wrap" gap="sm" mb="sm">
        {tagList.map((tag, index) => (
          <Badge key={index} cursor="pointer" onClick={() => removeTag(index)}>
            #{tag} ×
          </Badge>
        ))}
      </HStack>
      <Input
        placeholder="タグを入力（EnterまたはカンマでTag確定）"
        value={tagInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          borderWidth="1px"
          borderRadius="md"
          bg="white"
          zIndex={10}
          shadow="md"
        >
          {suggestions.map((s) => (
            <Box
              key={s.id}
              px="md"
              py="sm"
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              onClick={() => addTag(s.name)}
            >
              <HStack justifyContent="space-between">
                <Text>#{s.name}</Text>
                <Text fontSize="xs" color="gray.500">{s.count}回使用</Text>
              </HStack>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}