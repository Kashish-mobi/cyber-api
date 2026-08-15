import AppImage from './components/ui/Image'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center">
    <AppImage src="/website/404.png" alt="Not Found" width={1000} height={1000} />
    </div>
  )
}

export default NotFoundPage