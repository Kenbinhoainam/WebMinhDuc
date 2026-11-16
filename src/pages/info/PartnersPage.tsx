import {PageHero} from '../../shared';
import {assets} from './data';
import {ServiceCustomers} from './ServicesPages';
import './partners-reference.css';
/** This route uses the customer/testimonial composition while retaining Minh Đức sample content. */
export function PartnersPage(){return <><PageHero title="Đối tác & kết nối" description="Cùng hướng tới những cơ hội việc làm phù hợp." image={assets.services}/><div className="md-partners-grid"><ServiceCustomers logosAfter/><p className="container info-content-note">Danh sách thể hiện thông tin được cung cấp cho prototype; không đồng nghĩa mọi đối tác đều đang có vị trí tuyển dụng.</p></div></>}
