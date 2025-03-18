import { Button } from './components/Button';
import { ThemeProvider } from 'styled-components';

import { defaultTheme } from './components/styles/themes/default';
import { GlobalStyle } from './components/styles/global';

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
    <Button variant="primary"></Button>
    <Button variant="secondary"></Button>
    <Button variant="danger"></Button>
    <Button variant="sucess"></Button>

    <GlobalStyle/>

    </ThemeProvider>
  )
}