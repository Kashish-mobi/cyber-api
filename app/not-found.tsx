import AppImage from './components/ui/Image'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
    <AppImage src="/website/404.png" alt="Not Found" width={500} height={500} className="w-full h-full max-w-[800px] max-h-[800px]" />
    </div>
  )
}

export default NotFoundPage