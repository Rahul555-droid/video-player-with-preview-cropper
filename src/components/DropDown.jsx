import { useState, useRef, useEffect } from 'react'
import { FaChevronDown as ChevronDown } from 'react-icons/fa'

const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState('bottom') // 'top' or 'bottom'
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Adjust position based on available space
      if (rect.bottom + 150 > viewportHeight) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }
    }
  }, [isOpen])

  const handleOptionClick = (option) => {
    if (!disabled) {
      onChange(option)
      setIsOpen(false)
    }
  }

  const selectedOption = options.find((opt) => opt === value)

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block min-w-48 ${className}`}
    >
      <button
        type="button"
        className={`
          flex justify-between items-center w-full px-3 py-2
          bg-primary text-white rounded-md
          border border-secondary
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-secondary'}
        `}
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span className="truncate">
          {label}: {selectedOption || 'Select'}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute ${
              position === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
            }
            left-0 right-0 bg-primary rounded-md border border-secondary shadow-lg z-50
          `}
        >
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li
                key={option}
                className={`
                  px-3 py-2 cursor-pointer transition-colors duration-150
                  ${
                    option === value
                      ? 'bg-blue-500/20 text-white'
                      : 'text-white/90 hover:bg-secondary'
                  }
                `}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown
