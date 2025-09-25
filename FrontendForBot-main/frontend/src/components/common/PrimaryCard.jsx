import React from 'react';
import Card from './Card';
import AnimatedButton from './AnimatedButton';
import { Link } from 'react-router-dom';

/**
 * PrimaryCard
 * - A small wrapper around Card to give a consistent bold-blue CTA style.
 * - Props:
 *    - children: content inside the card
 *    - className: optional extra classes (appended)
 *    - action: optional { to, text, inverted } to render a CTA button (Link)
 *    - center: boolean (center content)
 */
const PrimaryCard = ({ children, className = '', action = null, center = true }) => {
  const base = 'flex flex-col justify-center items-center text-center h-full text-white';
  return (
    <Card className={`${base} bg-[#2563EB] shadow-md ${className}`}>
      <div className="w-full max-w-[36rem]">
        {children}
        {action && action.to && (
          <div className="mt-6 flex justify-center">
            {/* Use Link for client-side navigation */}
            <Link to={action.to}>
              <AnimatedButton
                className={`!px-6 !py-3 !rounded-lg font-semibold ${action.inverted ? '!bg-white !text-[#2563EB]' : '!bg-[#0f4ad6] !text-white'}`}
              >
                {action.text}
              </AnimatedButton>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PrimaryCard;
