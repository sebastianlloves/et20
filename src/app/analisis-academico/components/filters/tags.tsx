'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import React, { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

function TagsBox({
  tags,
  maxTags,
  handleRemoveTag,
  handleRemoveAll,
}: {
  tags: { value: string; quantity?: number | null; className?: string }[]
  maxTags: number
  handleRemoveTag: (value: string) => void
  handleRemoveAll: () => void
}) {
  return (
    <div className="w-full bg-muted/25 p-2 shadow-inner">
      <ConditionalWrapper
        condition={tags.length > maxTags}
        tagsQuantity={tags.length}
      >
        <div className="w-full">
          {tags.length > 1 && (
            <X
              strokeWidth="1.5px"
              className="ml-auto mr-2.5 h-4 w-4 cursor-pointer text-foreground/80 hover:text-foreground"
              onClick={handleRemoveAll}
            />
          )}

          <div className="mt-1 flex flex-wrap justify-start gap-1.5 overflow-hidden">
            {tags.map((tag) => (
              <Badge
                key={tag.value}
                variant="default"
                className={cn(
                  'max-w-full justify-center rounded-2xl border-primary/60 bg-primary/5 px-2 py-1.5 font-normal leading-tight shadow-sm hover:bg-primary/10',
                  tag.className,
                )}
              >
                <div className="flex h-full items-center justify-start">
                  <div className="flex items-center justify-between gap-3 px-2 leading-3">
                    <p className="text-pretty align-middle leading-snug text-foreground">
                      {tag.value}
                    </p>
                    {tag.quantity === undefined ? (
                      <Skeleton className="h-2 w-5 rounded-md bg-primary/50" />
                    ) : (
                      tag.quantity !== null && (
                        <p className="align-middle font-mono text-xs leading-tight text-muted-foreground/80">
                          {`(${tag.quantity})`}
                        </p>
                      )
                    )}
                  </div>
                  <div className="flex h-full cursor-pointer items-center rounded-r-full border-l border-accent-foreground/15 pl-1">
                    <X
                      strokeWidth="1.5px"
                      className="h-[13px] w-[13px] cursor-pointer text-foreground/60 hover:text-foreground/90"
                      onClick={() => handleRemoveTag(tag.value)}
                    />
                  </div>
                </div>
              </Badge>
            ))}
          </div>
        </div>
      </ConditionalWrapper>
    </div>
  )
}

function AccordionTags({
  tagsQuantity,
  children,
}: {
  tagsQuantity: number
  children: React.ReactNode
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filter" className="my-1 border-b-0">
        <div className="flex items-center">
          <AccordionTrigger className="py-0 pr-2.5 hover:no-underline">
            <Badge
              variant="default"
              className={
                'max-w-full justify-center rounded-lg border-primary/70 bg-primary/10 px-2 py-1.5 font-normal leading-tight shadow-sm hover:bg-primary/10'
              }
            >
              <div className="flex h-full items-center justify-start">
                <p className="text-pretty align-middle leading-snug text-foreground">
                  {`${tagsQuantity} seleccionados`}
                </p>
              </div>
            </Badge>
          </AccordionTrigger>
        </div>
        <AccordionContent className="ml-1 mt-2 pb-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function ConditionalWrapper({
  condition,
  children,
  tagsQuantity,
}: {
  condition: boolean
  children: ReactNode
  tagsQuantity: number
}) {
  return condition ? (
    <AccordionTags tagsQuantity={tagsQuantity}>{children}</AccordionTags>
  ) : (
    <>{children}</>
  )
}

export { TagsBox }
