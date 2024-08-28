import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

function TagsBox({ tags }: { tags: string[] }) {
  return (
    <div className="w-full bg-muted/25 p-2 shadow-inner">
      <AllTags tags={tags} />
    </div>
  )
}

function AllTags({ tags }: { tags: string[] }) {
  return (
    <div className="my-1 w-full">
      {tags.length > 1 && (
        <X
          size={15}
          strokeWidth="1.8px"
          className="mb-1 ml-auto cursor-pointer text-muted-foreground/80"
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

function TagBadge({ tag, quantity }: { tag: string; quantity?: number }) {
  return (
    <Badge
      variant="default"
      className="max-w-full justify-center rounded-2xl border-primary/70 bg-primary/10 py-1.5 pl-2 pr-1 font-normal leading-tight shadow-sm hover:bg-primary/10"
    >
      <div className="flex h-full items-center justify-start">
        <div className="flex items-center justify-between gap-2.5 px-1">
          <p className="align-middle text-foreground">{tag}</p>
          {quantity && (
            <p className="pt-[3px] align-middle font-mono text-xs text-muted-foreground">
              {`(${quantity})`}
            </p>
          )}
        </div>
        <div className="flex h-full cursor-pointer rounded-r-full border-l border-accent-foreground/15 px-1">
          <X
            size={13}
            strokeWidth="1.5px"
            className="h-full text-accent-foreground/55"
          />
        </div>
      </div>
    </Badge>
  )
}

export { TagsBox }
