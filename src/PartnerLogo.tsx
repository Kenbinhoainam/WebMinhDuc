import type {PartnerName} from './partners';

const logos: Partial<Record<PartnerName, string>> = {
  'Luxshare ICT': '/partners/luxshare.webp',
  FOXCONN: '/partners/foxconn.svg',
  SAMSUNG: '/partners/samsung.svg',
};

/** Text stays in the accessibility tree even when the decorative image loads. */
export default function PartnerLogo({name}: {name: PartnerName}) {
  const logo = logos[name];
  return <span className={`partner-logo${logo ? ' partner-logo--image' : ' partner-logo--text'}`}>
    {logo && <img src={logo} alt="" width="180" height="40" loading="lazy" />}
    <span className={logo ? 'partner-logo-name' : undefined}>{name}</span>
  </span>;
}
