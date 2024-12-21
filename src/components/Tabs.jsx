import { useState } from 'react';

const Tabs = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || '');

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
    onTabChange(tabValue);
  };

  return (
    <div className="flex rounded-md bg-secondary p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors text-nowrap ${
            activeTab === tab.value
              ? 'bg-primary text-white'
              : 'bg-secondary text-gray-400 hover:bg-primary hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
