import Link from 'next/link'

function Button() {
  return (
    <Link
      href={{
        pathname: '/analisis-academico',
        query: 'button',
      }}
    >
      <div>Button</div>
    </Link>
  )
}

export default Button
