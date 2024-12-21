import { useState } from 'react'

export default function ButtonGrid({ buttons, rightButtons, onAction }) {
  const [activeButton, setActiveButton] = useState(null) // Tracks active button

  const handleButtonClick = (action, index) => {
    setActiveButton(index)
    if (onAction) {
      onAction(action) // Trigger the handler with the action
    }
  }

  return (
    <div className="w-full border-t border-secondary p-4">
      <div className="flex items-center justify-between">
        {/* Left Button Group */}
        <div className="flex items-center justify-start gap-2">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(button.action, index)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  activeButton !== index
                    ? 'text-white bg-purple-900 hover:bg-purple-800'
                    : 'text-white bg-purple-700 hover:bg-purple-800'
                }`}
              disabled={button.disabled || false}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Right Button (Optional) */}
        {rightButtons.map((button, index) => (
          <button
            key={index}
            disabled={button.disabled || false}
            onClick={() => onAction && button.action && onAction(button.action)}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-transparent rounded-lg hover:text-white"
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}
