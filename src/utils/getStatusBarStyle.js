export const getStatusBarStyle = ({ 
  isHome,
  isModalOpen,
  theme
}) => {
  const res = { statusBarColor: 'black', statuBarStyle: 'light-content' }

  if(!isModalOpen) {
    res.statusBarColor = isHome ? theme.colors.surface : theme.colors.primary
    isHome && (res.statuBarStyle = 'dark-content')
  }
  
  return res
}

