import { Box } from '@mui/material'
import './app.css'
import { Button } from '@mui/material'
import { useState } from 'preact/hooks'
import styled from "@emotion/styled"

export function App() {
  const [count, setCount] = useState(0)
  return (
    <Box>
      <Text>Count: {count}</Text>
      <Button variant="contained" onClick={() => {
        setCount(prev => prev + 1)
      }}>Click Me</Button>
    </Box>
  )
}

const Text = styled.div`
  font-size: larger;
`