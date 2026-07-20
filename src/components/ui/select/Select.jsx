import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ value, onChange, children, className = "", disabled = false, name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Extract options from standard <option> children
    const options = React.Children.toArray(children).map(child => {
        if (!child || !child.props) return null;
        return {
            value: child.props.value,
            label: child.props.children
        };
    }).filter(Boolean);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (disabled) return;
        if (onChange) {
            // Mimic native event structure for compatibility
            onChange({ target: { value: val, name } });
        }
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {/* Trigger Container */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex h-11 w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-all duration-200 ease-in-out shadow-theme-xs
                    ${disabled
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60 dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-500'
                        : isOpen
                            ? 'border-brand-500 shadow-focus-ring bg-white dark:bg-gray-900 cursor-pointer text-gray-800 dark:text-white'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer text-gray-800 dark:text-white'
                    }`}
            >
                <span className="truncate">{selectedOption?.label}</span>
                <div className={`flex items-center ml-2 transition-colors duration-200 ${disabled ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                    <ChevronDown size={18} strokeWidth={2} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-500 dark:text-brand-500' : ''}`} />
                </div>
            </div>

            {/* Custom Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute z-[999] w-full mt-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden py-1 transition-all duration-200 ease-out origin-top">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors duration-150
                                ${value === option.value
                                    ? 'bg-brand-50 text-brand-500 font-semibold dark:bg-brand-500/10 dark:text-brand-400'
                                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Select;
