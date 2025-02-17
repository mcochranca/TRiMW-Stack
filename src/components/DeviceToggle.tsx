import React, { useState } from 'react';

interface DeviceToggleProps {
  initialStatus: boolean;
}

const DeviceToggle: React.FC<DeviceToggleProps> = ({ initialStatus }) => {
  const [isOn, setIsOn] = useState(initialStatus);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div>
      <p>Device is {isOn ? 'On' : 'Off'}</p>
      <button onClick={handleToggle}>
        {isOn ? 'Turn Off' : 'Turn On'}
      </button>
    </div>
  );
};

export default DeviceToggle;
