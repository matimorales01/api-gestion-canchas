import React from "react";
import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch({ checked, onChange, label }) {
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
