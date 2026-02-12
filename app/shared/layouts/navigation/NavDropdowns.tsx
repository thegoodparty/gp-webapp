import NavDropdown from '@shared/layouts/navigation/NavDropdown'
import { useNav } from '@shared/layouts/navigation/useNav'
import { Dropdown } from '@shared/layouts/navigation/NavigationProvider'

interface NavDropdownsProps {
  dropdownIndices?: number[] | null
}

export const NavDropdowns = ({
  dropdownIndices = null,
}: NavDropdownsProps): React.JSX.Element[] => {
  const { dropdowns, openStates, toggle } = useNav()

  const filteredDropdowns = dropdownIndices
    ? dropdowns.filter((_dropdown, index) => dropdownIndices.includes(index))
    : dropdowns

  const getOriginalIndex = (filteredIndex: number) =>
    dropdownIndices ? dropdownIndices[filteredIndex] : filteredIndex

  return filteredDropdowns.map((dropdown: Dropdown, filteredIndex: number) => {
    const originalIndex = getOriginalIndex(filteredIndex)
    const { id, label, links, dataTestId = '' } = dropdown

    return (
      <NavDropdown
        key={originalIndex}
        id={id}
        dataTestId={dataTestId}
        label={label}
        links={links}
        open={openStates[originalIndex || 0] || false}
        toggleCallback={toggle(originalIndex || 0)}
      />
    )
  })
}
