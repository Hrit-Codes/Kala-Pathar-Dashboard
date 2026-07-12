"use client";

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
    disabled?: boolean;
}

export default function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 tracking-wide">Theme Color</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-neutral-200 bg-white">
                <input
                    type="color"
                    value={value || "#10B981"}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="h-6 w-6 rounded cursor-pointer border-0 p-0 bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                    {value || "#10B981"}
                </span>
            </div>
        </div>
    );
}