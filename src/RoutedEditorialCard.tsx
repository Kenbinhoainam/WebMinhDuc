import type {ComponentProps, ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {EditorialCard} from './EditorialCard';
import {RevealFrame} from './motion';

const revealPhoto = (photo: ReactNode) => <RevealFrame effect="media" className="ed-row-photo">{photo}</RevealFrame>;

export function RoutedEditorialCard({archive, ...props}: Omit<ComponentProps<typeof EditorialCard>, 'renderLink' | 'renderArchivePhoto'> & {archive?: string}) {
  return <EditorialCard {...props} renderArchivePhoto={revealPhoto} renderLink={({href, ...link}) => <Link {...link} to={href} state={archive ? {archive} : undefined}/>}/>;
}
