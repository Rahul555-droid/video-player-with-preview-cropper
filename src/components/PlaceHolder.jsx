import { FaPlay } from 'react-icons/fa';

const PlaceHolder = ({
  title = 'Preview',
  icon = <FaPlay className="text-primary w-4 h-4" />,
  message = 'Preview not available',
  instructions = 'Please click on “Start Cropper” and then play video',
  containerClass = 'h-64 w-full', // For flexibility in parent dimensions
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClass}`}
    >
      <h3 className="text-sm font-medium text-gray-400 mb-32">{title}</h3>
      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg mb-2">
        {icon}
      </div>
      <p className="text-sm text-gray-200 font-medium mb-2">{message}</p>
      <p className="text-xs font-semibold text-gray-400 text-center">
        {instructions}
      </p>
    </div>
  );
};

export default PlaceHolder;
