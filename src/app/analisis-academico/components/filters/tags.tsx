import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import Remove from './remove-tags'

function TagsBox({ tags, maxTags }: { tags: string[]; maxTags: number }) {
  return (
    <div className="w-full bg-muted/25 p-2 shadow-inner">
      {tags.length <= maxTags ? (
        <AllTags tags={tags} />
      ) : (
        <AccordionTags tags={tags} />
      )}
    </div>
  )
}

function AllTags({ tags }: { tags: string[] }) {
  return (
    <div className="w-full">
      {tags.length > 1 && (
        <Remove
          paramName="cursos"
          className="ml-auto mr-2.5 h-4 w-4 text-foreground/80 hover:text-foreground"
        />
      )}
      <div className="flex flex-wrap justify-start gap-1.5 overflow-hidden">
        {tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>
    </div>
  )
}

function AccordionTags({ tags }: { tags: string[] }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filter" className="my-1 border-b-0">
        <div className="flex items-center">
          <AccordionTrigger className="py-0 pr-2.5 hover:no-underline">
            <TagBadge tag={`${tags.length} seleccionados`} hasRemove={false} />
          </AccordionTrigger>
        </div>
        <AccordionContent className="ml-2 mt-2 pb-0">
          <AllTags tags={tags} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function TagBadge({
  tag,
  quantity,
  hasRemove = true,
}: {
  tag: string
  quantity?: number
  hasRemove?: boolean
}) {
  return (
    <Badge
      variant="default"
      className="max-w-full justify-center rounded-2xl border-primary/70 bg-primary/10 px-2 py-1.5 font-normal leading-tight shadow-sm hover:bg-primary/10"
    >
      <div className="flex h-full items-center justify-start gap-x-2">
        <div className="flex items-center justify-between gap-2.5 px-1 leading-3">
          <p className="align-middle text-foreground">{tag}</p>
          {quantity && (
            <p className="pt-[3px] align-middle font-mono text-xs text-muted-foreground">
              {`(${quantity})`}
            </p>
          )}
        </div>

        {hasRemove && (
          <div className="flex h-full cursor-pointer items-center rounded-r-full border-l border-accent-foreground/15 pl-1">
            <Remove
              paramName="cursos"
              value={tag}
              className="h-[13px] w-[13px] text-foreground/60 hover:text-foreground/90"
            />
          </div>
        )}
      </div>
    </Badge>
  )
}

export { TagsBox }