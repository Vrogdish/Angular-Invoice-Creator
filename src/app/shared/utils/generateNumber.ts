import { UserProfile } from '../../features/profile/models/userProfile.model';

export function generateNumber(
  type: 'invoice' | 'delivery',
  profile: UserProfile
) {
  const typeLabel = type === 'invoice' ? 'INV' : 'DEL';
  const vendorLabel =
    profile.firstname[0].toUpperCase() + profile.lastname[0].toUpperCase();
    
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ]/g, '') 
    .slice(0, 14); 
  
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return `${typeLabel}-${vendorLabel}-${timestamp}-${randomSuffix}`;
}
