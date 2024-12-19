import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from 'components/App'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)
const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
