import React from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ password }) => {
  const testResult = zxcvbn(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strength = testResult.score;

  const getStrengthColor = () => {
    const colors = ["red", "orange", "yellow", "green", "darkgreen"];
    return colors[strength];
  };

  return (
    <div>
      <progress
        value={strength}
        max="4"
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#f3f3f3",
          border: "none",
        }}
      ></progress>
      <p
        style={{
          color: getStrengthColor(),
          fontWeight: "bold",
        }}
      >
        Password Strength: {strengthLabels[strength]}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;

