'use client'

import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'

function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const handleClick = () =>
    theme === 'dark' ? setTheme('light') : setTheme('dark')

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Moon
        strokeWidth={1.2}
        className="h-[0.9rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-100 dark:-rotate-90 dark:scale-0 lg:h-[1.2rem]"
      />
      <Sun
        strokeWidth={1.7}
        className="absolute h-[0.9rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-100 dark:rotate-0 dark:scale-100 lg:h-[1.2rem]"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ModeToggle

/*
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
*/

/*
export function ModeToggle () {
  const { theme, setTheme } = useTheme()
  const handleClick = () =>
    theme === 'dark' ? setTheme('light') : setTheme('dark')

  return (
    <Button variant='outline' size='icon' onClick={handleClick}>
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 duration-100' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
*/
