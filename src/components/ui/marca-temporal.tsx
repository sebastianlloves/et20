function MarcaTemporal() {
  const fecha = new Date().toLocaleString()

  return <div className="italic text-muted-foreground">{fecha}</div>
}

export default MarcaTemporal
