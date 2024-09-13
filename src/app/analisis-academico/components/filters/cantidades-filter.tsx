import { Calculator } from 'lucide-react'
import Filter from './filter'
import SliderItem from './slider-item'

function CantidadesFilter() {
  return (
    <Filter
      title="Cantidades"
      maxTags={3}
      icon={<Calculator size={17} strokeWidth={1.2} />}      
    >
      <SliderItem />
    </Filter>
  )
}
export default CantidadesFilter
