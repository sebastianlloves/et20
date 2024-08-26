interface TagsBoxProps {
  tags?: string[]
}

function TagsBox({ tags }: TagsBoxProps) {
  return (
    <div className="w-full bg-muted/25 p-2 shadow-inner">
      <p>{JSON.stringify(tags)}</p>
    </div>
  )
}

export default TagsBox
