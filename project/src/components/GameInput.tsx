import { Send } from 'lucide-react';

interface GameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  minRange: number;
  maxRange: number;
}

export const GameInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  minRange,
  maxRange,
}: GameInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter a number between {minRange} and {maxRange}
      </label>
      <div className="flex space-x-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          min={minRange}
          max={maxRange}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Your guess..."
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
        >
          <span>Guess</span>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
