
import React from 'react';
import { UsefulLink } from '../types';
import UsefulLinkCard from './UsefulLinkCard';

interface UsefulLinksListProps {
  links: UsefulLink[];
}

const UsefulLinksList: React.FC<UsefulLinksListProps> = ({ links }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map(link => (
        <UsefulLinkCard key={link.id} link={link} />
      ))}
    </div>
  );
};

export default UsefulLinksList;
