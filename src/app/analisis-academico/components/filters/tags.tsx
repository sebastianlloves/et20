'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

function TagsBox({
  tags,
  uniqueValues,
  maxTags,
  handleRemoveTag,
  handleRemoveAll,
}: {
  tags: string[]
  uniqueValues?: Map<string, number>
  maxTags: number
  handleRemoveTag: (value: string) => void
  handleRemoveAll: () => void
}) {
  return (
    <div className="w-full bg-muted/25 p-2 shadow-inner">
      {tags.length <= maxTags ? (
        <AllTags
          tags={tags}
          uniqueValues={uniqueValues}
          handleRemoveTag={handleRemoveTag}
          handleRemoveAll={handleRemoveAll}
        />
      ) : (
        <AccordionTags tags={tags}>
          <AllTags
            tags={tags}
            uniqueValues={uniqueValues}
            handleRemoveTag={handleRemoveTag}
            handleRemoveAll={handleRemoveAll}
          />
        </AccordionTags>
      )}
    </div>
  )
}

function AllTags({
  tags,
  uniqueValues,
  handleRemoveTag,
  handleRemoveAll,
}: {
  tags: string[]
  uniqueValues?: Map<string, number>
  handleRemoveTag: (value: string) => void
  handleRemoveAll: () => void
}) {
  return (
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
          <TagBadge
            key={tag}
            tag={tag}
            handleRemoveTag={handleRemoveTag}
            quantity={uniqueValues && (uniqueValues.get(tag) ?? 0)}
            className={
              tag === 'Inclusión estricta' ? 'rounded-lg pl-1' : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}

function AccordionTags({
  tags,
  children,
}: {
  tags: string[]
  children: React.ReactNode
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filter" className="my-1 border-b-0">
        <div className="flex items-center">
          <AccordionTrigger className="py-0 pr-2.5 hover:no-underline">
            <TagBadge
              tag={`${tags.length} seleccionados`}
              hasRemove={false}
              hasQuantity={false}
              className="rounded-lg border-primary/70 bg-primary/10"
            />
          </AccordionTrigger>
        </div>
        <AccordionContent className="ml-1 mt-2 pb-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function TagBadge({
  tag,
  quantity,
  hasRemove = true,
  hasQuantity = true,
  handleRemoveTag,
  className,
}: {
  tag: string
  quantity?: number
  hasRemove?: boolean
  hasQuantity?: boolean
  handleRemoveTag?: (value: string) => void
  className?: string
}) {
  return (
    <Badge
      variant="default"
      className={cn(
        'max-w-full justify-center rounded-2xl border-primary/60 bg-primary/5 px-2 py-1.5 font-normal leading-tight shadow-sm hover:bg-primary/10',
        className,
      )}
    >
      <div className="flex h-full items-center justify-start">
        <div className="flex items-center justify-between gap-3 px-2 leading-3">
          <p className="align-middle leading-snug text-foreground">{tag}</p>
          {hasQuantity &&
            (quantity !== undefined ? (
              <p className="align-middle font-mono text-xs leading-tight text-muted-foreground/80">
                {`(${quantity})`}
              </p>
            ) : (
              <Skeleton className="h-0.5 w-6 rounded-full bg-primary/60" />
            ))}
        </div>

        {hasRemove && (
          <div className="flex h-full cursor-pointer items-center rounded-r-full border-l border-accent-foreground/15 pl-1">
            <X
              strokeWidth="1.5px"
              className="h-[13px] w-[13px] cursor-pointer text-foreground/60 hover:text-foreground/90"
              onClick={() => handleRemoveTag && handleRemoveTag(tag)}
            />
          </div>
        )}
      </div>
    </Badge>
  )
}

export { TagsBox }
