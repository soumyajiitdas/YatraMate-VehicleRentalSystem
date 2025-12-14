import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  icon: Icon,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    if (disabled) return;
    
    // Determine value and label based on option type (string or object)
    const optionValue = typeof option === 'object' ? option.value : option;
    
    onChange(optionValue);
    setIsOpen(false);
  };

  // Get display label for current value
  const getDisplayLabel = () => {
    if (!value) return placeholder;
    
    const selectedOption = options.find(opt => 
      (typeof opt === 'object' ? opt.value : opt) === value
    );
    
    if (!selectedOption) return value; // Fallback
    
    return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative w-full pl-4 pr-10 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 bg-white
          ${isOpen ? 'border-primary-500 ring-2 ring-primary-100' : 'border-neutral-200 hover:border-primary-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : ''}
        `}
      >
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Icon className="w-5 h-5" />
          </span>
        )}
        
        <div className={`text-sm font-medium truncate ${Icon ? 'pl-7' : ''} ${!value ? 'text-neutral-400' : 'text-neutral-900'}`}>
          {getDisplayLabel()}
        </div>

        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5" />
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-in-down">
          <ul className="py-1">
            {options.map((option, index) => {
              const optValue = typeof option === 'object' ? option.value : option;
              const optLabel = typeof option === 'object' ? option.label : option;
              const isSelected = optValue === value;

              return (
                <li
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`
                    px-4 py-3 cursor-pointer text-sm font-medium transition-colors duration-150 flex items-center justify-between
                    ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-neutral-700 hover:bg-neutral-50'}
                  `}
                >
                  <span className="truncate">{optLabel}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
