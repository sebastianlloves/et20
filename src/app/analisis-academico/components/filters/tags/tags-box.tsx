'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ParamsValues } from '@/app/analisis-academico/page'
import { useStateInUrl } from '@/hooks/useParamsState'

function TagsBox({
  tags,
  paramKeys,
  maxTags,
}: {
  tags: {
    value: string | string[]
    tagText: string
    removeTagState: ParamsValues
    quantity?: number | null
    className?: string
  }[]
  paramKeys: (keyof ParamsValues)[]
  maxTags: number
}) {
  const { updateSearchParams } = useStateInUrl()

  return (
    <div className="w-full bg-muted/20 p-2 shadow-inner">
      <ConditionalWrapper
        condition={tags.length > maxTags}
        tagsQuantity={tags.length}
      >
        <div className="w-full">
          {tags.length > 1 && (
            <div>
              <X
                strokeWidth="1.5px"
                className="-mr-0.5 ml-auto h-3.5 w-3.5 cursor-pointer text-foreground/80 hover:text-foreground"
                onClick={() => undefined}
              />
            </div>
          )}

          <div className="mt-0.5 flex flex-wrap justify-start gap-1.5 overflow-hidden lg:mt-1">
            {tags.map(
              ({
                value,
                tagText,
                removeTagState,
                quantity,
                className,
              }) => {
                return (
                  <Badge
                    key={`${value}`}
                    variant="default"
                    className={cn(
                      'max-w-full cursor-pointer justify-center rounded-2xl border-primary/60 bg-primary/5 px-1.5 py-1 text-xs font-normal leading-tight shadow-sm hover:bg-primary/10 lg:px-2 lg:py-1.5',
                      className,
                    )}
                    onClick={() => updateSearchParams(removeTagState)}
                  >
                    <div className="flex h-full items-center justify-start">
                      <div className="flex items-center justify-between gap-3 px-2 leading-3">
                        <p className="text-pretty align-middle text-[length:inherit] leading-snug text-foreground/80">
                          {tagText}
                        </p>
                        {quantity === undefined ? (
                          <Skeleton className="h-1 w-5 rounded-md bg-primary/50" />
                        ) : (
                          quantity !== null && (
                            <p className="mt-0.5 align-middle font-mono text-[length:inherit] leading-tight text-muted-foreground/80">
                              {`(${quantity})`}
                            </p>
                          )
                        )}
                      </div>
                      <div className="flex h-full cursor-pointer items-center rounded-r-full border-l border-accent-foreground/15 pl-1">
                        <X
                          strokeWidth="1.5px"
                          className="h-[13px] w-[13px] cursor-pointer text-foreground/60 hover:text-foreground/90"
                        />
                      </div>
                    </div>
                  </Badge>
                )
              },
            )}
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
  children: ReactNode
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filter" className="my-1 border-b-0">
        <div className="flex items-center">
          <AccordionTrigger className="py-0 pr-2.5 hover:no-underline">
            <Badge
              variant="default"
              className={
                'max-w-full justify-center rounded-lg border-primary/70 bg-primary/10 px-2 py-1.5 text-xs font-normal leading-tight shadow-sm hover:bg-primary/10'
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
