type RadioProps = {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: () => void
  label?: string
  width?: string
  height?: string
}
export const Radio = ({ id, name, value, checked, onChange, label = '', width = '16px', height = '16px' }: RadioProps) => {

  return (
    <label className='flex items-center gap-[8px] cursor-pointer'>
      <input type='radio' id={id} name={name} value={value} checked={checked} onChange={onChange} className='opacity-0 absolute' />
      <span className={`w-[${width}] h-[${height}] border border-primary rounded-full relative`}>
        {checked && <span className='w-[12px] h-[12px] bg-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></span>}
      </span>
    </label>
  )
}
export default Radio