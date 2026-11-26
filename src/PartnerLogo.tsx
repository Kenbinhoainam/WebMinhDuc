import {useState} from 'react';
import type {PartnerName} from './partners';

const logos: Record<PartnerName, string> = {
  'Luxshare ICT': '/partners/luxshare.svg',
  FOXCONN: '/partners/foxconn.svg',
  SAMSUNG: '/partners/samsung.svg',
  'JEILTECH VINA': '/partners/glovitech.webp',
  TACU: '/partners/tacu.webp',
};

/** Text stays in the accessibility tree even when the decorative image loads. */
export default function PartnerLogo({name}: {name: PartnerName}) {
  const [failedLogo,setFailedLogo] = useState<string>();
  const logo = logos[name] !== failedLogo ? logos[name] : undefined;
  return <span data-dark-mark={name === 'FOXCONN' && logo ? true : undefined} className={`partner-logo${logo ? ' partner-logo--image' : ' partner-logo--text'}`}>
    {logo && <img draggable={false} src={logo} onError={()=>setFailedLogo(logo)} alt="" width="180" height="40" loading="lazy" />}
    <span className={logo ? (name === 'JEILTECH VINA' ? 'partner-subsidiary-name' : 'partner-logo-name') : undefined}>{name}</span>
  </span>;
}
