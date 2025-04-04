import NavDropdown from '@shared/layouts/navigation/NavDropdown'
import { useNav } from '@shared/layouts/navigation/useNav'

export const NavDropdowns = () => {
  const { dropdowns, openStates, toggle, closeAll } = useNav()

  return dropdowns.map(({ id, label, links, dataTestId = '' }, index) => (
    <NavDropdown
      key={index}
      id={id}
      dataTestId={dataTestId}
      label={label}
      links={links}
      open={openStates[index]}
      toggleCallback={toggle(index)}
    />
  ))
}
