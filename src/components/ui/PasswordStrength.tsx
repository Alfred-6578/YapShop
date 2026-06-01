type Props = {
  password: string
}

const PasswordStrength = ({ password }: Props) => {
  if (password.length === 0) return null

  let widthClass: string, color: string, label: string
  if (password.length < 6) {
    widthClass = 'w-1/4'
    color = '#F09595'
    label = 'Weak'
  } else if (password.length < 10) {
    widthClass = 'w-3/5'
    color = '#F0C36B'
    label = 'Medium'
  } else {
    widthClass = 'w-full'
    color = '#15C26A'
    label = 'Strong'
  }

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-[3px] rounded-[2px] bg-[#1B1C21] overflow-hidden">
        <span
          className={`block h-full ${widthClass} transition-[width] duration-150`}
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10.5px]" style={{ color }}>{label}</span>
    </div>
  )
}

export default PasswordStrength
