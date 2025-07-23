import NavDropdown from '@shared/layouts/navigation/NavDropdown'
import { useNav } from '@shared/layouts/navigation/useNav'

export const NavDropdowns = ({ dropdownIndices = null }) => {
  const { dropdowns, openStates, toggle, closeAll } = useNav()

  const filteredDropdowns = dropdownIndices 
    ? dropdowns.filter((_, index) => dropdownIndices.includes(index))
    : dropdowns

  const getOriginalIndex = (filteredIndex) => {
    if (!dropdownIndices) return filteredIndex
    return dropdownIndices[filteredIndex]
  }

  return filteredDropdowns.map(({ id, label, links, dataTestId = '' }, filteredIndex) => {
    const originalIndex = getOriginalIndex(filteredIndex)
    
    return (
      <NavDropdown
        key={originalIndex}
        id={id}
        dataTestId={dataTestId}
        label={label}
        links={links}
        open={openStates[originalIndex]}
        toggleCallback={toggle(originalIndex)}
      />
    )
  })
}
