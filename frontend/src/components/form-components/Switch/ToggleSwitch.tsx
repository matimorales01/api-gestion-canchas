import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
    return (
        <label className={styles.switchWrapper}>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className={styles.input}
            />
            <span className={styles.slider}></span>
            <span className={styles.switchLabel}>{label}</span>
        </label>
    );
}
